import User from "@/models/user";
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import project from "@/models/project";

export const GET = async (request, { params }) => {
  await connect();

  const email = params.user;
  console.log("desde api get", email);

  try {
    const userFound = await User.findOne({ email: email });

    return new NextResponse(JSON.stringify(userFound), { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};

export const PUT = async (request, { params }) => {
  await connect();

  const email = params.user;
  const { nickName, firstName, lastName, profession, bio, imageLink } =
    await request.json();

  try {
    // Actualizar el usuario en la base de datos
    const user = await User.findOneAndUpdate(
      { email: email },
      {
        nickName: nickName,
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

    // Actualizar los comentarios en los proyectos
    await project.updateMany(
      { "comments.author": email },
      {
        $set: {
          "comments.$[elem].authorFN": firstName,
          "comments.$[elem].authorLN": lastName,
          "comments.$[elem].authorProfileImage": imageLink,
        },
      },
      { arrayFilters: [{ "elem.author": email }] }
    );

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

export const POST = async (request, { params }) => {
  await connect();

  const email = params.user;
  const { nickName, profile_image } = await request.json();

  try {
    const newUser = new User({
      nickName,
      email,
      profile_image,
    });

    await newUser.save();
    return new NextResponse("User is registered", { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
};
