import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { sendMail } from "@/lib/emails/mailService";
import { format, parseISO } from "date-fns";

export async function OPTIONS(req: Request) {
  return NextResponse.json(
    {},
    { headers: getCorsHeaders(req.headers.get("Origin")) }
  );
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

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") || undefined;
    const shiftId = searchParams.get("shiftId") || undefined;
    const employeeId = searchParams.get("employeeId") || undefined;
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

    if (!shiftId) {
      return new NextResponse("Shift Id is required", { status: 400 });
    }

    if (!employeeId) {
      return new NextResponse("Employee Id is required", { status: 400 });
    }
    const bookings = await prismadb.booking.findMany({
      where: {
        storeId: params.storeId,
        id: id,
        shiftId: shiftId,
        employeeId: employeeId,
      },
    });

    return NextResponse.json(bookings,  { headers: getCorsHeaders(req.headers.get("Origin"))});
  } catch (error) {
    console.log("[SHIFTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const {
    serviceId,
    startOfBooking,
    endOfBooking,
    employeeId,
    customerId,
    shiftId,
    email,
  } = await req.json();

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

    if (!startOfBooking) {
      return new NextResponse("Start of Booking is required", { status: 400 });
    }

    if (!endOfBooking) {
      return new NextResponse("End of Booking is required", { status: 400 });
    }
    if (!employeeId) {
      return new NextResponse("Employee Id is required", { status: 400 });
    }

    if (!customerId) {
      return new NextResponse("Customer Id is required", { status: 400 });
    }

    if (!shiftId) {
      return new NextResponse("Shift Id is required", { status: 400 });
    }

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    // check to see if there is an existing booking of the same date and employee
    const alreadyBooked = await prismadb.booking.findFirst({
      where: {
        storeId: params.storeId,
        serviceId: serviceId,
        startOfBooking: startOfBooking,
      },
    });

    if (alreadyBooked) {
      return new NextResponse("Appointment Exist", { status: 400 });
    }

    const bookings = await prismadb.booking.create({
      data: {
        storeId: params.storeId,
        serviceId: serviceId,
        service: { connect: { id: serviceId } },
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
    const startDate = parseISO(startOfBooking);
    const startFormatted = format(startDate, "MMMM do, yyyy, h:mm a");
    // const endFormatted = format(new Date(endOfBooking), "h:mm a");

    const from: string = `${process.env.MAIL_USERNAME}`;
    const to: string = email || "";
    const subject: string =
      "Prisoner Of Love Studio - Appointment Confirmation";
    const mailTemplate: string = `<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #000000; border-radius: 20px  ">
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #333 border-radius: 20px;">
        <h1 style="text-align: center;font-weight: 200; color: #FFFFFF;">Prisoner Of Love Studio</h1>
        <h3 style="text-align: center;font-weight: 200; color: #FFFFFF;">Appointment Confirmation</h3>
        <p style="text-align: center; font-weight: 200; color: #FFFFFF;">Your appointment is on <strong style="font-weight: 900;">${startFormatted}</strong></p>
        <div style="text-align: center; font-weight: 200;">
            <img src="cid:unique@gmail.com" width="400" alt="Prisoner Of Life Logo" style="border: none; border-radius: 20px;"/>
        </div>
        <p style="text-align: center; font-weight: 200; color: #FFFFFF;">If you have any questions, feel free to reach out to:</p>
        <p style="text-align: center; font-weight: 200; color: #FFFFFF;">Ziggy at (604) 441-1635 or ziggydoeshair@gmail.com</p>
    </div>
</body>`;

    sendMail(from, to, subject, mailTemplate);

    return NextResponse.json(bookings, {
      headers: getCorsHeaders(req.headers.get("Origin")),
    });
  } catch (error) {
    console.log("[SHIFTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
