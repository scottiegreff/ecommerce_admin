import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": `${process.env.FRONTEND_STORE_URL}`,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const employees = await prismadb.employee.findMany({
      where: {
        storeId:  params.storeId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fName: true,
        lName: true,
      },
    });

    return NextResponse.json( employees , { headers: corsHeaders });
  } catch (error) {
    console.log("[EMPLOYEES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
