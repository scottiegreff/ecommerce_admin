import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { employeeId: string } }
) {
  try {
    if (!params.employeeId) {
      return new NextResponse("Employee id is required", { status: 400 });
    }

    const employee = await prismadb.employee.findUnique({
      where: {
        id: params.employeeId,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.log("[EMPLOYEE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
