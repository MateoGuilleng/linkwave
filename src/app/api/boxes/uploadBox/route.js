// /api/boxes/uploadBox

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Grid from "gridfs-stream";
import Project from "@/models/project";
import { v4 as uuidv4 } from "uuid"; // Importar uuid para generar identificadores únicos

if (!process.env.MONGO_URL) {
  throw new Error(
    "Please define the MONGO_URL environment variable inside .env.local"
  );
}

const mongoURI = process.env.MONGO_URL;

let gfs;
let conn;

const connectToDatabase = async () => {
  if (!conn) {
    conn = await mongoose.createConnection(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Asegurar que GridFS esté inicializado
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
    console.log("GridFS initialized successfully");
  }
};

export async function POST(request) {
  try {
    await connectToDatabase();

    // Verificar si gfs está inicializado
    if (!gfs) {
      throw new Error("GridFS not initialized");
    }

    const data = await request.formData();
    const file = data.get("file");
    const description = data.get("description");
    const projectID = data.get("projectID");
    const title = data.get("title");
    const category = data.get("category");

    console.log("file desde api:", file);

    const project = await Project.findById(projectID);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    const nextBoxId = project.boxes.length + 1;
    const identifier = uuidv4();

    if (!file || typeof file.arrayBuffer !== "function") {
      // Crear una caja sin archivo
      const update = {
        $push: {
          boxes: {
            position: nextBoxId,
            identifier: identifier,
            title,
            category,
            description,
            column: "main",
            boxFiles: [],
          },
        },
      };

      const updatedProject = await Project.findByIdAndUpdate(
        projectID,
        update,
        { new: true }
      );

      if (!updatedProject) {
        return NextResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Box created successfully without file",
      });
    } else {
      // Procesar la subida del archivo
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      return new Promise((resolve, reject) => {
        const writestream = gfs.createWriteStream({
          filename: file.name,
          contentType: file.type,
          metadata: { originalname: file.name },
        });

        writestream.on("finish", async () => {
          const fileId = writestream.id.toString();

          try {
            const update = {
              $push: {
                files: fileId,
                boxes: {
                  position: nextBoxId,
                  identifier: identifier,
                  title,
                  category,
                  description,
                  column: "main",
                  boxFiles: [
                    {
                      filename: file.name,
                      filetype: file.type,
                      fileId: fileId,
                    },
                  ],
                },
              },
            };

            const updatedProject = await Project.findByIdAndUpdate(
              projectID,
              update,
              { new: true }
            );

            if (!updatedProject) {
              throw new Error("Project not found");
            }

            resolve(
              NextResponse.json({
                message: "File uploaded and project updated successfully",
              })
            );
          } catch (error) {
            console.error(
              "Error updating project with file ID and description:",
              error
            );
            reject(
              NextResponse.json(
                { message: "Error updating project", error: error.message },
                { status: 500 }
              )
            );
          }
        });

        writestream.on("error", (err) => {
          console.error("Error occurred during writestream:", err);
        });

        writestream.end(buffer, () => {
          console.log("Buffer has been written to GridFS");
        });
      });
    }
  } catch (error) {
    console.error("Error handling upload request:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { identifier } = await request.json();

    if (!identifier) {
      return NextResponse.json(
        { message: "Identifier is required" },
        { status: 400 }
      );
    }

    const project = await Project.findOneAndUpdate(
      { "boxes.identifier": identifier },
      {
        $pull: { boxes: { identifier: identifier } },
      },
      { new: true }
    );

    if (!project) {
      return NextResponse.json({ message: "Box not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Box deleted successfully" });
  } catch (error) {
    console.error("Error handling delete request:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
