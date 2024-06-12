import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Grid from "gridfs-stream";
import Project from "@/models/project";
import { v4 as uuidv4 } from "uuid";

if (!process.env.MONGO_URL) {
  throw new Error(
    "Please define the MONGO_URL environment variable inside .env.local"
  );
}

const mongoURI = process.env.MONGO_URL;

let gfs;
let conn;

const connectToDatabase = async () => {
  if (!conn) {
    conn = await mongoose.createConnection(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
    console.log("GridFS initialized successfully");
  }
};

export async function POST(request) {
  try {
    await connectToDatabase();

    if (!gfs) {
      throw new Error("GridFS not initialized");
    }

    const data = await request.formData();
    const file = data.get("file");
    const description = data.get("description");
    const projectID = data.get("projectID");
    const title = data.get("title");
    const category = data.get("category");
    const author = data.get("author");

    const project = await Project.findById(projectID);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    const nextRequestBoxId = project.requestBoxes.length + 1;
    const identifier = uuidv4();

    if (!file || typeof file.arrayBuffer !== "function") {
      const update = {
        $push: {
          requestBoxes: {
            position: nextRequestBoxId,
            identifier: identifier,
            title: title,
            author: author,
            category: category,
            description: description,
            accepted: false,
            column: "main",
            requestBoxFiles: [],
          },
        },
      };

      const updatedProject = await Project.findByIdAndUpdate(
        projectID,
        update,
        { new: true }
      );

      if (!updatedProject) {
        return NextResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "RequestBox created successfully without file",
      });
    } else {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      return new Promise((resolve, reject) => {
        const writestream = gfs.createWriteStream({
          filename: file.name,
          contentType: file.type,
          metadata: { originalname: file.name },
        });

        writestream.on("finish", async () => {
          const fileId = writestream.id.toString();

          try {
            const update = {
              $push: {
                files: fileId,
                requestBoxes: {
                  position: nextRequestBoxId,
                  identifier: identifier,
                  title: title,
                  author: author,
                  category: category,
                  description: description,
                  column: "main",
                  requestBoxFiles: [
                    {
                      filename: file.name,
                      filetype: file.type,
                      fileId: fileId,
                    },
                  ],
                },
              },
            };

            const updatedProject = await Project.findByIdAndUpdate(
              projectID,
              update,
              { new: true }
            );

            if (!updatedProject) {
              throw new Error("Project not found");
            }

            resolve(
              NextResponse.json({
                message: "File uploaded and project updated successfully",
                fileId: fileId,
                filename: file.name,
                filetype: file.type,
              })
            );
          } catch (error) {
            console.error(
              "Error updating project with file ID and description:",
              error
            );
            reject(
              NextResponse.json(
                { message: "Error updating project", error: error.message },
                { status: 500 }
              )
            );
          }
        });

        writestream.on("error", (err) => {
          console.error("Error occurred during writestream:", err);
        });

        writestream.end(buffer, () => {
          console.log("Buffer has been written to GridFS");
        });
      });
    }
  } catch (error) {
    console.error("Error handling upload request:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { identifier } = await request.json();

    if (!identifier) {
      return NextResponse.json(
        { message: "Identifier is required" },
        { status: 400 }
      );
    }

    const project = await Project.findOneAndUpdate(
      { "requestBoxes.identifier": identifier },
      {
        $pull: { requestBoxes: { identifier: identifier } },
      },
      { new: true }
    );

    if (!project) {
      return NextResponse.json(
        { message: "RequestBox not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "RequestBox deleted successfully" });
  } catch (error) {
    console.error("Error handling delete request:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
