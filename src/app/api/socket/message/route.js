import io from "socket.io-client";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { event, data } = await request.json();

  console.log(event, data);

  io.on("connection", (socket) => {
    socket.emit(event, data);
  });
  return NextResponse.json({
    status: 200,
    body: { message: `Event '${event}' emitted with data '${data}'` },
  });
};
