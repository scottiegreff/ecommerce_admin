import PieChartCom from "@/components/pie-chart";
import AreaChartCom from "@/components/area-chart";
import BarChartCom from "@/components/bar-chart";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getProductCount } from "@/actions/get-product-count";
import { getServiceCount } from "@/actions/get-service-count";
import { getProductsRevenueByStore } from "@/actions/get-products-revenue";
import { getServicesRevenueByStore } from "@/actions/get-services-revenue";
import { formatter } from "@/lib/utils";
import getServices from "@/actions/get-services";

interface AnalyticsPageProps {
  params: {
    storeId: string;
  };
}
const Analytics: React.FC<AnalyticsPageProps> = async ({ params }) => {
  const getStartOfWeek = (): Date => {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
    return new Date(today.setDate(diff));
  };
  const getThirtyDaysAgo = (): Date => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    return new Date(thirtyDaysAgo.setHours(0, 0, 0, 0)); // Set to the start of the day
  };
  const getStartOfSixMonthsAgo = (): Date => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
    return new Date(sixMonthsAgo.setHours(0, 0, 0, 0)); // Set to the start of the day
  };
  const getOneYearAgo = (): Date => {
    const now = new Date();
    const oneYearAgo = new Date(now.setDate(now.getDate() - 365));
    return new Date(oneYearAgo.setHours(0, 0, 0, 0)); // Set to the start of the day
  };

  const totalRevenue = await getTotalRevenue(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const productCount = await getProductCount(params.storeId);
  const serviceCount = await getServiceCount(params.storeId);
  const productsRevenueCurrentYear = await getProductsRevenueByStore(
    params.storeId,
    getOneYearAgo()
  );
  const productsRevenueCurrentWeek = await getProductsRevenueByStore(
    params.storeId,
    getStartOfWeek()
  );
  const productsRevenuePastSixMonths = await getProductsRevenueByStore(
    params.storeId,
    getStartOfSixMonthsAgo()
  );
  const productsRevenuePastMonth = await getProductsRevenueByStore(
    params.storeId,
    getThirtyDaysAgo()
  );
  const servicesRevenueCurrentYear = await getServicesRevenueByStore(
    params.storeId,
    getOneYearAgo()
  );
  const servicesRevenueCurrentWeek = await getServicesRevenueByStore(
    params.storeId,
    getStartOfWeek()
  );
  const servicesRevenuePastSixMonths = await getServicesRevenueByStore(
    params.storeId,
    getStartOfSixMonthsAgo()
  );
  const servicesRevenuePastMonth = await getServicesRevenueByStore(
    params.storeId,
    getThirtyDaysAgo()
  );

  return (
    <>
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
            <h3 className="mb-2 font-semibold">1 WEEK</h3>
            <PieChartCom
              chartData={productsRevenueCurrentWeek}
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
            <h3 className="mb-2 font-semibold">6 MONTHS</h3>
            <PieChartCom
              chartData={productsRevenuePastSixMonths}
              timePeriod={getStartOfSixMonthsAgo()}
            />
          </div>
          <div className="mb-5 flex flex-col items-center justify-center">
            <h3 className="mb-2 font-semibold">12 MONTH</h3>

            <PieChartCom
              chartData={productsRevenueCurrentYear}
              timePeriod={getOneYearAgo()}
            />
          </div>
        </div>
        <div className="md:grid md:grid-cols-2 gap-4">
          <div className="mb-5 flex flex-col items-center justify-center">
            <h3 className="mb-2 font-semibold">1 WEEK</h3>
            <PieChartCom
              chartData={servicesRevenueCurrentWeek}
              timePeriod={getStartOfWeek()}
            />
          </div>
          <div className="mb-5 flex flex-col items-center justify-center">
            <h3 className="mb-2 font-semibold">1 MONTH</h3>
            <PieChartCom
              chartData={servicesRevenuePastMonth}
              timePeriod={getThirtyDaysAgo()}
            />
          </div>
          <div className="mb-5 flex flex-col items-center justify-center">
            <h3 className="mb-2 font-semibold">6 MONTHS</h3>
            <PieChartCom
              chartData={servicesRevenuePastSixMonths}
              timePeriod={getStartOfSixMonthsAgo()}
            />
          </div>
          <div className="mb-5 flex flex-col items-center justify-center">
            <h3 className="mb-2 font-semibold">12 MONTH</h3>

            <PieChartCom
              chartData={servicesRevenueCurrentYear}
              timePeriod={getOneYearAgo()}
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
      <AreaChartCom />
      <BarChartCom />
    </>
  );
};

export default Analytics;
