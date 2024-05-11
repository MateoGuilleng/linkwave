import User from "@/models/user";
import connect from "@/utils/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const POST = async (request) => {
  const session = getServerSession(authOptions);
  const { firstName, lastName, email, password } = await request.json();

  await connect();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return new NextResponse("Email already exists, sign in with that email", {
      status: 400,
    });
  }
  const randomAvatar = "https://api.dicebear.com/8.x/lorelei/svg";

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    profile_image: "https://api.dicebear.com/8.x/lorelei/svg",
  });

  session.firstName = firstName;

  try {
    await newUser.save();
    return new NextResponse("User is registered", { status: 201 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};
