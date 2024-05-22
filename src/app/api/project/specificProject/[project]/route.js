import project from "@/models/project";
import user from "@/models/user";
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const GET = async (request, { params }) => {
  await connect();

  const projectTitle = params.project;

  const infoProject = await project.findOne({ title: projectTitle });

  try {
    return new NextResponse(JSON.stringify(infoProject), { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  await connect();

  const projectTitle = params.project;

  const projectToDelete = await project.findOneAndDelete({
    title: projectTitle,
  });

  try {
    return new NextResponse(JSON.stringify(projectToDelete), { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};

export const PUT = async (request, { params }) => {
  await connect();

  const { comment, author } = await request.json();

  const projectTitle = params.project;

  const authorInfo = await user.findOne({ email: author });
  const authorFN = authorInfo.firstName;
  const authorLN = authorInfo.lastName;
  const authorProfileImage = authorInfo.profile_image;
  const edited = false;

  const newComment = {
    id: uuidv4(),
    author,
    comment,
    authorFN,
    authorLN,
    authorProfileImage,
    edited,
  };

  // Agrega la fecha de creación al nuevo comentario
  newComment.createdAt = new Date();

  console.log(authorFN, authorLN);

  try {
    const projectToUpdate = await project.findOneAndUpdate(
      { title: projectTitle },
      { $push: { comments: newComment } }, // Agrega el nuevo comentario al arreglo como un objeto
      { new: true } // Opción { new: true } para devolver el documento actualizado
    );

    return new NextResponse(JSON.stringify(projectToUpdate), { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};
