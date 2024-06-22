// /api/[user]/chats/route.js

import User from "@/models/user";
import connect from "@/utils/db";
import { NextResponse } from "next/server";


export const PUT = async (request, { params }) => {
  await connect();

  const userEmail = params.user; // Email del usuario en la ruta dinámica
  const { chatId, chatWithEmail, chatWithNickName, chatWithProfileImage } =
    await request.json();

  try {
    // Buscar el usuario en la base de datos
    const user = await User.findOne({ email: userEmail }).exec();

    if (!user) {
      return new NextResponse("Usuario no encontrado", { status: 404 });
    }


    // Construir el objeto de chat
    const newChat = {
      chatId: chatId,
      chatWithEmail: chatWithEmail,
      chatWithNickName: chatWithNickName,
      chatWithProfileImage: chatWithProfileImage,
    };

    // Agregar el nuevo chat al array de chats del usuario
    user.chats.push(newChat);

    // Guardar los cambios en la base de datos
    await user.save();

    // Devolver la respuesta con el nuevo chat
    return new NextResponse(JSON.stringify({ newChat }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error al actualizar chats:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
};
