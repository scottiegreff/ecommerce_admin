import prismadb from "@/lib/prismadb";
import { EmployeeColumn } from "./components/columns";
import { EmployeesClient } from "./components/client";

import { format } from "date-fns";


const EmployeePage = async ({ params }: { params: { storeId: string } }) => {
  const employees = await prismadb.employee.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedEmployee: EmployeeColumn[] = employees.map((item) => ({
    id: item.id,
    fName: item.fName,
    lName: item.lName,
    email: item.email,
    phone: item.phone,
    employeeId: item.id,
    isActive: item.isActive,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));


  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EmployeesClient data={formattedEmployee} />{" "}
      </div>
    </>
  );
};

export default EmployeePage;
