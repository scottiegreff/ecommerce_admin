import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import sgMail from '@sendgrid/mail';

export async function OPTIONS( req: Request) {
    return NextResponse.json({}, { headers: getCorsHeaders(req.headers.get("Origin"))});
  }
  // Define allowed origins
  const allowedOrigins = process.env.FRONTEND_STORE_URL
  
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
  try {
    const { userId } = auth();

    const body = await req.json();

    const { customerEmail, employeeName, serviceName, date } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);  
    console.log("SEND EMAIL API : ", customerEmail, employeeName, serviceName, date)
    const msg = {
        to: `${customerEmail}`, // Change to your recipient
        from: 'ziggydoeshair@gmail.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: `<strong>You have an apt wit ${employeeName} at  ${date} for a ${serviceName}</strong>`,
      }
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const email = sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })

        return NextResponse.json(email, {
            headers: getCorsHeaders(req.headers.get("Origin")),
          });
  } catch (error) {
    console.log("[SEND EMAIL]_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
