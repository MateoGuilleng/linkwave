// api/boxes/position/[title]
import Project from "@/models/project";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const PUT = async (request, { params }) => {
  await connect();

  const projectTitle = params.title;

  try {
    const { itemId, newPosition, newId } = await request.json();

    // Encuentra el proyecto que contiene el box con el ID específico
    const project = await Project.findOne({ title: projectTitle });

    if (!project) {
      return NextResponse.error(
        `Project with title ${projectTitle} not found`,
        404
      );
    }

    // Encuentra y actualiza el box específico dentro del array `boxes`
    const updatedProject = await Project.findOneAndUpdate(
      {
        title: projectTitle,
        "boxes.id": itemId, // Busca el box con el ID específico dentro del array `boxes`
      },
      {
        $set: {
          "boxes.$.id": newId, // Actualiza el ID del box específico
          "boxes.$.position": newPosition, // Actualiza la posición del box específico
        },
      },
      { new: true } // Devuelve el documento actualizado
    );

    if (!updatedProject) {
      return NextResponse.error(
        `Box with ID ${itemId} not found in project`,
        404
      );
    }

    console.log(
      `Successfully updated position and ID for item with ID ${itemId}`
    );

    // Muestra el box actualizado en la consola
    const updatedBox = updatedProject.boxes.find((box) => box.id === newId);
    console.log("Updated Box:", updatedBox);

    return NextResponse.json({
      message: `Position and ID updated for box ID ${itemId}`,
      updatedProject,
    });
  } catch (error) {
    console.error("Error updating position and ID:", error);
    return NextResponse.error("Failed to update position and ID", 500);
  }
};
