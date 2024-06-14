import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { BookingColumn } from "./components/columns";
import { BookingClient } from "./components/client";
const BookingsPage = async ({ params }: { params: { storeId: string } }) => {
  const bookings = await prismadb.booking.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      customer: {
        select: {
          custFName: true,
          custLName: true,
          email: true,
          phone: true,
        },
      },
      service: {
        select: {
          name: true,
          duration: true,
        },
      },
      employee: {
        select: {
          fName: true,
          lName: true,
        },
      },
    },
    orderBy: {
      startOfBooking: "desc",
    },
  });

  const formattedBookings: BookingColumn[] = bookings.map((item) => ({
    bookingId: item.id,
    startOfBooking: format(item.startOfBooking, "MMMM do, yyyy"),
    endOfBooking: format(item.endOfBooking, "MMMM do, yyyy"),
    custFName: item.customer.custFName,
    custLName: item.customer.custLName,
    email: item.customer.email,
    phone: item.customer.phone,
    name: item.service[0]?.name,
    fName: item.employee.fName,
    lName: item.employee.lName,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BookingClient data={formattedBookings} />
      </div>
    </div>
  );
};

export default BookingsPage;
