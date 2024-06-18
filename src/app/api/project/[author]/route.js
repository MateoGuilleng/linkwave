import project from "@/models/project";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  await connect();

  const email = params.author;

  console.log(email, "desde api project author");

  const authorProjects = await project.find({ author: email });

  console.log(authorProjects, "desde api project author");

  try {
    return new NextResponse(JSON.stringify(authorProjects), { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};
