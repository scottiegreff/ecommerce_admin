import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function PATCH(
  req: Request,
  { params }: { params: { positionId: string; storeId: string } }
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

    if (!params.positionId) {
      return new NextResponse("Position id is required", { status: 400 });
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
    console.log("POSITION API 1:", title, wage, commission);
    const position = await prismadb.position.update({
      where: {
        id: params.positionId,
      },
      data: {
        title,
        wage,
        commission,
      },
    });
    console.log("POSITION API 2:", title, wage, commission);
    return NextResponse.json(position);
  } catch (error) {
    console.log("[POSITIONS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { positionId: string } }
) {
  try {
    if (!params.positionId) {
      return new NextResponse("Position id is required", { status: 400 });
    }

    const position = await prismadb.position.findUnique({
      where: {
        id: params.positionId,
      },
    });

    return NextResponse.json(position);
  } catch (error) {
    console.log("[POSITIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { positionId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.positionId) {
      return new NextResponse("Position id is required", { status: 400 });
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

    const position = await prismadb.position.delete({
      where: {
        id: params.positionId,
      },
    });

    return NextResponse.json(position);
  } catch (error) {
    console.log("[POSITIONS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
