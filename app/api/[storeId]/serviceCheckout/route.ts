import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": `${process.env.FRONTEND_STORE_URL}`,
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
  // console.log("FUCKING HERE")
  const { cartData } = await req.json();
  if (!cartData || cartData.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const orderData = await Promise.all(
    cartData.map(async (item: any) => {
      const service = await prismadb.service.findFirst({
        where: {
          id: item.id,
        },
      });
      return {
        service,
        quantity: item.quantity,
      };
    })
  );
  // const services = await prismadb.service.findMany({
  //   where: {
  //     id: {
  //       in: cartData.id,
  //     },
  //   },
  // });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  orderData.forEach((item) => {
    line_items.push({
      quantity: item.quantity,
      price_data: {
        currency: "CAD",
        product_data: { name: item.service.name },
        unit_amount: item.service.price.toNumber() * 100,
      },
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: orderData.map((item: any) => ({
          service: {
            connect: {
              id: item.service.id,
            },
          },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.ADMIN_URL}/${params.storeId}/cart?success=1`,
    cancel_url: `${process.env.ADMIN_URL}/${params.storeId}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });
  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
