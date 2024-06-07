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
      // include: {
      //   images: true,
      //   category: true,
      //   size: true,
      //   color: true,
      // },
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

// export async function PATCH(
//   req: Request,
//   { params }: { params: { bookingId: string; storeId: string } }
// ) {
//   try {
//     const { userId } = auth();

//     const body = await req.json();

//     const { customerId, date, shiftId, serviceId, startTime } = body;

//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 403 });
//     }

//     if (!params.bookingId) {
//       return new NextResponse("Booking id is required", { status: 400 });
//     }

//     if (!customerId) {
//       return new NextResponse("Customer id is required", { status: 400 });
//     }

//     if (!date) {
//       return new NextResponse("Date is required", { status: 400 });
//     }

//     if (!shiftId) {
//       return new NextResponse("Shift id is required", { status: 400 });
//     }

//     if (!serviceId) {
//       return new NextResponse("Service id is required", { status: 400 });
//     }

//     if (!startTime) {
//       return new NextResponse("Start time is required", { status: 400 });
//     }

//     const storeByUserId = await prismadb.store.findFirst({
//       where: {
//         id: params.storeId,
//         userId,
//       },
//     });

//     if (!storeByUserId) {
//       return new NextResponse("Unauthorized", { status: 405 });
//     }

//     await prismadb.booking.update({
//       where: {
//         id: params.bookingId,
//       },
//       data: {
//         customerId,
//         date,
//         shiftId,
//         serviceId,
//         startTime,
//       },
//     });

//     const booking = await prismadb.booking.update({
//       where: {
//         id: params.bookingId,
//       },
//       data: {
//         // images: {
//         //   createMany: {
//         //     data: [...images.map((image: { url: string }) => image)],
//         //   },
//         // },
//       },
//     });

//     return NextResponse.json(booking);
//   } catch (error) {
//     console.log("[BOOKING_PATCH]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }
