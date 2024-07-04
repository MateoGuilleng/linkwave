import project from "@/models/project";
import user from "@/models/user";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const PUT = async (req, { params }) => {
  await connect();
  const { binaryFollow, followBy } = await req.json();
  console.log(followBy);
  const projectTitle = params.project;

  try {
    // Encuentra el proyecto por su título
    const foundProject = await project.findOne({ title: projectTitle });

    // Encuentra el usuario por su correo electrónico
    const userFound = await user.findOne({ email: followBy });

    if (!foundProject) {
      return new NextResponse("Project not found", { status: 404 });
    }

    if (!userFound) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (binaryFollow === 1) {
      // Añadir una estrella si el usuario no ha dado una estrella anteriormente
      if (!foundProject.followBy.includes(followBy)) {
        foundProject.followers += 1;
        foundProject.followBy.push(followBy);
        // Agregar el proyecto al array followingProjects del usuario
        if (!userFound.followingProjects.includes(foundProject._id)) {
          userFound.followingProjects.push(foundProject._id);
        }
      }
    } else if (binaryFollow === 0) {
      // Remover la estrella si el usuario había dado una estrella anteriormente
      const emailIndex = foundProject.followBy.indexOf(followBy);
      if (emailIndex !== -1) {
        foundProject.followers -= 1;
        foundProject.followBy.splice(emailIndex, 1);
        // Remover el proyecto del array followingProjects del usuario
        const projectIndex = userFound.followingProjects.indexOf(
          foundProject._id
        );
        if (projectIndex !== -1) {
          userFound.followingProjects.splice(projectIndex, 1);
        }
      }
    }

    await foundProject.save();
    await userFound.save();

    return new NextResponse(JSON.stringify(foundProject.followBy), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
