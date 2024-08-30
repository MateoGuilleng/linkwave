import connect from "@/utils/db";
import { NextResponse } from "next/server";
import requests from "@/models/requests";

// GET handler
export const GET = async (request, { params }) => {
  await connect();

  const title = params.title;
  console.log("desde api get", title);

  try {
    const requestfound = await requests.findOne({ title: title });
    console.log(requestfound);
    return new NextResponse(JSON.stringify(requestfound), { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};

// PUT handler
export const PUT = async (request, { params }) => {
  await connect();

  const title = params.title;

  try {
    const { title: newTitle, content, projectType } = await request.json();

    // Encuentra la solicitud por título
    const existingRequest = await requests.findOne({ title: title });
    if (!existingRequest) {
      return new NextResponse("Request not found", { status: 404 });
    }

    // Actualiza solo los campos proporcionados en el request
    if (newTitle) existingRequest.title = newTitle;
    if (content) existingRequest.content = content;
    if (projectType) existingRequest.projectType = projectType;

    await existingRequest.save();

    return new NextResponse(JSON.stringify(existingRequest), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "Error updating request" }), { status: 500 });
  }
};
