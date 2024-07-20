import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { sub, add } from "date-fns";


export async function OPTIONS( req: Request) {
  return NextResponse.json({}, { headers: getCorsHeaders(req.headers.get("Origin"))});
}
// Define allowed origins
const allowedOrigins = process.env.FRONTEND_STORE_URL
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

  if (origin && allowedOrigins?.includes(origin)) {
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
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
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
        startShift: {
          gte: currentDate,
        },
      },
    });

    return NextResponse.json(shifts, { headers: getCorsHeaders(req.headers.get("Origin"))});
  } catch (error) {
    console.log("[SHIFTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
