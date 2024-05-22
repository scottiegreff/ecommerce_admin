import prismadb from "@/lib/prismadb";

import { ShiftForm } from "./components/shift-form";

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
const ShiftPage = async ({
  params,
}: {
  params: { shiftId: string; storeId: string };
}) => {
  const shift = await prismadb.shift.findUnique({
    where: {
      id: params.shiftId,
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
        <ShiftForm initialData={shift} employees={employees} />
      </div>
    </div>
  );
};

export default ShiftPage;
