import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { getDate, sub, format, add } from "date-fns";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
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

    console.log("BOOKING FROM API RESULT", bookings);

    return NextResponse.json(bookings, { headers: corsHeaders });
  } catch (error) {
    console.log("[SHIFTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
