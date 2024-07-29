import PieChartCom from "@/components/pie-chart";
import AreaChartCom from "@/components/area-chart";
import BarChartCom from "@/components/bar-chart";

import { getProductsRevenueByStore } from "@/actions/get-products-revenue";
import { getServicesRevenueByStore } from "@/actions/get-services-revenue";
import { getMonthlyProductRevenue } from "@/actions/get-monthly-product-revenue";

interface AnalyticsPageProps {
  params: {
    storeId: string;
  };
}
const Analytics: React.FC<AnalyticsPageProps> = async ({ params }) => {
  
  const getStartOfToday = () => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    return startOfToday;
  };

  const getStartOfWeek = (): Date => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
    return new Date(sevenDaysAgo.setHours(0, 0, 0, 0)); // Set to the start of the day
  };
  const getThirtyDaysAgo = (): Date => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    return new Date(thirtyDaysAgo.setHours(0, 0, 0, 0)); // Set to the start of the day
  };
  const getStartOfThreeMonthsAgo = (): Date => {
    const now = new Date();
    const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
    return new Date(ninetyDaysAgo.setHours(0, 0, 0, 0)); // Set to the start of the day
  };
  // const getOneYearAgo = (): Date => {
  //   const now = new Date();
  //   const oneYearAgo = new Date(now.setDate(now.getDate() - 365));
  //   return new Date(oneYearAgo.setHours(0, 0, 0, 0)); // Set to the start of the day
  // };
  // const getStartOfSixMonthsAgo = (): Date => {
  //   const now = new Date();
  //   const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
  //   return new Date(sixMonthsAgo.setHours(0, 0, 0, 0)); // Set to the start of the day
  // };

  const productsRevenuePastDay = await getProductsRevenueByStore(
    params.storeId,
    getStartOfToday()
  );
  const productsRevenuePastWeek = await getProductsRevenueByStore(
    params.storeId,
    getStartOfWeek()
  );
  const productsRevenuePastMonth = await getProductsRevenueByStore(
    params.storeId,
    getThirtyDaysAgo()
  );
  const productsRevenuePastThreeMonths = await getProductsRevenueByStore(
    params.storeId,
    getStartOfThreeMonthsAgo()
  );
  const servicesRevenuePastDay = await getServicesRevenueByStore(
    params.storeId,
    getStartOfToday()
  );
  const servicesRevenuePastWeek = await getServicesRevenueByStore(
    params.storeId,
    getStartOfWeek()
  );
  const servicesRevenuePastMonth = await getServicesRevenueByStore(
    params.storeId,
    getThirtyDaysAgo()
  );
  const servicesRevenueThreeMonth = await getServicesRevenueByStore(
    params.storeId,
    getStartOfThreeMonthsAgo()
  );

  const currentYear = new Date().getFullYear();
  const months = Array.from(
    { length: 12 },
    (_, i) => new Date(currentYear, i, 1)
  );

  // Function to format month to a string like "January"
  function formatMonth(date: Date): string {
    return date.toLocaleString("default", { month: "long" });
  }
  // console.log("START")
  type ChartData = {
    month: string;
    product: number;
    service: number;
  }[];

  const monthlyProductRevenue = async () => {
    const chartData = await Promise.all(
      months.map(async (item) => {
        const monthlyRevenue = await getMonthlyProductRevenue(
          params.storeId,
          item
        );

        return monthlyRevenue;
      })
    );

    return chartData;
  };
  const chartData: ChartData = await monthlyProductRevenue();

  return (
    <>
      <div className="md:w-[80vw] m-auto">
        <div className="md:mt-[3rem] font-thin text-5xl flex justify-around items-center">
          <h2 className="">SHORT TERM</h2>
        </div>
        <div className="md:mt-[1rem] font-thin text-4xl flex justify-around items-center">
          <h2>GOODS</h2>
          <h2>SERVICES</h2>
        </div>
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:grid md:grid-cols-2 gap-4">
            <div className="mb-5 flex flex-col items-center justify-center">
              <h3 className="mb-2 font-semibold">TODAY</h3>

              <PieChartCom
                chartData={productsRevenuePastDay}
                timePeriod={getStartOfToday()}
              />
            </div>
            <div className="mb-5 flex flex-col items-center justify-center">
              <h3 className="mb-2 font-semibold">1 WEEK</h3>
              <PieChartCom
                chartData={productsRevenuePastWeek}
                timePeriod={getStartOfWeek()}
              />
            </div>
            <div className="mb-5 flex flex-col items-center justify-center">
              <h3 className="mb-2 font-semibold">1 MONTH</h3>
              <PieChartCom
                chartData={productsRevenuePastMonth}
                timePeriod={getThirtyDaysAgo()}
              />
            </div>
            <div className="mb-5 flex flex-col items-center justify-center">
              <h3 className="mb-2 font-semibold">3 MONTHS</h3>
              <PieChartCom
                chartData={productsRevenuePastThreeMonths}
                timePeriod={getStartOfThreeMonthsAgo()}
              />
            </div>
          </div>
          <div className="md:grid md:grid-cols-2 gap-4">
            <div className="mb-5 flex flex-col items-center justify-center">
              <h3 className="mb-2 font-semibold">TODAY</h3>
              <PieChartCom
                chartData={servicesRevenuePastDay}
                timePeriod={getStartOfToday()}
              />
            </div>
            <div className="mb-5 flex flex-col items-center justify-center">
              <h3 className="mb-2 font-semibold">1 WEEK</h3>
              <PieChartCom
                chartData={servicesRevenuePastWeek}
                timePeriod={getStartOfWeek()}
              />
            </div>
            <div className="mb-5 flex flex-col items-center justify-center">
              <h3 className="mb-2 font-semibold">1 MONTHS</h3>
              <PieChartCom
                chartData={servicesRevenuePastMonth}
                timePeriod={getThirtyDaysAgo()}
              />
            </div>
            <div className="mb-5 flex flex-col items-center justify-center">
              <h3 className="mb-2 font-semibold">3 MONTH</h3>

              <PieChartCom
                chartData={servicesRevenueThreeMonth}
                timePeriod={getStartOfThreeMonthsAgo()}
              />
            </div>
          </div>
        </div>
        <div className="md:mt-[3rem] font-thin text-5xl flex justify-around items-center">
          <h2 className="">LONG TERM</h2>
        </div>
        <div className="md:mt-[1rem] font-thin text-4xl flex justify-around items-center">
          <h2>GOODS</h2>
          <h2>SERVICES</h2>
        </div>
        <div className="mb-10">
          <AreaChartCom chartData={chartData} />
        </div>
        <BarChartCom chartData={chartData} />

        {/* <BarChartCom /> */}
      </div>
    </>
  );
};

export default Analytics;
