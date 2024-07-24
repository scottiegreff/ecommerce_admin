import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
  
  const currentYear = new Date().getFullYear();
  const januaryFirst = new Date(currentYear, 0, 1);

  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
      createdAt: {
        gte: januaryFirst,
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

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + (item?.product?.price?.toNumber() || 0)+ (item?.service?.price?.toNumber() || 0);
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
