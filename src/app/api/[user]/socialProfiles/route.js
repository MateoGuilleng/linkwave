// /api/[user]/socialProfiles/route.js

import mongoose from "mongoose"; // Asegúrate de importar mongoose

import User from "@/models/user";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

import { getSession } from "@auth0/nextjs-auth0";

// POST: Agregar un perfil social
export const POST = async (request, { params }) => {
  await connect();

  const email = params.user;
  const { socialProfile } = await request.json();

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Verificar duplicados en el URL
    const isDuplicate = user.socialProfiles.some(
      (profile) => profile.url === socialProfile.url
    );

    if (isDuplicate) {
      return new NextResponse("Duplicate URL", { status: 400 });
    }

    // Agregar el nuevo perfil social con un ID único
    socialProfile._id = mongoose.Types.ObjectId(); // Genera un nuevo ObjectId único
    user.socialProfiles.push(socialProfile);
    await user.save();

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error adding social profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// PUT: Editar un perfil social
export const PUT = async (request, { params }) => {
  await connect();

  const email = params.user;
  const { editedUrl, editedIndex } = await request.json();

  try {
    console.log("Updating social profile for user:", email);
    console.log("Edited URL:", editedUrl);
    console.log("Edited Index:", editedIndex);

    // Convert editedIndex to ObjectId
    const objectId = new mongoose.Types.ObjectId(editedIndex);

    // Find and update the specific social profile within the user
    const updatedUser = await User.findOneAndUpdate(
      { email: email, "socialProfiles._id": objectId },
      {
        $set: {
          "socialProfiles.$.url": editedUrl,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error("User or social profile not found");
      return new NextResponse("User or social profile not found", {
        status: 404,
      });
    }

    // Successful response with the updated user
    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Error updating social profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  await connect();

  const { user } = await getSession();

  const email = user.email;
  const profileId = params.user;

  console.log(email, profileId);

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return new NextResponse("User not found", { status: 405 });
    }

    // Encontrar el índice del perfil social por su ID único
    const index = user.socialProfiles.findIndex((profile) => {
      console.log(profile._id); // 66785b83fcbd933f34c748e7
      console.log(profileId); // 66785b83fcbd933f34c748e7
      return profile._id.toString() === profileId;
    });

    console.log(index);

    if (index === -1) {
      return new NextResponse("Social profile not found", { status: 404 });
    }

    // Eliminar el perfil social
    user.socialProfiles.splice(index, 1);
    await user.save();

    // Respuesta exitosa con el usuario actualizado
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error deleting social profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
