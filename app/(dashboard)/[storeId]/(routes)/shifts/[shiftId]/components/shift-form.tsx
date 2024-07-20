"use client";

import * as z from "zod";
import axios from "axios";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Shift, Employee, Store } from "@prisma/client";

import { useParams, useRouter } from "next/navigation";

import Link from "next/link";
import { addDays, format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { start } from "repl";

interface ShiftFormProps {
  employees: Employee[];
}

export const ShiftForm: React.FC<ShiftFormProps> = ({ employees }) => {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId;
  const [storeData, setStoreData] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [startShift, setStartShift] = useState<Date>();
  const [endShift, setEndShift] = useState<Date>();
  const [startHour, setStartHour] = useState<number>(0);
  const [endHour, setEndHour] = useState<number>(0);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = "Create shift";
  const description = "Add a new shift";
  const toastMessage = "Shift created.";
  const action = "Create";

  const onSubmit = async () => {
    if (startHour < 100) {
      return toast.error("Start time should be after 100.");
    }
    if (endHour < 100) {
      return toast.error("End time should be after 100.");
    }
    if (startHour >= endHour) {
      return toast.error("Start time should be before end time.");
    }
    if (!employeeId) {
      return toast.error("Employee is required.");
    }
    if (!startShift) {
      return toast.error("Start date is required.");
    }
    if (!endShift) {
      return toast.error("End date is required.");
    }
    if (startShift > endShift) {
      return toast.error("Start date should be before end date.");
    }
    const shiftDateAndTime = [];
    if (startShift && endShift) {
      const currentStartDate = new Date(startShift);
      const currentEndDate = new Date(startShift);
      const countingDate = new Date(startShift);
      currentStartDate.setHours(startHour / 100, startHour % 100);
      currentEndDate.setHours(endHour / 100, endHour % 100);

      while (countingDate <= endShift) {
        shiftDateAndTime.push({
          startDateAndTime: new Date(currentStartDate),
          endDateAndTime: new Date(currentEndDate),
        });
        currentStartDate.setDate(currentStartDate.getDate() + 1);
        currentEndDate.setDate(currentEndDate.getDate() + 1);
        countingDate.setDate(countingDate.getDate() + 1);
      }
    }
    const data = {
      employeeId,
      shiftDateAndTime,
    };
    try {
      setLoading(true);
      await axios.post(`/api/${params.storeId}/shifts/`, data);
      router.refresh();
      router.push(`/${params.storeId}/shifts`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  // const onDelete = async () => {
  //   try {
  //     setLoading(true);
  //     await axios.delete(`/api/${params.storeId}/shifts/${params.shiftId}`);
  //     // router.refresh();
  //     // router.push(`/${params.storeId}/shifts`);
  //     // toast.success("Shift deleted.");
  //   } catch (error: any) {
  //     toast.error(
  //       "Make sure you removed all bookings before deleting the shift."
  //     );
  //   } finally {
  //     setLoading(false);
  //     setOpen(false);
  //   }
  // };

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      {/* EMPLOYEE ID */}
      <div className="md:grid py-10 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2 my-3 md:my-0">
          <label className="text-md font-light">Employees</label>
          <Select onValueChange={(value) => setEmployeeId(value)}>
            <SelectTrigger className="w-full text-slate-500">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.fName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* START DATE */}
        <div className="flex flex-col gap-2 my-3 md:my-0">
          <label className="text-md font-light">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startShift && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startShift ? (
                  format(startShift, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                
                selected={startShift}
                onSelect={setStartShift}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* END DATE */}
        <div className="flex flex-col gap-2 my-3 md:my-0">
          <label className="text-md font-light">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endShift && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endShift ? format(endShift, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endShift}
                onSelect={setEndShift}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* START HOUR */}
        <div className="flex flex-col gap-2 my-3 md:my-0">
          <label className="text-md font-light">Start Shift Time</label>
          <Input
            type="number"
            step={100}
            min={0}
            max={2300}
            onChange={(e) => setStartHour(Number(e.target.value))}
          />
        </div>
        {/* END HOUR */}
        <div className="flex flex-col gap-2 my-3 md:my-0">
          <label className="text-md font-light">End Shift Time</label>
          <Input
            type="number"
            step={100}
            min={0}
            max={2300}
            onChange={(e) => setEndHour(Number(e.target.value))}
          />
        </div>
      </div>

      <Separator />
      <div className="flex justify-end">
        <Button onClick={onSubmit} disabled={loading}>
          {action}
        </Button>
      </div>
    </>
  );
};
