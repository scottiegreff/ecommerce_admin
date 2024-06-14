"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type ShiftColumn = {
  shiftId: string;
  fName: string;
  lName: string;
  startShift: string;
  endShift: string;
};

export const columns: ColumnDef<ShiftColumn>[] = [
  {
    accessorKey: "fName",
    header: "First",
  },
  {
    accessorKey: "lName",
    header: "Last",
  },
  {
    accessorKey: "startShift",
    header: "Start",
  },
  {
    accessorKey: "endShift",
    header: "End",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

// const openTime = 900;
// const closeTime = 1600;

// type BuildingShiftColumn = {
//   shiftId: string;
//   fName: string;
//   lName: string;
//   date: string;
//   startTime: number;
//   endTime: number;
// };

// function addMinutesToTime(time: number, minutesToAdd: number): number {
//   // Extract hours and minutes
//   const hours = Math.floor(time / 100);
//   const minutes = time % 100;
//   // Add minutes
//   let newMinutes = minutes + minutesToAdd;
//   // Handle hour change if minute count exceeds 59
//   let newHours = hours + Math.floor(newMinutes / 60);
//   // Normalize the minute count
//   newMinutes = newMinutes % 60;
//   // Ensure hours remain within the 24-hour clock range
//   newHours = newHours % 24;
//   // Combine hours and minutes
//   const newTime = newHours * 100 + newMinutes;
//   return newTime;
// }

// type TimeColumns = {
//   accessorKey: string;
//   header: string;
// };

// const additionalProperties: string[] = [];

// export type ShiftColumn = BuildingShiftColumn & {
//   [Key in (typeof additionalProperties)[number]]: string;
// };

// let startIndex = 6; // to insert at the correct position for the columns
// const timeInterval = 30;
// let time = openTime;
// let timeIntervals: TimeColumns[] = [];
// while (time < closeTime) {
//   const tempArr: TimeColumns = {
//     accessorKey: `${time}`,
//     header: String(addMinutesToTime(time, timeInterval)),
//   };

//   timeIntervals.push(tempArr);
//   additionalProperties.push(`${time}`);
//   time = addMinutesToTime(time, timeInterval);
// }
// buildingColumn.splice(startIndex, 0, ...timeIntervals);
// console.log("TYPE: ", additionalProperties);

// export const columns: ColumnDef<ShiftColumn>[] = buildingColumn;
