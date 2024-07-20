import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { sendMail } from "@/lib/emails/mailService";
import { getDate, sub, format, add } from "date-fns";



export async function OPTIONS( req: Request) {
  return NextResponse.json({}, { headers: getCorsHeaders(req.headers.get("Origin"))});
}
// Define allowed origins
const allowedOrigins = ["http://localhost:3001", "https://www.prisoneroflovestudio.com"];

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

  if (origin && allowedOrigins.includes(origin)) {
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
  const { employeeId, shiftId, serviceId, startOfBooking, endOfBooking, customerId, email } =
    await req.json();
  console.log(
    "BOOKING FROM API",
    employeeId,
    shiftId,
    serviceId,
    startOfBooking,
    endOfBooking,
    customerId,
    email
  );
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    if (!serviceId) {
      return new NextResponse("Service Id is required", { status: 400 });
    }

    if (!employeeId) {
      return new NextResponse("Employee Id is required", { status: 400 });
    }

    if (!startOfBooking) {
      return new NextResponse("Date is required", { status: 400 });
    }

    if (!endOfBooking) {
      return new NextResponse("Start Time is required", { status: 400 });
    }

    if (!shiftId) {
      return new NextResponse("Shift Id is required", { status: 400 });
    }

    if (!customerId) {
      return new NextResponse("Customer Id is required", { status: 400 });
    }

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    const bookings = await prismadb.booking.create({
      data: {
        storeId: params.storeId,
        serviceId: serviceId,
        employeeId: employeeId,
        startOfBooking: startOfBooking,
        endOfBooking: endOfBooking,
        shiftId: shiftId,
        customerId: customerId,
      },
    });
    const formatTime = (number: Number) => {
      // Convert number to string for easier manipulation
      let numStr = number.toString();

      // Pad the string with leading zeros if necessary to ensure it has at least 4 characters
      numStr = numStr.padStart(4, "0");

      // Extract hours and minutes
      const hours = parseInt(numStr.slice(0, -2), 10); // First part before the last two digits
      const minutes = numStr.slice(-2); // Last two digits

      // Format the time string
      return `${hours}:${minutes}`;
    };

    const dateFormatted = format(new Date(startOfBooking), "MMMM do, yyyy");
    // const startTimeFormatted = formatTime(startTime);
    const from: string = `${process.env.MAIL_USERNAME}`;
    const to: string = email || "";
    const subject: string = "Prisoner Of Love Studio - Appointment Confirmation";
    const mailTemplate: string = `<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #000000; border-radius: 20px  ">
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #FFFFFF border-radius: 20px;">
        <h1 style="text-align: center; color: #FFFFFF;">Ziggy's Salon</h3>
        <h3 style="text-align: center; color: #FFFFFF;">Welcome</h1>
        <p style="text-align: center; color: #FFFFFF;">Your appointment is on ${dateFormatted}</p>
        <div style="text-align: center;">
            <img src="cid:unique@gmail.com" width="400" alt="Welcome Image" style="border: none; border-radius: 20px;"/>
        </div>
        <p style="text-align: center; color: #FFFFFF;">If you have any questions, feel free to reach out to Ziggy @ .</p>
        <p style="text-align: center; color: #FFFFFF;">Thank you.</p>
    </div>
</body>`;

    sendMail(from, to, subject, mailTemplate);

    // console.log("BOOKING FROM API RESULT", bookings);

    return NextResponse.json(bookings, { headers: getCorsHeaders(req.headers.get("Origin"))});
  } catch (error) {
    console.log("[SHIFTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
