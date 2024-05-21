import project from "@/models/project";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const PUT = async (req, { params }) => {
  await connect();
  const { binaryStar, starredBy } = await req.json();
  const projectTitle = params.project;

  try {
    // Encuentra el proyecto por su título
    const foundProject = await project.findOne({ title: projectTitle });

    if (!foundProject) {
      return new NextResponse("Project not found", { status: 404 });
    }

    if (binaryStar === 1) {
      // Añadir una estrella si el usuario no ha dado una estrella anteriormente
      if (!foundProject.starredBy.includes(starredBy)) {
        foundProject.stars += 1;
        foundProject.starredBy.push(starredBy);
      }
    } else if (binaryStar === 0) {
      // Remover la estrella si el usuario había dado una estrella anteriormente
      const emailIndex = foundProject.starredBy.indexOf(starredBy);
      if (emailIndex !== -1) {
        foundProject.stars -= 1;
        foundProject.starredBy.splice(emailIndex, 1);
      }
    }

    await foundProject.save();

    return new NextResponse(JSON.stringify(foundProject.stars), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
