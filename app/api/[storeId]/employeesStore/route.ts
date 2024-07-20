import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";


// Define allowed origins
const allowedOrigins = process.env.FRONTEND_STORE_URL

// CORS handling function
function getCorsHeaders(origin: string | null) {
  const headers: {
    "Access-Control-Allow-Methods": string;
    "Access-Control-Allow-Headers": string;
    "Access-Control-Allow-Origin"?: string;
  } = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (origin && allowedOrigins?.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else {
    headers["Access-Control-Allow-Origin"] = "null";
  }

  return headers;
}

// export async function OPTIONS() {
//   return NextResponse.json({}, { headers: getCorsHeaders(req.headers.get("Origin")) });
// }

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const employees = await prismadb.employee.findMany({
      where: {
        storeId:  params.storeId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fName: true,
        lName: true,
      },
    });

    return NextResponse.json( employees , { headers: getCorsHeaders(req.headers.get("Origin"))});
  } catch (error) {
    console.log("[EMPLOYEES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
