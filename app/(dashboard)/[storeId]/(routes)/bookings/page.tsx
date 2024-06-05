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
      date: "desc",
    },
  });

  // const customers = await prismadb.customer.findMany({
  //   where: {
  //     storeId: params.storeId,
  //   },
  // });

  // const services = await prismadb.service.findMany({
  //   where: {
  //     storeId: params.storeId,
  //   },
  //   select: {
  //     name: true,
  //   },
  // });

  // const employees = await prismadb.employee.findMany({
  //   where: {
  //     storeId: params.storeId,
  //   },
  // });

  const shifts = await prismadb.shift.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  // date: string;
  // startTime: string;
  // custFName: string;
  // custLName: string;
  // email: string;
  // phone: string;
  // name: string;
  // fName: string;
  // lName: string;

  const formattedBookings: BookingColumn[] = bookings.map((item) => ({
    date: format(item.date, "MMMM do, yyyy"),
    startTime: item.startTime,
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
