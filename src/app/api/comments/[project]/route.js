import project from "@/models/project";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const PUT = async (request, { params }) => {
  await connect();

  const { commentId, newComment } = await request.json();
  const projectTitle = params.project;

  try {
    // Encuentra y actualiza el comentario específico dentro del proyecto
    const updatedProject = await project.findOneAndUpdate(
      { title: projectTitle, "comments.id": commentId },
      {
        $set: {
          "comments.$.comment": newComment,
          "comments.$.edited": true, // Establece la propiedad edited a true
        },
      },
      { new: true }
    );

    // Si el proyecto no se encuentra, devolver un error 404
    if (!updatedProject) {
      return new NextResponse("Proyecto no encontrado", { status: 404 });
    }

    // Devuelve el proyecto actualizado
    return new NextResponse(JSON.stringify(updatedProject), { status: 200 });
  } catch (error) {
    // Manejar errores específicos
    if (error.name === "CastError") {
      // Manejar error de tipo de datos incorrecto
      return new NextResponse("Formato de datos inválido", { status: 400 });
    } else {
      // Otros errores
      console.error("Error:", error);
      return new NextResponse("Error interno del servidor", { status: 500 });
    }
  }
};

export const DELETE = async (request, { params }) => {
  await connect();

  const projectTitle = await params.project;
  const { commentId } = await request.json();

  console.log(commentId)

  try {
  
    const existingProject = await project.findOne({ title: projectTitle });
    if (!existingProject) {
      return new NextResponse("Proyecto no encontrado", { status: 404 });
    }

    console.log(commentId);

    // Actualiza el proyecto eliminando el comentario específico
    const updatedProject = await project.findOneAndUpdate(
      { title: projectTitle },
      { $pull: { comments: { id: commentId } } },
      { new: true }
    );

    // Si el proyecto no se encuentra, devuelve un error 404
    if (!updatedProject) {
      return new NextResponse("Comentario no encontrado en el proyecto", {
        status: 405,
      });
    }

    // Devuelve el proyecto actualizado
    return new NextResponse(JSON.stringify(projectTitle), { status: 200 });
  } catch (error) {
    // Maneja errores específicos
    if (error.name === "CastError") {
      return new NextResponse("Formato de datos inválido", { status: 400 });
    } else {
      console.error("Error:", error);
      return new NextResponse("Error interno del servidor", { status: 500 });
    }
  }
};
