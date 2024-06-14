import prismadb from "@/lib/prismadb";

import { ShiftForm } from "./components/shift-form";

const EmployeePage = async ({
  params,
}: {
  params: { employeeId: string; storeId: string };
}) => {
  const employees = await prismadb.employee.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ShiftForm employees={employees} />
      </div>
    </div>
  );
};

export default EmployeePage;
