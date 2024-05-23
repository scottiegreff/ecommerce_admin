// import { format } from "date-fns";

// import prismadb from "@/lib/prismadb";

// import { BookingColumn } from "./components/columns";
// import { BookingClient } from "./components/client";
// import { Service } from "@prisma/client";
// const BookingsPage = async ({ params }: { params: { storeId: string } }) => {
//   const bookings = await prismadb.booking.findMany({
//     where: {
//       storeId: params.storeId,
//     },
//   });

//   const customers = await prismadb.customer.findMany({
//     where: {
//       storeId: params.storeId,
//     },
//   });

//   const services = await prismadb.service.findMany({
//     where: {
//       storeId: params.storeId,
//     },
//   });

//   const employees = await prismadb.employee.findMany({
//     where: {
//       storeId: params.storeId,
//     },
//   });

//   const shifts = await prismadb.shift.findMany({
//     where: {
//       storeId: params.storeId,
//     },
//   });

//   const formattedBookings: BookingColumn[] = bookings.map((item) => ({
//     bookingId: item.id,
//     serviceId: item.serviceId,
//     customerId: item.customerId,
//     shiftId: item.shiftId,
//     date: format(new Date(item.date), "dd/MM/yyyy"),
//     startTime: item.startTime,
//     endTime: item.endTime,
   
//   }));

//   return (
//     <div className="flex-col">
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <BookingClient data={formattedBookings} customers={customers} services={services} employees={employees} shifts={shifts}/>
//       </div>
//     </div>
//   );
// };

// export default BookingsPage;
