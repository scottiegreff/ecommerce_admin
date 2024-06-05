import prismadb from "@/lib/prismadb";

import { CustomerForm } from "./components/customer-form";

const CustomerPage = async ({
  params
}: {
  params: { customerId: string }
}) => {
  const customer = await prismadb.customer.findUnique({
    where: {
      id: params.customerId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CustomerForm initialData={customer} />
      </div>
    </div>
  );
}

export default CustomerPage;
