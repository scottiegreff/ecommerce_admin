import prismadb from "@/lib/prismadb";

export const getSalesCount = async (storeId: string) => {
  const currentYear = new Date().getFullYear();
  const januaryFirst = new Date(currentYear, 0, 1);
  const salesCount = await prismadb.order.count({
    where: {
      storeId,
      isPaid: true,
      createdAt: {
        gte: januaryFirst,
      },
    },
  });

  return salesCount;
};
