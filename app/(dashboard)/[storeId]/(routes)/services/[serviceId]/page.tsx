import prismadb from "@/lib/prismadb";

import { ServiceForm } from "./components/service-form";

const ServicePage = async ({
  params
}: {
  params: { serviceId: string, storeId: string }
}) => {
  const service = await prismadb.service.findUnique({
    where: {
      id: params.serviceId,
    },
    include: {
      images: true,
    }
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ServiceForm 
          categories={categories} 
          colors={colors}
          sizes={sizes}
          initialData={service}
        />
      </div>
    </div>
  );
}

export default ServicePage;
