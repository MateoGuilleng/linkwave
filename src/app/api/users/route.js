import User from "@/models/user";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connect();
    const users = await User.find({}, 'profile_image email'); // Solo se obtienen los campos 'name' y 'email'
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};
