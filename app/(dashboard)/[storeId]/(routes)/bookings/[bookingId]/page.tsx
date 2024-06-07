import prismadb from "@/lib/prismadb";

import BookingForm from "./components/booking-form";

const BookingPage = async ({
  params,
}: {
  params: { bookingId: string; storeId: string };
}) => {
  // const booking = await prismadb.booking.findUnique({
  //   where: {
  //     id: params.bookingId,
  //   },
  //   include: {
  //     customer: {
  //       select: {
  //         custFName: true,
  //         custLName: true,
  //         email: true,
  //         phone: true,
  //       },
  //     },
  //     service: {
  //       select: {
  //         name: true,
  //       },
  //     },
  //     employee: {
  //       select: {
  //         fName: true,
  //         lName: true,
  //       },
  //     },
  //   },
  // });

  // console.log("BOOKING: !",booking);

  // const booking = await prismadb.booking.findUnique({
  //   where: {
  //     id: params.bookingId,
  //   },
  // });

  // const services = await prismadb.service.findMany({
  //   where: {
  //     storeId: params.storeId,
  //   },
  // });
  // const employees = await prismadb.employee.findMany({
  //   where: {
  //     storeId: params.storeId,
  //   },
  // });

  // const shifts = await prismadb.shift.findMany({
  //   where: {
  //     storeId: params.storeId,
  //   },
  // });

  const customers = await prismadb.customer.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BookingForm data={customers} />
      </div>
    </div>
  );
};

export default BookingPage;
