import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProductOrderColumn } from "./components/productColumns";
import { ServiceOrderClient } from "./components/serviceClient";
import { ProductOrderClient } from "./components/productClient";
import { ServiceOrderColumn } from "./components/serviceColumns";
import { Separator } from "@/components/ui/separator";


const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const productOrders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const serviceOrders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          service: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProductOrders: ProductOrderColumn[] = productOrders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => orderItem?.product?.name)
      .join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item?.product?.price || 0);
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  const formattedServiceOrders: ServiceOrderColumn[] = serviceOrders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    services: item.orderItems
      .map((orderItem) => orderItem?.service?.name)
      .join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item?.service?.price || 0);
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ServiceOrderClient data={formattedServiceOrders} />
        </div>
      </div>
      <Separator/>
      <div className="flex-col mt-5">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ProductOrderClient data={formattedProductOrders} />
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
