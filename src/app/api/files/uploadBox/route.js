// "api/files/uploadFile/route.js";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Grid from "gridfs-stream";
import Project from "@/models/project"; // Asegúrate de importar el modelo correcto de proyecto

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

    // Ensure GridFS is initialized
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
    console.log("GridFS initialized successfully");
  }
};

export async function POST(request) {
  try {
    await connectToDatabase();

    // Check if gfs is initialized
    if (!gfs) {
      throw new Error("GridFS not initialized");
    }

    const data = await request.formData();
    const file = data.get("file");
    const description = data.get("description");
    const projectID = data.get("projectID");
    const title = data.get("title");
    const category = data.get("category");

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise(async (resolve, reject) => {
      const writestream = gfs.createWriteStream({
        filename: file.name,
        contentType: file.type,
        metadata: { originalname: file.name },
      });

      writestream.on("finish", async () => {
        // File uploaded successfully, now retrieve the file ID
        const fileId = writestream.id.toString();

        try {
          const projectId = projectID; // Usar el ID del proyecto proporcionado
          const project = await Project.findById(projectId);

          if (!project) {
            throw new Error("Project not found");
          }

          const nextBoxId = project.boxes.length + 1; // Incrementar el ID de box

          const update = {
            $push: {
              files: fileId,
              boxes: {
                id: nextBoxId,
                title,
                category,
                description,
                column: "main", // Añadir la propiedad column con valor 'main'
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
            projectId,
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
        console.error("Error uploading file to MongoDB:", err);
        reject(
          NextResponse.json(
            { message: "Upload failed", error: err.message },
            { status: 500 }
          )
        );
      });

      writestream.end(buffer);
    });
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

    const { fileId } = await request.json();

    if (!fileId) {
      return NextResponse.json(
        { message: "File ID is required" },
        { status: 400 }
      );
    }

    await gfs.remove(
      { _id: mongoose.Types.ObjectId(fileId), root: "uploads" },
      (err) => {
        if (err) {
          return NextResponse.json(
            { message: "Error deleting file", error: err.message },
            { status: 500 }
          );
        }
      }
    );

    await mongoose.connection.db
      .collection("fs.chunks")
      .deleteMany({ files_id: mongoose.Types.ObjectId(fileId) });
    await mongoose.connection.db
      .collection("fs.files")
      .deleteOne({ _id: mongoose.Types.ObjectId(fileId) });

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error handling delete request:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
