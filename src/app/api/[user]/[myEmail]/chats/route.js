import connect from "@/utils/db";
import { NextResponse } from "next/server";
import User from "@/models/user";
import { v4 as uuidv4 } from "uuid";

export const GET = async (request, { params }) => {
  await connect();

  const userEmail = params.user; // El email del usuario de la ruta dinámica
  const myEmail = params.myEmail; // El email del usuario

  try {
    // Buscar ambos usuarios en la base de datos
    const user = await User.findOne({ email: userEmail }).exec();
    const myUser = await User.findOne({ email: myEmail }).exec();

    if (!user || !myUser) {
      throw new Error("Usuarios no encontrados en la base de datos");
    }

    // Verificar si existe un chat entre los usuarios
    let chatId = null;
    user.chats.forEach((chat) => {
      // Buscar el chatId en el objeto chat del array chats
      if (myUser.chats.some((myChat) => myChat.chatId === chat.chatId)) {
        chatId = chat.chatId;
      }
    });

    // Si se encontró un chat existente, devolver el chatId
    if (chatId) {
      return new NextResponse(JSON.stringify({ chatId }), { status: 200 });
    }

    // Si no se encontró ningún chat existente, generar un nuevo chat ID
    chatId = uuidv4();

    // Crear el nuevo objeto chat con chatId y detalles del otro usuario
    const newChatForUser = {
      chatId,
      chatWithEmail: myEmail,
      chatWithNickName: myUser.nickName,
      chatWithProfileImage: myUser.profile_image,
    };

    const newChatForMyUser = {
      chatId,
      chatWithEmail: userEmail,
      chatWithNickName: user.nickName,
      chatWithProfileImage: user.profile_image,
    };

    // Actualizar ambos usuarios con el nuevo chat
    user.chats.push(newChatForUser);
    myUser.chats.push(newChatForMyUser);
    await Promise.all([user.save(), myUser.save()]);

    // Devolver el nuevo chatId
    return new NextResponse(JSON.stringify({ chatId }), { status: 200 });
  } catch (error) {
    console.error("Error checking chat:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
