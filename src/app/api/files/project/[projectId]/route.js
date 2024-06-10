// /api/files/project/[projectId].js
import { getGridFSBucket } from "@/utils/getGridBucket";
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import Project from "@/models/project"; // Importa correctamente el modelo del proyecto
import mongoose from "mongoose"; // Importa mongoose

export async function GET(req, { params }) {
  await connect();

  const projectId = params.projectId;

  try {
    // Encuentra el proyecto por su ID
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Obtén los fileId del array boxes
    const fileIds = project.boxes.map((box) =>
      mongoose.Types.ObjectId(box.fileId)
    );

    // Obtén el bucket de GridFS
    const bucket = await getGridFSBucket();

    // Encuentra los archivos que coincidan con los fileId
    const files = await bucket.find({ _id: { $in: fileIds } }).toArray();

    return NextResponse.json(files);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}
