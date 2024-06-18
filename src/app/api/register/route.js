import User from "@/models/user";
import connect from "@/utils/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    // Asegúrate de que request.json() se llame correctamente
    const { firstName, lastName, email, password } = await request.json();

    // Convertir password a cadena si no lo es
    const passwordStr = password.toString();

    await connect();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new NextResponse("Email already exists, sign in with that email", {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(passwordStr, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profile_image: "https://api.dicebear.com/8.x/lorelei/svg",
    });

    await newUser.save();
    return new NextResponse("User is registered", { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
