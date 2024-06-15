
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": `${process.env.FRONTEND_STORE_URL}`,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Application/json",
};

export async function OPTIONS() {
  console.log("CORS HEADERS", corsHeaders);
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    // console.log('REQ', req);
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");
    console.log('employeeId', employeeId);
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!employeeId) {
      return new NextResponse("Employee id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const shifts = await prismadb.shift.findMany({
      where: {
        storeId: params.storeId,
        startShift: {
          gte: new Date(),
        }, 
      },
    });
  
    return NextResponse.json( shifts , { headers: corsHeaders });
  } catch (error) {
    console.log('[SHIFTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};