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
// Function to get product revenue by store
export const getProductsRevenueByStore = async (
  storeId: string,
  timePeriod: Date
) => {
  const paidProducts = await prismadb.orderItem.findMany({
    where: {
      order: {
        storeId: storeId,

        isPaid: true,
        createdAt: {
          gte: timePeriod,
        },
      },
      productId: {
        not: null,
      },
    },
  });

  // Extract product IDs
  const productIds = paidProducts.map((item, index) => {
    return item.productId;
  });

  const products = [];

  for (const id of productIds) {
    const product = await prismadb.product.findUnique({
      where: {
        id: id || undefined,
      },
      select: {
        name: true,
        price: true,
      },
    });
    if (product) {
      products.push(product);
    }
  }

  const aggregateProducts = (products: any) => {
    for (let i = 0; i < products.length; i++) {
      for (let j = i + 1; j < products.length; j++) {
        if (products[i].name === products[j].name) {
          products[i].price =
            Number(products[j].price) + Number(products[i].price);
          products.pop();
        }
      }
    }
  };

  aggregateProducts(products);

  const chartData = products.map((item, index) => {
    return {
      name: item.name,
      revenue: Number(item.price),
      fill: getRandomHexColor(),
    };
  });

  return chartData;
};
