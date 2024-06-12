import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Grid from "gridfs-stream";
import Project from "@/models/project";

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

    const data = await request.json();
    const { box, projectId } = data;

    if (!projectId || !box) {
      return NextResponse.json(
        { message: "Project ID and box data are required." },
        { status: 400 }
      );
    }

    // Buscar el proyecto y hacer un push del box al array boxes
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found." },
        { status: 404 }
      );
    }

    project.boxes.push(box);
    await project.save();

    return NextResponse.json(
      { message: "Box added successfully.", box },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding box to project:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();

    const data = await request.json();
    const { projectTitle, requestBoxId } = data;

    console.log("desde api deltete", projectTitle, requestBoxId);

    if (!projectTitle || !requestBoxId) {
      return NextResponse.json(
        { message: "projectTitle and request box ID are required." },
        { status: 400 }
      );
    }

    // Buscar el proyecto y eliminar el request box con el ID específico
    const project = await Project.findOne({ title: projectTitle });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found." },
        { status: 404 }
      );
    }

    // Filtrar el array requestBoxes para eliminar el elemento con requestBoxId
    project.requestBoxes = project.requestBoxes.filter(
      (box) => box.identifier.toString() !== requestBoxId
    );

    await project.save();

    return NextResponse.json(
      { message: "Request box deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting request box:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
