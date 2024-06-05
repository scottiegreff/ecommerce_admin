import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { getDate, sub, format, add } from "date-fns";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { employeeId, shiftId, serviceId, date, startTime, customerId } =
    await req.json();
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

    if (!serviceId) {
      return new NextResponse("Service Id is required", { status: 400 });
    }

    if (!employeeId) {
      return new NextResponse("Employee Id is required", { status: 400 });
    }

    if (!date) {
      return new NextResponse("Date is required", { status: 400 });
    }

    if (!startTime) {
      return new NextResponse("Start Time is required", { status: 400 });
    }

    if (!shiftId) {
      return new NextResponse("Shift Id is required", { status: 400 });
    }

    if (!customerId) {
      return new NextResponse("Customer Id is required", { status: 400 });
    }

    const bookings = await prismadb.booking.create({
      data: {
        storeId: params.storeId,
        serviceId: serviceId,
        employeeId: employeeId,
        date: date,
        startTime: startTime,
        shiftId: shiftId,
        customerId: customerId,
      },
    });

    console.log("BOOKING FROM API RESULT", bookings);

    return NextResponse.json(bookings, { headers: corsHeaders });
  } catch (error) {
    console.log("[SHIFTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
