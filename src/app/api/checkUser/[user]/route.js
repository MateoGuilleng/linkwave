import User from "@/models/user";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
    await connect();
  
    const email = params.user;
  
    try {
      const userFound = await User.findOne({ email });
  
      // Devuelve `false` si el usuario existe, `true` si no existe
      const userExists = !!userFound;
  
      return new NextResponse(JSON.stringify({ userExists }), { status: 200 });
    } catch (error) {
      return new NextResponse(JSON.stringify({ message: error.message }), {
        status: 500,
      });
    }
  };