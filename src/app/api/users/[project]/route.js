import User from "@/models/user";
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import project from "@/models/project";

export const GET = async (req, { params }) => {
  await connect();
  const projectroute = await params.project;

  console.log("api:", projectroute);

  try {
    const projectFound = await project.findById(projectroute);
    const users = await User.find({ followingProjects: projectFound._id });
    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    console.log("project", projectFound);
    console.log(users);

    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};
