import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(req.url)
    // const categoryId = searchParams.get('categoryId') || undefined;
    // const colorId = searchParams.get('colorId') || undefined;
    // const sizeId = searchParams.get('sizeId') || undefined;
    // const isFeatured = searchParams.get('isFeatured');

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const shifts = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
      },
      // include: {
      //   employee: true,
      //   services: true,
      // },
      orderBy: {
        createdAt: 'desc',
      }
    });
  
    return NextResponse.json(shifts);
  } catch (error) {
    console.log('[SHIFTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};



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
