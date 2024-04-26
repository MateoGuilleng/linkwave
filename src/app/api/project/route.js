import project from "@/models/project";
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const POST = async (request) => {
  const { title, description, content, author } = await request.json();

  await connect();

  const existingProject = await project.findOne({ title });

  if (existingProject) {
    return new NextResponse("Project already exists", { status: 400 });
  }

  const newProject = new project({
    title,
    description,
    content,
    author,
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

    const data = await getServerSession(authOptions);
    const author = data.user.name;
    const projects = await project.find({ author });

    if (!projects || projects.length === 0) {
      return new NextResponse("No projects found for the author", {
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

