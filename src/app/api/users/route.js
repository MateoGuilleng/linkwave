import User from "@/models/user";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    await connect();
    const users = await User.find({}, 'name email'); // Solo se obtienen los campos 'name' y 'email'
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};
