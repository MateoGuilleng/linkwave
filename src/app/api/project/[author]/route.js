import project from "@/models/project";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  await connect();
  const projectFound = await project.findById(params.author)
 
  try {
    const projects = await project.find({ author });
    console.log("aaaa");

    return new NextResponse(projectFound, { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};
