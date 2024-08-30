import requests from "@/models/requests";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { title, content, author, projectType, authorImage } =
    await request.json();

  await connect();

  const existingRequest = await requests.findOne({ title });

  if (existingRequest) {
    return new NextResponse("request already exists", { status: 400 });
  }

  const newRequest = new requests({
    author,
    authorImage,
    title,
    category: projectType,
    content,
  });

  try {
    await newRequest.save();
    return new NextResponse("request is created", { status: 200 });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
};

export const GET = async () => {
  await connect();

  try {
    const allRequests = await requests.find();

    console.log(allRequests);
    return NextResponse.json(allRequests, { status: 200 });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
};
