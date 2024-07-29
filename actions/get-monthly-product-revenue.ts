import prismadb from "@/lib/prismadb";
import { Customer, Order, Product, Service, Store } from "@prisma/client";
import Decimal from 'decimal.js';

export const getMonthlyProductRevenue = async (
  storeId: string,
  beginningOfMonth: Date
) => {
  const endOfMonth = new Date(beginningOfMonth);
  endOfMonth.setMonth(beginningOfMonth.getMonth() + 1);

  const orders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
      createdAt: {
        gte: beginningOfMonth,
        lte: endOfMonth,
      },
    },
    include: {
      orderItems: {
        include: {
          product: true,
          service: true,
        },
      },
    },
  });
  console.log("!!!!!!!!!!!MONTH ??????????? ", beginningOfMonth.toDateString());

  // console.log("Orders: ", orders);



  let productRevenue = 0
  let serviceRevenue = 0
  orders.map((order) => {
    order.orderItems.map((item) => {
      console.log("ITEM: :   ", item)
      if (item.productId) {
        // console.log("PRODUCT:   ", item.product?.price)
        const price = item.product?.price
        productRevenue += Number(price)
      
      }
      if (item.serviceId) {
        const price = item.service?.price
        serviceRevenue += Number(price)
      }
    });
  });

  function formatMonth(date: Date): string {
    return date.toLocaleString("default", { month: "long" });
  }
  // console.log("Services:   ", serviceRevenue)
  // console.log("Products:   ", productRevenue)
  // console.log("HERE", { month: formatMonth(beginningOfMonth), product: productRevenue, service: serviceRevenue })
return { month: formatMonth(beginningOfMonth), product: productRevenue, service: serviceRevenue }

};
