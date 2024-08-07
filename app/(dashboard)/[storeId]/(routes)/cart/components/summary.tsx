"use client";

import axios from "axios";
import { useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAll();
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    const price = total + Number(item?.price);
    return price;
  }, 0);

  const param = useParams();
  const storeId = param.storeId;

  const itemMap = new Map();

  items.forEach((item) => {
    if (itemMap.has(item.id)) {
      itemMap.get(item.id).quantity++;
    } else {
      itemMap.set(item.id, { id: item.id, quantity: 1 });
    }
  });

  const cartData = Array.from(itemMap.values());

  const onCheckout = async () => {
    const response = await axios.post(`/api/${storeId}/checkout`, {
      cartData: cartData,
    });
    window.location = response.data.url;
  };

  return (
    <div className="mt-16 rounded-lg px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium ">Order summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium ">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
