import user from "@/models/user";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async (request, res) => {
  try {
    await connect();

    console.log(request.HeadersList);

    let users = await user.find();

    if (!users || users.length === 0) {
      return new NextResponse("No users found", {
        status: 404,
      });
    } else {
      // Devolver users como respuesta
      return new NextResponse(JSON.stringify(users), { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
