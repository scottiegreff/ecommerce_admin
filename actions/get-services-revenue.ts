// Import Prisma client
import prismadb from "@/lib/prismadb";

// Define the type for the chart data
interface ChartData {
  name: string;
  totalRevenue: number | null;
}
function getRandomHexColor() {
  // Generate a random number between 0 and 0xFFFFFF, convert it to a hex string, and pad with leading zeros
  const randomColor = Math.floor(Math.random() * 0xffffff).toString(16);
  // Return the hex color code formatted with a leading '#'
  return `#${randomColor.padStart(6, "0")}`;
}
// Function to get service revenue by store
export const getServicesRevenueByStore = async (
  storeId: string,
  timePeriod: Date
) => {
  const paidServices = await prismadb.orderItem.findMany({
    where: {
      order: {
        storeId: storeId,

        isPaid: true,
        createdAt: {
          gte: timePeriod,
        },
      },
      serviceId: {
        not: null,
      },
    },
  });

  // Extract service IDs
  const serviceIds = paidServices.map((item, index) => {
    return item.serviceId;
  });

  const services = [];

  for (const id of serviceIds) {
    const service = await prismadb.service.findUnique({
      where: {
        id: id || undefined,
      },
      select: {
        name: true,
        price: true,
      },
    });
    if (service) {
      services.push(service);
    }
  }

  const aggregateServices = (services: any) => {
    for (let i = 0; i < services.length; i++) {
      for (let j = i + 1; j < services.length; j++) {
        if (services[i].name === services[j].name) {
          services[i].price =
            Number(services[j].price) + Number(services[i].price);
          services.pop();
        }
      }
    }
  };

  aggregateServices(services);

  const chartData = services.map((item, index) => {
    return {
      name: item.name,
      revenue: Number(item.price),
      fill: getRandomHexColor(),
    };
  });

  return chartData;
};
