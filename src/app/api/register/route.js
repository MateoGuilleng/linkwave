import User from "@/models/user";
import connect from "@/utils/db";
import bcrypt from "bcrypt"
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { name, email, password } = await request.json();

  await connect();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return new NextResponse("Email already exists, sign in with that email", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User ({
    name,
    email,
    password: hashedPassword,
  })

  try {
    await newUser.save();
    return new NextResponse("User is registered", { status: 201 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};
