import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { sub, add } from "date-fns";

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
  const { employeeId } = await req.json();
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
    const date = new Date();
    date.setDate(date.getDate() - 1);
    // const convertLocalToUTC0 = function (date: Date) {
    //   const offset = date.getTimezoneOffset();
    //   const dateUTC0 = add(date, { minutes: offset });
    //   return dateUTC0;
    // }

    // const dateUTC0 = convertLocalToUTC0(new Date());
    // console.log("DATE UTC 0: ", dateUTC0);

    const shifts = await prismadb.shift.findMany({
      where: {
        storeId: params.storeId,
        employeeId: employeeId,
        date: {
          gte: date,
        },
      },
    });

    return NextResponse.json(shifts, { headers: corsHeaders });
  } catch (error) {
    console.log("[SHIFTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
