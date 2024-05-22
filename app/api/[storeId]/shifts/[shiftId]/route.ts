import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
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

    const shifts = await prismadb.shift.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(shifts);
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

    const body = await req.json();

    const { to, from, startTime, endTime, employeeId, storeId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!from) {
      return new NextResponse("Start Date is required", { status: 400 });
    }

    if (!to) {
      return new NextResponse("End Date is required", { status: 400 });
    }

    if (!startTime) {
      return new NextResponse("Start Time is required", { status: 400 });
    }

    if (!endTime) {
      return new NextResponse("End Time is required", { status: 400 });
    }

    if (!employeeId) {
      return new NextResponse("Employee Id is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    var dates: Date[] = [];
    var currentDate = new Date(from);
    var endDate = new Date(to);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    for (let i = 0; i < dates.length; i++) {
      const shift = await prismadb.shift.create({
        data: {
          storeId,
          employeeId,
          date: dates[i], // Access date from dates array using dates[i]
          startTime,
          endTime,
        },
      });
    }
    // You might want to handle the response for each shift here
  } catch (error) {
    console.log("[SHIFT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }

  // If you need to return a response after all shifts are created, place it outside the loop
  return new NextResponse("Shifts created successfully", { status: 200 });
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

export async function PATCH(
  req: Request,
  { params }: { params: { shiftId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { startTime, endTime } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.shiftId) {
      return new NextResponse("Shift id is required", { status: 400 });
    }

    if (!startTime) {
      return new NextResponse("Shift's START tIme id is required", {
        status: 400,
      });
    }

    if (!endTime) {
      return new NextResponse("Shift's END tIme id is required", {
        status: 400,
      });
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

    await prismadb.shift.update({
      where: {
        id: params.shiftId,
      },
      data: {
        startTime,
        endTime,
      },
    });

    const shift = await prismadb.shift.findUnique({
      where: {
        id: params.shiftId,
      },
      // data: {
      //   images: {
      //     createMany: {
      //       data: [...images.map((image: { url: string }) => image)],
      //     },
      //   },
      // },
    });

    return NextResponse.json(shift);
  } catch (error) {
    console.log("[employee_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
