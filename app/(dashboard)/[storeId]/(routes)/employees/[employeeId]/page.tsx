import prismadb from "@/lib/prismadb";

import { EmployeeForm } from "./components/employee-form";

const EmployeePage = async ({
  params,
}: {
  params: { employeeId: string; storeId: string };
}) => {
  const employee = await prismadb.employee.findUnique({
    where: {
      id: params.employeeId,
    },
    include: {
      position: true
    },
  });

  const positions = await prismadb.position.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });


  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EmployeeForm initialData={employee} positions={positions} />
      </div>
    </div>
  );
};

export default EmployeePage;
