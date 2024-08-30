// api/response/[requestTitle]/[responseID]/route.js

import connect from "@/utils/db";
import requests from "@/models/requests";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { requestTitle, responseID } = params;

  try {
    // Conectar a la base de datos
    await connect();

    // Buscar el documento correspondiente a requestTitle
    const requestDoc = await requests.findOne({ title: requestTitle });

    if (!requestDoc) {
      return NextResponse.json(
        { message: "Request not found" },
        { status: 404 }
      );
    }

    // Filtrar las respuestas para eliminar la respuesta con el ID proporcionado
    const updatedResponses = requestDoc.responses.filter(
      (response) => response.id !== responseID
    );

    // Actualizar el documento con las respuestas filtradas
    const result = await requests.updateOne(
      { title: requestTitle },
      { $set: { responses: updatedResponses } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Failed to delete response" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Response deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete response:", error);
    return NextResponse.json(
      { message: "Failed to delete response" },
      { status: 500 }
    );
  }
}
