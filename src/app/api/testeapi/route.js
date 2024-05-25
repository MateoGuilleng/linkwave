import { NextResponse } from "next/server";

export const GET = async (request, res) => { 
    return new NextResponse(JSON.stringify('api funciona'), { status: 200 });
}