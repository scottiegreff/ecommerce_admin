import prismadb from "@/lib/prismadb";
import { Service } from "@/types"
import BookingForm from "./components/booking-form";

const BookingPage = async ({
  params,
}: {
  params: { bookingId: string; storeId: string };
}) => {

  const services: Service[] = await prismadb.service.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      images: true,
    },
  }).then((result) => {
    return result.map((service) => ({
      ...service,
      price: service.price.toString(),
    }));
  });

  const customers = await prismadb.customer.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const employees = await prismadb.employee.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BookingForm services={services} customers={customers} employees={employees} />
      </div>
    </div>
  );
};

export default BookingPage;
