// api/[user]/projects/route.js

import Project from "@/models/project";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  await connect();
  const userEmail = params.user; // Obtenemos el ID del usuario desde los parámetros
  try {
    // Buscamos todos los proyectos donde el array `starredBy` contenga el ID del usuario
    const projects = await Project.find({ followBy: userEmail });

    // Respondemos con los proyectos encontrados
    return NextResponse.json({ projects });
  } catch (error) {
    // Manejo de errores
    return NextResponse.json(
      { error: "Error retrieving projects" },
      { status: 500 }
    );
  }
};
