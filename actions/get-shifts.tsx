import { Shift } from "@/types";

import prismadb from "@/lib/prismadb";


const getShifts = async (employeeId: string) => {
  const shifts = await prismadb.shift.findMany({
    where: {
      employeeId: employeeId,
    },
  });
};

export default getShifts;
