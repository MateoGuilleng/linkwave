// pages/api/files/getFiles.js
import { getGridFSBucket } from "@/utils/getGridBucket";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  await connect();

  try {
    const bucket = await getGridFSBucket();
    const files = await bucket.find().toArray();

    return NextResponse.json(files);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
