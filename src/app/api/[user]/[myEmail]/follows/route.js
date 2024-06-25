// api/[user]/[myEmail]/follows/route.js
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import User from "@/models/user";

export const PUT = async (request, { params }) => {
  await connect();

  const userEmail = params.user; // El email del usuario de la ruta dinámica
  const myEmail = params.myEmail; // El email del usuario que sigue

  try {
    // Agregar myEmail al array followers del usuario userEmail
    await User.updateOne(
      { email: userEmail },
      { $addToSet: { followers: myEmail } }
    );

    // Agregar userEmail al array following del usuario myEmail
    await User.updateOne(
      { email: myEmail },
      { $addToSet: { following: userEmail } }
    );

    return NextResponse.json({ message: "Follow successful" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const GET = async (request, { params }) => {
  await connect();

  const userEmail = params.user; // El email del usuario de la ruta dinámica
  const myEmail = params.myEmail; // El email del usuario que sigue

  try {
    // Verificar si myEmail está en el array following del usuario userEmail
    const user = await User.findOne({ email: myEmail });
    const isFollowing = user.following.includes(userEmail);

    return NextResponse.json({ isFollowing }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};


export const DELETE = async (request, { params }) => {
  await connect();

  const userEmail = params.user; // El email del usuario de la ruta dinámica
  const myEmail = params.myEmail; // El email del usuario que sigue

  try {
    // Eliminar myEmail del array followers del usuario userEmail
    await User.updateOne(
      { email: userEmail },
      { $pull: { followers: myEmail } }
    );

    // Eliminar userEmail del array following del usuario myEmail
    await User.updateOne(
      { email: myEmail },
      { $pull: { following: userEmail } }
    );

    return NextResponse.json({ message: "Unfollow successful" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};