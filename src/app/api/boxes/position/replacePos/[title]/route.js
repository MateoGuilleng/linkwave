// api/boxes/position/replacePos/[title]
import Project from "@/models/project";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const PUT = async (request, { params }) => {
  await connect();

  const projectTitle = params.title;

  try {
    const { itemId, newPosition, hoverId, newHoverBoxPosition } =
      await request.json();

    console.log(
      "Desde API:",
      itemId,
      newPosition,
      hoverId,
      newHoverBoxPosition
    );

    const updatedProject = await Project.findOneAndUpdate(
      {
        title: projectTitle,
        "boxes.identifier": itemId, // Busca el box con el ID específico dentro del array `boxes`
      },
      {
        $set: {
          "boxes.$.position": newPosition, // Actualiza la posición del box específico
        },
      },
      { new: true } // Devuelve el documento actualizado
    );

    await Project.findOneAndUpdate(
      {
        title: projectTitle,
        "boxes.identifier": hoverId, // Busca el box con el ID específico dentro del array `boxes`
      },
      {
        $set: {
          "boxes.$.position": newHoverBoxPosition, // Actualiza la posición del box específico
        },
      },
      { new: true } // Devuelve el documento actualizado
    );

    if (!updatedProject) {
      return NextResponse.error(
        `Box with ID ${itemId} or hover ID ${hoverId} not found in project`,
        404
      );
    }

    console.log(
      `Successfully updated positions for items with IDs ${itemId} and ${hoverId}`
    );

    return NextResponse.json({
      message: `Positions updated for boxes with IDs ${itemId} and ${hoverId}`,
      updatedProject,
    });
  } catch (error) {
    console.error("Error updating positions:", error);
    return NextResponse.error("Failed to update positions", 500);
  }
};
