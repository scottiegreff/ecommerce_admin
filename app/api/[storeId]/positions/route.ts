import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { title, wage, commission } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    if (!wage) {
      return new NextResponse("Wage is required", { status: 400 });
    }
    if (!commission) {
      return new NextResponse("Commission is required", { status: 400 });
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

    const position = await prismadb.position.create({
      data: {
        storeId: params.storeId,
        title,
        wage,
        commission,
      },
    });

    return NextResponse.json(position);
  } catch (error) {
    console.log("[POSITIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const positions = await prismadb.position.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(positions);
  } catch (error) {
    console.log("[POSITIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
