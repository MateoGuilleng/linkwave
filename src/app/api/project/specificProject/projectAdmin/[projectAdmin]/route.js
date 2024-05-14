import project from "@/models/project";
import user from "@/models/user";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const PUT = async (request, { params }) => {
  await connect();

  const { title, description, content } = await request.json();

  const projectTitle = params.projectAdmin;

  console.log("project title:", projectTitle);

  const projectToUpdate = await project.findOneAndUpdate(
    { title: projectTitle },
    {
      title: title,
      description: description,
      content: content,
    }
  );

  console.log(projectToUpdate);
  try {
    return new NextResponse(JSON.stringify(projectToUpdate), { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};
