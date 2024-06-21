import prismadb from "@/lib/prismadb";

export const getServiceCount = async (storeId: string) => {
  const serviceCount = await prismadb.service.count({
    where: {
      storeId,
      isArchived: false,
    }
  });

  return serviceCount;
};
