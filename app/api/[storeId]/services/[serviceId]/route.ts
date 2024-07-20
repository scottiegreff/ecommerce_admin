import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function OPTIONS( req: Request) {
  return NextResponse.json({}, { headers: getCorsHeaders(req.headers.get("Origin"))});
}
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

export async function GET(
  req: Request,
  { params }: { params: { serviceId: string } }
) {
  try {
    if (!params.serviceId) {
      return new NextResponse("Service id is required", { status: 400 });
    }

    const service = await prismadb.service.findUnique({
      where: {
        id: params.serviceId
      },
      include: {
        images: true,
        category: true,
      }
    });
  
    return NextResponse.json(service, { headers: getCorsHeaders(req.headers.get("Origin"))});
  } catch (error) {
    console.log('[SERVICE_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { serviceId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.serviceId) {
      return new NextResponse("Service id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const service = await prismadb.service.delete({
      where: {
        id: params.serviceId
      },
    });
  
    return NextResponse.json(service);
  } catch (error) {
    console.log('[SERVICE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { serviceId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, description, price, categoryId, images, duration, isFeatured, isArchived } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.serviceId) {
      return new NextResponse("Service id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!duration) {
      return new NextResponse("Time is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }


    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    await prismadb.service.update({
      where: {
        id: params.serviceId
      },
      data: {
        name,
        description,
        price,
        categoryId,
        duration,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const service = await prismadb.service.update({
      where: {
        id: params.serviceId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    })
  
    return NextResponse.json(service);
  } catch (error) {
    console.log('[SERVICE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
