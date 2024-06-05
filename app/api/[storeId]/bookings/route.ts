// import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs";

// import prismadb from "@/lib/prismadb";

// export async function POST(
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) {
//   try {
//     const { userId } = auth();

//     const body = await req.json();

//     const { customerId, date, shiftId, serviceId, startTime } = body;

//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 403 });
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

//     if (!params.storeId) {
//       return new NextResponse("Store id is required", { status: 400 });
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

//     const booking = await prismadb.booking.create({
//       data: {
//         storeId: params.storeId,
//         serviceId: serviceId,
//         date: date,
//         startTime: startTime,
//       },
//     });

//     return NextResponse.json(booking);
//   } catch (error) {
//     console.log("[BOOKINGS_POST]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

// export async function GET(
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const categoryId = searchParams.get("categoryId") || undefined;
//     const colorId = searchParams.get("colorId") || undefined;
//     const sizeId = searchParams.get("sizeId") || undefined;
//     const isFeatured = searchParams.get("isFeatured");

//     if (!params.storeId) {
//       return new NextResponse("Store id is required", { status: 400 });
//     }

//     const bookings = await prismadb.booking.findMany({
//       where: {
//         storeId: params.storeId,
//         serviceId: serviceId,
//         date: date,
//         startTime: startTime,
//         endTime: endTime,
//       },
//       // include: {
//       //   images: true,
//       //   category: true,
//       //   color: true,
//       //   size: true,
//       // },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return NextResponse.json(bookings);
//   } catch (error) {
//     console.log("[BOOKINGS_GET]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }
