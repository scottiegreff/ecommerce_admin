"use client";
import React, { useState, useEffect } from "react";
import { Heading } from "./ui/heading";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

const MarkupCalculator: React.FC = () => {
  const [cost, setCost] = useState<number | undefined>(undefined);
  const [markup, setMarkup] = useState<number | undefined>(undefined);
  const [margin, setMargin] = useState<number | undefined>(undefined);
  const [revenue, setRevenue] = useState<number | undefined>(undefined);
  const [profit, setProfit] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (cost !== undefined && markup !== undefined) {
      const revenue = cost + (cost * markup) / 100;
      const profit = revenue - cost;
      const margin = (profit / revenue) * 100;
      setRevenue(revenue);
      setProfit(profit);
      setMargin(margin);
    } else if (cost !== undefined && margin !== undefined) {
      const revenue = cost / (1 - margin / 100);
      const profit = revenue - cost;
      const markup = (profit / cost) * 100;
      setRevenue(revenue);
      setProfit(profit);
      setMarkup(markup);
    } else if (revenue !== undefined && margin !== undefined) {
      const cost = revenue * (1 - margin / 100);
      const profit = revenue - cost;
      const markup = (profit / cost) * 100;
      setCost(cost);
      setProfit(profit);
      setMarkup(markup);
    } else if (revenue !== undefined && markup !== undefined) {
      const cost = revenue / (1 + markup / 100);
      const profit = revenue - cost;
      const margin = (profit / revenue) * 100;
      setCost(cost);
      setProfit(profit);
      setMargin(margin);
    } else if (profit !== undefined && cost !== undefined) {
      const revenue = cost + profit;
      const markup = (profit / cost) * 100;
      const margin = (profit / revenue) * 100;
      setRevenue(revenue);
      setMarkup(markup);
      setMargin(margin);
    }
  }, [cost, markup, margin, revenue, profit]);

  const handleReset = () => {
    setCost(undefined);
    setMarkup(undefined);
    setMargin(undefined);
    setRevenue(undefined);
    setProfit(undefined);
  };

  return (
    <div className="md:col-span-1 p-6 shadow-sm rounded-lg border mb-10 md:mb-0">
      <Heading
        title="Markup Calculator"
        description="Enter two of the fields below to automatically calculate markup."
      />
      <div className="my-4">
        <Label className="block mb-2">Cost ( bought wholesale price )</Label>
        <Input
          type="number"
          placeholder="$"
          className="w-full p-2 border rounded"
          value={cost ?? ""}
          onChange={(e) => setCost(parseFloat(e.target.value) || undefined)}
        />
      </div>
      <div className="mb-4">
        <Label className="block mb-2">Percentage Markup ( (price - cost) / cost x 100 ) </Label>
        <Input
          type="number"
          placeholder="%"
          className="w-full p-2 border rounded"
          value={markup ?? ""}
          onChange={(e) => setMarkup(parseFloat(e.target.value) || undefined)}
        />
      </div>
      <div className="mb-4">
        <Label className="block mb-2">Margin ( profit / revenue x 100 )</Label>
        <Input
          type="number"
          placeholder="%"
          className="w-full p-2 border rounded"
          value={margin ?? ""}
          onChange={(e) => setMargin(parseFloat(e.target.value) || undefined)}
        />
      </div>
      <div className="mb-4">
        <Label className="block mb-2">Price ( revenue )</Label>
        <Input
          type="number"
          placeholder="$"
          className="w-full p-2 border rounded "
          value={revenue ?? ""}
          readOnly
        />
      </div>
      <div className="mb-4">
        <Label className="block mb-2">Profit</Label>
        <Input
          type="number"
          placeholder="$"
          className="w-full p-2 border rounded "
          value={profit ?? ""}
          readOnly
        />
      </div>
      <Button onClick={handleReset} className="ml-auto mt-5">
        Refresh
      </Button>
    </div>
  );
};

export default MarkupCalculator;
