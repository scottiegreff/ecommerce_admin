import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { getDate, sub, format, add } from "date-fns";

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

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { employeeId, shiftId } = await req.json();

  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    if (!shiftId) {
      return new NextResponse("Shift Id is required", { status: 400 });
    }

    if (!employeeId) {
      return new NextResponse("Employee Id is required", { status: 400 });
    }
    const bookings = await prismadb.booking.findMany({
      where: {
        storeId: params.storeId,
        shiftId: shiftId,
        employeeId: employeeId,
      },
    });

    // console.log("BOOKING FROM API RESULT", bookings);

    return NextResponse.json(bookings, { headers: getCorsHeaders(req.headers.get("Origin"))});
  } catch (error) {
    console.log("[SHIFTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
