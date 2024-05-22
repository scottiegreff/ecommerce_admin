import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { BookingColumn } from "./components/columns";
import { BookingClient } from "./components/client";
const BookingsPage = async ({ params }: { params: { storeId: string } }) => {
  const bookings = await prismadb.booking.findMany({
    where: {
      storeId: params.storeId,
    },
    select: {
      date: true,
      startTime: true,
      endTime: true,
    },
  });

  const customers = await prismadb.customer.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const services = await prismadb.service.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const employees = await prismadb.employee.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const shifts = await prismadb.shift.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const formattedBookings: BookingColumn[] = bookings.map((item) => ({
    // name: item.services.map((service) => service.name),
    // date: format(item.date, "MMMM do, yyyy"),
    // duration: item.services.map((service) => service.duration),
    // startTime: item.startTime,
    // endTime: item.endTime,
    // employeeId: item.shift.employeeId,
    // custFName: item.customer.custFName,
    // custLName: item.customer.custLName,
    // price: item.services.map((service) => Number(service.price)), // Convert Decimal to number
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BookingClient data={formattedBookings} customers={customers} services={services} employees={employees} shifts={shifts}/>
      </div>
    </div>
  );
};

export default BookingsPage;
