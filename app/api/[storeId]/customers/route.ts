import { NextResponse } from "next/server";
import { sendMail } from "@/lib/emails/mailService";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": `${process.env.FRONTEND_STORE_URL}`,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
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

    const from: string =`${process.env.MAIL_USERNAME}`;
    const to: string = email || "";
    const subject: string = "Welcome to Prisoner Of Love Studio";
    const mailTemplate: string = `<body style="font-family: Arial, sans-serif; margin: 0;  padding: 20px; background: #000000; border-radius: 20px">
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #000000 border-radius: 20px;">
        <h1 style="text-align: center; font-weight: 200; color: #FFFFFF;">Welcome to Prisoner Of Love Studio</h1>
        <p style="text-align: center; font-weight: 200; color: #FFFFFF;">You can now book an appointment.</p>
        <div style="text-align: center;">
            <img src="cid:unique@gmail.com" width="400" alt="Welcome Image" style="border: none; border-radius: 20px;"/>
        </div>
        <p style="text-align: center; font-weight: 200; color: #FFFFFF;">If you have any questions, feel free to reach out to:</p>
        <p style="text-align: center; font-weight: 200; color: #FFFFFF;">Ziggy at (604) 441-1635 or ziggydoeshair@gmail.com</p>
    </div>
</body>`;

    sendMail(from, to, subject, mailTemplate);
  
    return NextResponse.json(customer, { headers: corsHeaders });
  } catch (error) {
    console.log("[CUSTOMERS_POST]", error);
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
