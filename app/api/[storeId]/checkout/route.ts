import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { Product, Service } from "@prisma/client";

export async function OPTIONS(req: Request) {
  return NextResponse.json(
    {},
    { headers: getCorsHeaders(req.headers.get("Origin")) }
  );
}
// Define allowed origins
const allowedOrigins = process.env.FRONTEND_STORE_URL;

// CORS handling function
function getCorsHeaders(origin: string | null) {
  const headers: {
    "Access-Control-Allow-Methods": string;
    "Access-Control-Allow-Headers": string;
    "Access-Control-Allow-Origin"?: string;
  } = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (origin && allowedOrigins?.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else {
    headers["Access-Control-Allow-Origin"] = "null";
  }
  return headers;
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { cartData } = await req.json();
  if (!cartData || cartData.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }
  // console.log("CART DATA!!!!!!!", cartData);
  // type OrderData = {
  //   item: Service | Product,
  //   quantity: number,
  // }
  const orderData = await Promise.all(
    cartData.map(async (item: any) => {
      const service = await prismadb.service.findFirst({
        where: {
          id: item.id,
        },
      });
      if (service) {
        return {
          service: service,
          quantity: item.quantity,
        };
      }
      const product = await prismadb.product.findFirst({
        where: {
          id: item.id,
        },
      });
      if (product) {
        return {
          product: product,
          quantity: item.quantity,
        };
      }
    })
  );
  // const services = await prismadb.service.findMany({
  //   where: {
  //     id: {
  //       in: cartData.id,
  //     },
  //   },
  // });
  // console.log("ORDER DATA: ", orderData);
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  orderData.forEach((item) => {
    if (item.service) {
      line_items.push({
        quantity: item.quantity,
        price_data: {
          currency: "CAD",
          product_data: { name: item.service.name },
          unit_amount: item.service.price.toNumber() * 100,
        },
      });
    }
    if (item.product) {
      line_items.push({
        quantity: item.quantity,
        price_data: {
          currency: "CAD",
          product_data: { name: item.product.name },
          unit_amount: item.product.price.toNumber() * 100,
        },
      });
    }
  });
  // console.log("LINE_ITEMS: ", line_items);

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: orderData.map((item: any) => {
          if (item.service) {
            return {
              service: {
                connect: {
                  id: item.service.id,
                },
              },
            
            };
          } else if (item.product) {
            return {
              product: {
                connect: {
                  id: item.product.id,
                },
              },
          
            };
          }
        }),
      },
    },
  });
  // const order = await prismadb.order.create({
  //   data: {
  //     storeId: params.storeId,
  //     isPaid: false,
  //     orderItems: {
  //       create: orderData.map((item: any) => ({
  //         service: {
  //           connect: {
  //             id: item.service.id,
  //           },
  //         },
  //       })),
  //     },
  //   },
  // });

  console.log("ORDER", order);
  const origin = req.headers.get("Origin");
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${origin}/${params.storeId}/cart?success=1`,
    cancel_url: `${origin}/${params.storeId}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });
  return NextResponse.json(
    { url: session.url },
    {
      headers: getCorsHeaders(req.headers.get("Origin")),
    }
  );
}
