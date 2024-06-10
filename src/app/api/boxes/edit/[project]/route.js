import connect from "@/utils/db";
import project from "@/models/project";
import { NextResponse } from "next/server";

export const PUT = async (request, { params }) => {
  const data = await request.formData();
  const projectTitle = params.project;

  const title = data.get("title");
  const category = data.get("category");
  const projectID = parseInt(data.get("projectID")); // Convertir projectID a entero
  const description = data.get("description");

  if (!title || !category || !description || isNaN(projectID)) {
    // Validar que projectID sea un número
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }
  console.log("projectID:", projectID);
  console.log("projectTitle:", projectTitle);
  try {
    await connect();
    console.log("pp", projectTitle, projectID, title, category, description);

    const updatedBox = await project.findOneAndUpdate(
      { title: projectTitle, "boxes.id": projectID },
      {
        $set: {
          "boxes.$.title": title,
          "boxes.$.category": category,
          "boxes.$.description": description,
        },
      },
      { new: true }
    );

    if (!updatedBox) {
      return NextResponse.json({ error: "Box not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBox, { status: 200 });
  } catch (error) {
    console.error("Error updating box:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
