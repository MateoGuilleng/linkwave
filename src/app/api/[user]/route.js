import User from "@/models/user";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  await connect();

  const email = params.user;

  const userFound = await User.findOne({ email: email });

  try {
    // const projects = await project.find({ author });

    return new NextResponse(JSON.stringify(userFound), { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};


export const PUT = async (request, { params, body }) => {
  await connect();

  const email = params.user;

  const { firstName, lastName, profession, bio, imageLink} = await request.json()

  console.log(firstName, lastName, profession, bio, imageLink)

  try {
    // Actualizar el usuario en la base de datos
    const user = await User.findOneAndUpdate(
      { email: email },
      {
        firstName: firstName,
        lastName: lastName,
        profession: profession,
        bio: bio,
        profile_image: imageLink,
      },
      { new: true }
    );

    // Si el usuario no se encuentra, devolver un error 404
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Si el usuario se actualiza correctamente, devolver el usuario actualizado
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    // Manejar errores específicos
    if (error.name === "CastError") {
      // Manejar error de tipo de datos incorrecto
      return new NextResponse("Invalid data format", { status: 400 });
    } else {
      // Otros errores
      console.error("Error:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
};
