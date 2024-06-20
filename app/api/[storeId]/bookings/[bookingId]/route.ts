import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    if (!params.bookingId) {
      return new NextResponse("Booking id is required", { status: 400 });
    }
    const booking = await prismadb.booking.findUnique({
      where: {
        id: params.bookingId,
      },
      include: {
        customer: true,
        employee: true,
        service: {
          include: {
            images: true,
          },
        },
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.log("[BOOKING_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { bookingId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.bookingId) {
      return new NextResponse("Booking id is required", { status: 400 });
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

    const booking = await prismadb.booking.delete({
      where: {
        id: params.bookingId,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.log("[BOOKING_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
