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
  console.log("FUCKING HERE")
  const { cartData } = await req.json();
  console.log("PRODUCT IDS", cartData)
  if (!cartData || cartData.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }
  const orderData = await Promise.all(
    cartData.map(async (item: any) => {
      const product = await prismadb.product.findFirst({
        where: {
          id: item.id,
        },
      });
      return {
        product,
        quantity: item.quantity,
      };
    })
  );

  // const products = await prismadb.product.findMany({
  //   where: {
  //     id: {
  //       in: productIds,
  //     },
  //   },
  // });
  // console.log("CART API: ", products)

  // const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  // products.forEach((product) => {
  //   line_items.push({
  //     quantity: 1,
  //     price_data: {
  //       currency: "CAD",
  //       product_data: {
  //         name: product.name,
  //       },
  //       unit_amount: product.price.toNumber() * 100,
  //     },
  //   });
  // });
  console.log("ORDER DATA: ", orderData);
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  orderData.forEach((item) => {
    line_items.push({
      quantity: item.quantity,
      price_data: {
        currency: "CAD",
        product_data: { name: item.product.name },
        unit_amount: item.product.price.toNumber() * 100,
      },
    });
  });
  console.log("LINE ITEMS: ", line_items);
  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        // create: productIds.map((productId: string) => ({
          create: orderData.map((item: any) => ({
          product: {
            connect: {
              // id: productId,
              id: item.product.id,
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
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
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
