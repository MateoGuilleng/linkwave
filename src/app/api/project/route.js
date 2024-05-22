import project from "@/models/project";
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const POST = async (request) => {
  const { title, description, content, author, projectType } =
    await request.json();

  await connect();
  const stars = 0;
  const existingProject = await project.findOne({ title });

  if (existingProject) {
    return new NextResponse("Project already exists", { status: 400 });
  }

  const newProject = new project({
    title,
    description,
    content,
    author,
    projectType,
    stars,
  });

  try {
    await newProject.save();
    return new NextResponse("project is created", { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};

export const GET = async (request, res) => {
  try {
    await connect();

    // Verificar la URL de la solicitud para determinar la fuente
    const isFeedRequest = request.url.includes("feed");

    console.log(request.HeadersList);

    const data = await getServerSession(authOptions);

    let projects;
    if (isFeedRequest) {
      // Si la solicitud proviene de la ruta /feed, obtener todos los proyectos de todos los usuarios
      projects = await project.find();
    } else {
      // Si la solicitud no proviene de la ruta /feed, obtener solo los proyectos del usuario de la sesión
      projects = await project.find(); // Eliminamos la condición que filtra por autor
    }

    if (!projects || projects.length === 0) {
      return new NextResponse("No projects found", {
        status: 404,
      });
    } else {
      // Devolver proyectos como respuesta
      return new NextResponse(JSON.stringify(projects), { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
