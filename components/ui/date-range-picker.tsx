"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useDateRangePickerStore } from "@/hooks/use-date-range-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [selected, setSelected] = useState<DateRange | undefined>({
    from: new Date(Date.now()),
    to: addDays(new Date(Date.now()),2),
  });

  const { date, setDate } = useDateRangePickerStore();

 
  return (
    <div className={cn("grid gap-2 text-gray-400", className)}>
      <label className="text-sm font-semibold text-gray-600">DATE OF WORK</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal text-xs",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 "/>
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 " align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={selected}
            onSelect={setSelected}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
