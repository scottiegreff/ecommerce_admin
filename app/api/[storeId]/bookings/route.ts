import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { serviceId, date, duration, startTime, endTime, employeeId, custFName, custLName, price } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!serviceId) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!serviceId) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!date) {
      return new NextResponse("Date is required", { status: 400 });
    }

    if (!duration) {
      return new NextResponse("Duration is required", { status: 400 });
    }

    if (!startTime) {
      return new NextResponse("Start time is required", { status: 400 });
    }

    if (!endTime) {
      return new NextResponse("End time is required", { status: 400 });
    }

    if (!employeeId) {
      return new NextResponse("Employee is required", { status: 400 });
    }

    if (!custFName) {
      return new NextResponse("First name is required", { status: 400 });
    }

    if (!custLName) {
      return new NextResponse("Last name is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const booking = await prismadb.booking.create({
      data: {
        storeId: params.storeId,
        serviceId: serviceId,
        date: date,
        startTime: startTime,
        endTime: endTime,

      },
    });
  
    return NextResponse.json(booking);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  
    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
