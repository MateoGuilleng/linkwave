// src/app/api/files/[id]/route.js
import { getGridFSBucket } from "@/utils/getGridBucket";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "File ID is required" }, { status: 400 });
  }

  try {
    const bucket = await getGridFSBucket();
    const file = await bucket.find({ _id: new ObjectId(id) }).toArray();

    if (!file || file.length === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const downloadStream = bucket.openDownloadStream(new ObjectId(id));

    return new Promise((resolve, reject) => {
      const chunks = [];
      downloadStream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      downloadStream.on("end", () => {
        const buffer = Buffer.concat(chunks);
        const response = new NextResponse(buffer, {
          headers: {
            "Content-Type": file[0].contentType,
            "Content-Disposition": `attachment; filename="${file[0].filename}"`,
          },
        });
        resolve(response);
      });

      downloadStream.on("error", (err) => {
        reject(NextResponse.json({ error: err.message }, { status: 500 }));
      });
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
