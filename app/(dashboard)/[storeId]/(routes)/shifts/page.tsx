import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { ShiftColumn } from "./components/columns";
import { ShiftClient } from "./components/client";
import { id } from "date-fns/locale";

const ShiftsPage = async ({ params }: { params: { storeId: string } }) => {
  const shifts = await prismadb.shift.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      employee: {
      select: {
        fName: true,
        lName: true,
      },
    },
    },
  });

  const formattedShifts: ShiftColumn[] = shifts.map((item) => ({
    shiftId: item.id,
    fName: item.employee.fName,
    lName: item.employee.lName,
    startShift: format(item.startShift, "MMMM do yyy - h:mm a"),
    endShift: format(item.endShift, "h:mm a"),
  }));



  // const formattedShifts: ShiftMeta[] = shifts.map((item) => ({
  //   shiftId: item.id,
  //   fName: item.employee.fName,
  //   lName: item.employee.lName,
  //   date: format(item.date, "MMMM do, yyyy"),
  //   startTime: item.startTime,
  //   endTime: item.endTime,

  // }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ShiftClient data={formattedShifts} />
      </div>
    </div>
  );
};

export default ShiftsPage;
