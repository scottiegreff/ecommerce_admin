import prismadb from "@/lib/prismadb";

import { BookingForm } from "./components/booking-form";

export type Employee = {
  id: string;
  storeId: string;
  fName: string;
  lName: string;
  email: string;
  phone: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
};
const BookingPage = async ({
  params,
}: {
  params: { bookingId: string; storeId: string };
}) => {
  const booking = await prismadb.booking.findUnique({
    where: {
      id: params.bookingId,
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

  const customers = await prismadb.customer.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BookingForm initialData={booking} services={services} employees={employees} shifts={shifts} customers={customers} />
      </div>
    </div>
  );
};

export default BookingPage;
