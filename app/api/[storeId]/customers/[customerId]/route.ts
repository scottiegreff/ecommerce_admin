import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
/**
 * @param req The request object.
 * @param params The parameters object containing the store ID.
 * @returns A JSON response with the list of customers.
 */
export async function GET(
  req: Request,
  { params }: { params: { customerId: string } }
) {
  try {
    if (!params.customerId) {
      return new NextResponse("Customer id is required", { status: 400 });
    }

    const customer = await prismadb.customer.findUnique({
      where: {
        id: params.customerId,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.log("[CUSTOMER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * Deletes a customer with the specified ID.
 * @param req - The request object.
 * @param params - The parameters object containing the customer ID and store ID.
 * @returns A JSON response with the updated customer data.
 */
export async function DELETE(
  req: Request,
  { params }: { params: { customerId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.customerId) {
      return new NextResponse("Customer id is required", { status: 400 });
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

    // Delete the customer
    const customer = await prismadb.customer.delete({
      where: {
        id: params.customerId,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.log("[CUSTOMER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * Updates a customer with the specified ID.
 * @param req - The request object.
 * @param params - The parameters object containing the customer ID and store ID.
 * @returns A JSON response with the updated customer data.
 */
export async function PATCH(
  req: Request,
  { params }: { params: { customerId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { custFName, custLName, email, phone } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

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

    if (!params.customerId) {
      return new NextResponse("Customer id is required", { status: 400 });
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

    const customer = await prismadb.customer.update({
      where: {
        id: params.customerId,
      },
      data: {
        custFName,
        custLName,
        email,
        phone,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.log("[CUSTOMER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
