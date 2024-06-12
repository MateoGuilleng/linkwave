import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/utils/db";
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

export const PUT = async (request, { params }) => {
  try {
    await connectToDatabase();

    // Check if gfs is initialized
    if (!gfs) {
      throw new Error("GridFS not initialized");
    }

    const data = await request.formData();
    const file = data.get("file");
    const boxTitle = data.get("title");
    const projectName = data.get("projectName");

    const fileId = params.id;

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
          const project = await Project.findOne({ title: projectName });

          if (!project) {
            throw new Error("Project not found");
          }

          const boxToUpdate = project.boxes.find(
            (box) => box.title === boxTitle
          );

          if (!boxToUpdate) {
            throw new Error("Box not found");
          }

          const updatedBoxFiles = [
            ...boxToUpdate.boxFiles,
            {
              filename: file.name,
              filetype: file.type,
              fileId: fileId,
            },
          ];

          const update = {
            $set: {
              "boxes.$[box].boxFiles": updatedBoxFiles,
            },
          };

          const options = {
            arrayFilters: [{ "box.title": boxTitle }],
            new: true,
          };

          const updatedProject = await Project.findOneAndUpdate(
            { title: projectName },
            update,
            options
          );

          if (!updatedProject) {
            throw new Error("Error updating project");
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
  } catch (error) {
    console.error("Error handling upload request:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (request, { params }) => {
  await connectToDatabase();

  const fileId = params.id;

  // Aquí obtenemos el cuerpo de la solicitud de manera diferente
  const { projectTitle } = JSON.parse(await request.text());

  console.log(fileId, projectTitle); // Asegúrate de que projectTitle se imprima correctamente

  try {
    // Eliminar referencias del fileId en el array boxFiles de todos los proyectos que coincidan con el projectTitle
    const updatedProjects = await Project.updateMany(
      { title: projectTitle, "boxes.boxFiles.fileId": fileId },
      { $pull: { "boxes.$[].boxFiles": { fileId } } }
    );

    // Eliminar fileId del array files de todos los proyectos que coincidan con el projectTitle
    const updateFiles = await Project.updateMany(
      { title: projectTitle },
      { $pull: { files: fileId } }
    );

    if (
      updatedProjects.modifiedCount === 0 &&
      updateFiles.modifiedCount === 0
    ) {
      return new NextResponse(
        "No projects found with references to this file",
        {
          status: 404,
        }
      );
    }

    return new NextResponse("File references deleted successfully", {
      status: 200,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return new NextResponse("Invalid data format", { status: 400 });
    } else {
      console.error("Error deleting file references:", error);
      return new NextResponse("Internal server error", { status: 500 });
    }
  }
};
