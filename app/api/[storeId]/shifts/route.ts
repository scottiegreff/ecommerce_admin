import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": `${process.env.FRONTEND_STORE_URL}`,
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

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
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId") || undefined;
    // const { userId } = auth();

    // if (!userId) {
    //   return new NextResponse("Unauthenticated", { status: 403 });
    // }

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

    const shifts = await prismadb.shift.findMany({
      where: {
        storeId: params.storeId,
        employeeId: employeeId || undefined,
      },
    });
 
    // return NextResponse.json(shifts);

    return NextResponse.json(shifts, { headers: getCorsHeaders(req.headers.get("Origin"))});
  } catch (error) {
    console.log("[SHIFTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const storeId = params.storeId;

    const body = await req.json();

    const { employeeId, shiftDateAndTime } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!employeeId) {
      return new NextResponse("Employee Id is required", { status: 400 });
    }

    if (!shiftDateAndTime) {
      return new NextResponse("Shift Date and Time is required", {
        status: 400,
      });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    // check to see if employee is working that day
    const shiftByEmployeeId = await prismadb.shift.findFirst({
      where: {
        employeeId,
        storeId,
        startShift: {
          lte: shiftDateAndTime[0].startDateAndTime,
        },
        endShift: {
          gte: shiftDateAndTime[0].endDateAndTime,
        },
      },
    });

    if (shiftByEmployeeId) {
      return new NextResponse("Employee is already working that day", {
        status: 400,
      });
    }

    let shift; // Declare the 'shift' variable

    for (let i = 0; i < shiftDateAndTime.length; i++) {
      shift = await prismadb.shift.create({
        data: {
          storeId,
          employeeId,
          startShift: shiftDateAndTime[i].startDateAndTime,
          endShift: shiftDateAndTime[i].endDateAndTime,
        },
      });
      console.log("SHIFT: ", shift);
    }

    return NextResponse.json(shift);
  } catch (error) {
    console.log("[SHIFTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { shiftId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.shiftId) {
      return new NextResponse("Shift id is required", { status: 400 });
    }

    // Check if the store exists and belongs to the user
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    // Delete the billboard
    const shift = await prismadb.shift.delete({
      where: {
        id: params.shiftId,
      },
    });

    return NextResponse.json(shift);
  } catch (error) {
    console.log("[SHIFT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// export async function PATCH(
//   req: Request,
//   { params }: { params: { shiftId: string; storeId: string } }
// ) {
//   try {
//     const { userId } = auth();

//     const body = await req.json();

//     const { startTime, endTime } = body;

//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 403 });
//     }

//     if (!params.shiftId) {
//       return new NextResponse("Shift id is required", { status: 400 });
//     }

//     if (!startTime) {
//       return new NextResponse("Shift's START tIme id is required", {
//         status: 400,
//       });
//     }

//     if (!endTime) {
//       return new NextResponse("Shift's END tIme id is required", {
//         status: 400,
//       });
//     }

//     // Check if the store exists and belongs to the user
//     const storeByUserId = await prismadb.store.findFirst({
//       where: {
//         id: params.storeId,
//         userId,
//       },
//     });

//     if (!storeByUserId) {
//       return new NextResponse("Unauthorized", { status: 405 });
//     }

//     await prismadb.shift.update({
//       where: {
//         id: params.shiftId,
//       },
//       data: {
//         startTime,
//         endTime,
//       },
//     });

//     const shift = await prismadb.shift.findUnique({
//       where: {
//         id: params.shiftId,
//       },
//       // data: {
//       //   images: {
//       //     createMany: {
//       //       data: [...images.map((image: { url: string }) => image)],
//       //     },
//       //   },
//       // },
//     });

//     return NextResponse.json(shift);
//   } catch (error) {
//     console.log("[employee_PATCH]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }
