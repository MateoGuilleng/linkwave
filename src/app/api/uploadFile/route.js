import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Grid from "gridfs-stream";

if (!process.env.MONGO_URL) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
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

    await new Promise((resolve, reject) => {
      conn.once("open", () => {
        gfs = Grid(conn.db, mongoose.mongo);
        gfs.collection("uploads");
        console.log("GridFS initialized successfully"); // Mensaje de depuración
        resolve();
      });

      conn.on("error", (err) => {
        console.error("MongoDB connection error:", err);
        reject(err);
      });
    });
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

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      const writestream = gfs.createWriteStream({
        filename: file.name,
        contentType: file.type,
        metadata: { originalname: file.name },
      });

      writestream.on("finish", () => {
        resolve(NextResponse.json({ message: "File uploaded successfully" }));
      });

      writestream.on("error", (err) => {
        console.error("Error uploading file to MongoDB:", err);
        reject(
          NextResponse.json(
            { message: "Upload failed", error: err.message },
            { status: 500 }
          )
        );
      });

      writestream.end(buffer);
    });
  } catch (error) {
    console.error("Error handling upload request:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
