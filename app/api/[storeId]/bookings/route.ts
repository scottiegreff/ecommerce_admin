import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { sendMail } from "@/lib/emails/mailService";
import { format } from "date-fns";

const corsHeaders = {
  "Access-Control-Allow-Origin": `${process.env.FRONTEND_STORE_URL}`,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const {
    employeeId,
    shiftId,
    serviceId,
    startOfBooking,
    endOfBooking,
    customerId,
    email,
  } = await req.json();
  // console.log(
  //   "BOOKING FROM API",
  //   employeeId,
  //   shiftId,
  //   serviceId,
  //   startOfBooking,
  //   endOfBooking,
  //   customerId,
  //   email
  // );
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
      return new NextResponse("Start of Booking is required", { status: 400 });
    }

    if (!endOfBooking) {
      return new NextResponse("End of Booking is required", { status: 400 });
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

    const startFormatted = format(new Date(startOfBooking), "MMMM do, yyyy, h:mm a");
    const endFormatted = format(new Date(endOfBooking), "h:mm a");
    const from: string = "scottiegreff@gmail.com";
    const to: string = email || "";
    const subject: string = "Ziggy's Hair Appointment Confirmation";
    const mailTemplate: string = `<body style="font-family: Arial, sans-serif; font-weight: 200; margin: 0; padding: 20px; background: #000000; border-radius: 20px  ">
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #333 border-radius: 20px;">
        <h1 style="text-align: center; color: #FFFFFF;">Prisoner Of Love Studio</h3>
        <h3 style="text-align: center; color: #FFFFFF;">Welcome</h1>
        <p style="text-align: center; color: #FFFFFF;">Your appointment is on <strong style="font-weight: 900;">${startFormatted}</strong></p>
        <div style="text-align: center;">
            <img src="cid:unique@gmail.com" width="400" alt="Prisoner Of Life Logo" style="border: none; border-radius: 20px;"/>
        </div>
        <p style="text-align: center; color: #FFFFFF;">If you have any questions, feel free to reach out to:</p>
        <p style="text-align: center; color: #FFFFFF;">Ziggy at (604) 441-1635 or ziggydoeshair@gmail.com</p>
    </div>
</body>`;

    sendMail(from, to, subject, mailTemplate);

    console.log("BOOKING FROM API RESULT", bookings);

    return NextResponse.json(bookings, { headers: corsHeaders });
  } catch (error) {
    console.log("[SHIFTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
