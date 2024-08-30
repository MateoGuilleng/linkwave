// api/request/session/[author]/route.js

import requests from "@/models/requests";
import user from "@/models/user";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { author } = params;

  try {
    // Conectar a la base de datos
    await connect();

    // Obtener todos los requests del usuario por su email
    const userRequests = await requests.find({ author: author })

    if (!userRequests || userRequests.length === 0) {
      return NextResponse.json(
        { message: "No requests found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(userRequests, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch requests:", error);
    return NextResponse.json(
      { message: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
