// api/response/[requestTitle]/route.js

import requests from "@/models/requests";
import user from "@/models/user"; // Asegúrate de importar el modelo de usuario
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"; // Asegúrate de importar uuid para generar IDs únicos

export const POST = async (request, { params }) => {
  await connect();

  const { response, author } = await request.json(); // Extraemos el comentario y el autor del cuerpo de la solicitud
  const requestTitle = params.requestTitle; // Extraemos el título del request desde los parámetros de la ruta

  try {
    // Obtenemos información del autor desde la base de datos usando el email proporcionado
    const authorInfo = await user.findOne({ email: author });

    if (!authorInfo) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Extraemos la información necesaria del autor
    const authorFN = authorInfo.firstName;
    const authorLN = authorInfo.lastName;
    const authorProfileImage = authorInfo.profile_image;
    const nickname = authorInfo.nickName; 
    const edited = false;

    console.log("response", response);

    // Creamos un nuevo objeto de respuesta
    const newResponse = {
      id: uuidv4(),
      author,
      nickname,
      response,
      authorFN,
      authorLN,
      authorProfileImage,
      edited,
      createdAt: new Date(), // Añadimos la fecha de creación
    };

    // Actualizamos el request en la base de datos añadiendo la nueva respuesta al array de responses
    const updatedRequest = await requests.findOneAndUpdate(
      { title: requestTitle },
      { $push: { responses: newResponse } }, // Añadimos la nueva respuesta al array de responses
      { new: true } // Devolvemos el documento actualizado
    );

    if (!updatedRequest) {
      return new NextResponse("Request not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(updatedRequest), { status: 200 });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
};

// Agregamos la nueva función GET para obtener todos los objetos del array responses
export const GET = async (request, { params }) => {
  await connect();

  const requestTitle = params.requestTitle; // Extraemos el título del request desde los parámetros de la ruta

  try {
    // Obtenemos el request desde la base de datos usando el título proporcionado
    const existingRequest = await requests.findOne({ title: requestTitle });

    if (!existingRequest) {
      return new NextResponse("Request not found", { status: 404 });
    }

    // Devolvemos el array de responses del request encontrado
    return new NextResponse(JSON.stringify(existingRequest.responses), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
};

export const PUT = async (request, { params }) => {
  await connect();

  const { id, response, author } = await request.json(); // Extrae el ID de la respuesta, la respuesta modificada, y el autor del cuerpo de la solicitud
  const requestTitle = params.requestTitle; // Extrae el título del request desde los parámetros de la ruta

  try {
    // Verifica que el autor existe en la base de datos usando el email proporcionado
    const authorInfo = await user.findOne({ email: author });

    if (!authorInfo) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Encuentra y actualiza la respuesta específica dentro del array de responses
    const updatedRequest = await requests.findOneAndUpdate(
      { title: requestTitle, "responses.id": id },
      {
        $set: {
          "responses.$.response": response, // Actualiza el texto de la respuesta
          "responses.$.edited": true, // Marca como editado
          "responses.$.editedAt": new Date(), // Añade fecha de edición
        },
      },
      { new: true } // Devolver el documento actualizado
    );

    if (!updatedRequest) {
      return new NextResponse("Request or Response not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(updatedRequest), { status: 200 });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
};
