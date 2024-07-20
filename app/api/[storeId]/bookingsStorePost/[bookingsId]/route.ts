
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function OPTIONS( req: Request) {
  return NextResponse.json({}, { headers: getCorsHeaders(req.headers.get("Origin"))});
}
// Define allowed origins
const allowedOrigins = ["http://localhost:3001", "https://www.prisoneroflovestudio.com"];

// CORS handling function
function getCorsHeaders(origin: string | null) {
  const headers: {
    "Access-Control-Allow-Methods": string;
    "Access-Control-Allow-Headers": string;
    "Access-Control-Allow-Origin"?: string;
  } = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else {
    headers["Access-Control-Allow-Origin"] = "null";
  }
  return headers;
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    // console.log('REQ', req);
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");
    console.log('employeeId', employeeId);
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!employeeId) {
      return new NextResponse("Employee id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const shifts = await prismadb.shift.findMany({
      where: {
        storeId: params.storeId,
        startShift: {
          gte: new Date(),
        }, 
      },
    });
  
    return NextResponse.json( shifts , { headers: getCorsHeaders(req.headers.get("Origin"))});
  } catch (error) {
    console.log('[SHIFTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};