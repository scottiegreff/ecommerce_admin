import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import sgMail from "@sendgrid/mail";
import pol from "@/public/images/pol.jpg";

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
  try {
    const { userId } = auth();

    const body = await req.json();

    const {
      customerEmail,
      employeeName,
      serviceName,
      bookingStartDateAndTime,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const date = new Date(bookingStartDateAndTime);
    const formattedDate = date.toDateString();
    const message = `You have a ${serviceName} appointment with ${employeeName} at ${formattedDate}... SEE YOU THEN!`;
    const msg = {
      to: `${customerEmail}`, // Change to your recipient
      from: "ziggy-prisoner-of-love-studio@sgreff.com", // Change to your verified sender
      subject: "Confirmation Email",
      text: message,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Confirmation</title>
    <style>
        body {
            background-color: #1c1c1c;
            color: #1c1c1c;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 100vw;
            margin: 0 auto;
            background-color: #1c1c1c;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
            text-align: center;
        }
        .header img {
            max-width: 50vw;
            height: auto;
        }
        .content p {
            margin: 20px 0;
            font-size: 18px;
            color: #fff;
        }
        .content strong {
            margin: 20px 0;
            font-size: 18px;
            color: #fff;
        }
  
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src=${pol} alt="Prisoner of Love Studio Logo"/>
        </div>
        <div class="content">
            <p>You have a ${serviceName} appointment,</p>
            <p> with ${employeeName} at ${formattedDate}.<p/>
            <strong>Prisoner of Love Studio</strong>
        </div>
    </div>
</body>
</html>`,
    };
    console.log(msg);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const email = sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    return NextResponse.json(email, {
      headers: getCorsHeaders(req.headers.get("Origin")),
    });
  } catch (error) {
    console.log("[SEND EMAIL]_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
