import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { HeroColumn } from "./components/columns"
import { HeroClient } from "./components/client";

const HerosPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const heros = await prismadb.hero.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedHeros: HeroColumn[] = heros.map((item) => ({
    id: item.id,
    label: item.label,
    logoUrl: item.logoUrl,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HeroClient data={formattedHeros} />
      </div>
    </div>
  );
};

export default HerosPage;
