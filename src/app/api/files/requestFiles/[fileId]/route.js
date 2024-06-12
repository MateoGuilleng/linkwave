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

export const DELETE = async (request, { params }) => {
  await connectToDatabase();

  const fileId = params.fileId;

  // Aquí obtenemos el cuerpo de la solicitud de manera diferente
  const { projectTitle } = JSON.parse(await request.text());

  console.log(fileId, projectTitle); // Asegúrate de que projectTitle se imprima correctamente

  try {
    // Eliminar referencias del fileId en el array boxFiles de todos los proyectos que coincidan con el projectTitle
    const updatedProjects = await Project.updateMany(
      { title: projectTitle, "requestBoxes.requestBoxFiles.fileId": fileId },
      { $pull: { "requestBoxes.$[].requestBoxFiles": { fileId } } }
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
