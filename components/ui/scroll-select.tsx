import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const hours = [
  { hour: 1, label: "1:00 AM" },
  { hour: 2, label: "2:00 AM" },
  { hour: 3, label: "3:00 AM" },
  { hour: 4, label: "4:00 AM" },
  { hour: 5, label: "5:00 AM" },
  { hour: 6, label: "6:00 AM" },
  { hour: 7, label: "7:00 AM" },
  { hour: 8, label: "8:00 AM" },
  { hour: 9, label: "9:00 AM" },
  { hour: 10, label: "10:00 AM" },
  { hour: 11, label: "11:00 AM" },
  { hour: "", label: "_________________" },
  { hour: 12, label: "12:00 PM" },
  { hour: 13, label: "1:00 PM" },
  { hour: 14, label: "2:00 PM" },
  { hour: 15, label: "3:00 PM" },
  { hour: 16, label: "4:00 PM" },
  { hour: 17, label: "5:00 PM" },
  { hour: 18, label: "6:00 PM" },
  { hour: 19, label: "7:00 PM" },
  { hour: 20, label: "8:00 PM" },
  { hour: 21, label: "9:00 PM" },
  { hour: 22, label: "10:00 PM" },
  { hour: 23, label: "11:00 PM" },
  { hour: 24, label: "12:00 AM" },
];

export function SelectScrollable({ label }: { label: string }) {
  // console.log("Selected", hour )
  return (
    <>
      <div className="flex flex-col justify-start gap-2">
        <label className="text-sm font-semibold text-gray-600">{label}</label>
        <Select>
          <SelectTrigger className="text-xs text-gray-400 w-[280px]">
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent className="max-h-[50vh] overflow-y-auto">
            <SelectGroup>
              {hours.map((hour) => (
                <SelectItem key={hour.hour} value={hour.hour.toString()}>
                  {hour.label}
                </SelectItem>
              ))}
            </SelectGroup>
            {/* <SelectGroup>
          <hr/>
          <SelectLabel className="text-red-500 my-1">AFTERNOON</SelectLabel>
          <hr/>
          {pmHours.map((hour) => (
            <SelectItem key={hour} value={hour}>
              {hour}
            </SelectItem>
          ))} */}
            {/* </SelectGroup> */}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
