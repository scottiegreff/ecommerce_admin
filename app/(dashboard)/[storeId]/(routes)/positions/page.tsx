import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { PositionColumn } from "./components/columns"
import { PositionClient } from "./components/client";

const PositionsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const positions = await prismadb.position.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedPositions: PositionColumn[] = positions.map((item) => ({
    id: item.id,
    title: item.title,
    wage: item.wage,
    commission: item.commission,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PositionClient data={formattedPositions} />
      </div>
    </div>
  );
};

export default PositionsPage;
