import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ServicesClient } from "./components/client";
import { ServiceColumn } from "./components/columns";

const ServicesPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const services = await prismadb.service.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
    },
  });

  const formattedServices: ServiceColumn[] = services.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description || "", // Handle null description
    duration: item.duration,
    price: formatter.format(item.price),
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    category: item.category.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ServicesClient data={formattedServices} />
      </div>
    </div>
  );
};

export default ServicesPage;
