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
  const { serviceIds } = await req.json();
  if (!serviceIds || serviceIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const services = await prismadb.service.findMany({
    where: {
      id: {
        in: serviceIds,
      },
    },
  });
  console.log("CART API: ", services);

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  services.forEach((service) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "CAD",
        product_data: {
          name: service.name,
        },
        unit_amount: service.price * 100,
      },
    });
  });
  console.log("LINE ITEMS: ", line_items);
  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: serviceIds.map((serviceId: string) => ({
          service: {
            connect: {
              id: serviceId,
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
    success_url: `${process.env.ADMIN_URL}/api/${params.storeId}/serviceCart?success=1`,
    cancel_url: `${process.env.ADMIN_URL}/api/${params.storeId}/serviceCart?canceled=1`,
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
