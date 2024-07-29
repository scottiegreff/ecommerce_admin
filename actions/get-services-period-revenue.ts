import prismadb from "@/lib/prismadb";

export const getMonthlyServiceRevenue = async (storeId: string, beginningOfMonth: Date) => {
  

  const endOfMonth = new Date(beginningOfMonth);
  endOfMonth.setMonth(beginningOfMonth.getMonth()+1);

  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
      createdAt: {
        gte: beginningOfMonth,
        lte: endOfMonth
      },
    },
    include: {
      orderItems: {
        include: {
          service: true,
        },
      },
    },
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + (item?.service?.price?.toNumber() || 0);
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
