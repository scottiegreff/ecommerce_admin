import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  console.log("CORS HEADERS", corsHeaders);
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // const { userId } = auth();

    const body = await req.json();

    const { custFName, custLName, email, phone } = body;

    // if (!userId) {
    //   return new NextResponse("Unauthenticated", { status: 403 });
    // }

    if (!custFName) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!custLName) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!email) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!phone) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByStoreId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        // userId,
      },
    });

    if (!storeByStoreId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    // check to see if customer already exists
    const existingCustomer = await prismadb.customer.findFirst({
      where: {
        storeId: params.storeId,
        email,
      },
    });

    if (existingCustomer) {
      return NextResponse.json(existingCustomer, { headers: corsHeaders });
    }

    const customer = await prismadb.customer.create({
      data: {
        storeId: params.storeId,
        custFName,
        custLName,
        email,
        phone,
      },
    });

    return NextResponse.json(customer, { headers: corsHeaders });
  } catch (error) {
    console.log("[CUSTOMERS_POST!!!!!??????*****]", error);
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

    const customers = await prismadb.customer.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.log("[CUSTOMERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}