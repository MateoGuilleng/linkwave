import project from "@/models/project";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  await connect();

  const email = params.author;

  const projectFound = await project.findOne({ author: email });

  try {
    return new NextResponse(JSON.stringify(projectFound), { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};
