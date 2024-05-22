"use client";

import * as z from "zod";
import axios from "axios";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Shift, Store } from "@prisma/client";
import { Employee } from "../page";
import { useParams, useRouter } from "next/navigation";

import Link from "next/link";
import { addDays, format } from "date-fns";
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

const formSchema = z.object({
  employeeId: z.string(),
  shiftId: z.string().optional(),
  storeId: z.string().nonempty(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  startTime: z.coerce.number().min(1),
  endTime: z.coerce.number().min(1),
});

type ShiftFormValues = z.infer<typeof formSchema>;

interface ShiftFormProps {
  initialData: Shift | null;
  employees: Employee[] | null;
}

export const ShiftForm: React.FC<ShiftFormProps> = ({
  initialData,
  employees,
}) => {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId;
  const [storeData, setStoreData] = useState(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit shift" : "Create shift";
  const description = initialData ? "Edit shift hours on" : "Add a new shift";
  const toastMessage = initialData ? "Shift updated." : "Shift created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      employeeId: "",
      storeId: params.storeId,
      from: new Date(),
      to: addDays(new Date(), 1),
      startTime: 900,
      endTime: 1600,
    },
  });

  const onSubmit = async (data: ShiftFormValues) => {
    console.log("DATA: ", data);
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/shifts/${params.shiftId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/shifts/`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/shifts`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/shifts/${params.shiftId}`);
      router.refresh();
      router.push(`/${params.storeId}/shifts`);
      toast.success("Shift deleted.");
    } catch (error: any) {
      toast.error(
        "Make sure you removed all bookings before deleting the shift."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {initialData ? (
        <>
          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
          />
          <div className="">
            <div className="flex items-center justify-between">
              <Heading title={title} description={`${description} on ${format(new Date(initialData.date), "PPP")}`} />
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full"
              >
          
                <div className="md:grid md:grid-cols-2 gap-8 py-10">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step={100}
                            // min={storeData?.openTime}
                            // max={storeData?.closeTime}
                            disabled={loading}
                            placeholder={String(initialData?.startTime)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step={100}
                            // min={storeData?.openTime}
                            // max={storeData?.closeTime}
                            disabled={loading}
                            placeholder={String(initialData?.endTime)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="py-5 flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {action}
                  </Button>
                </div>
              </form>
            </Form>
            <Separator />
          </div>
        </>
      ) : (
        <>
          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
          />

          <div className="flex items-center justify-between">
            <Heading title={title} description={description} />
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <div className="md:grid md:grid-cols-2 gap-8 py-10">
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Name</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-muted-foreground">
                            <SelectValue placeholder="Select Employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees?.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {`${employee.fName} ${employee.lName}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>START of Shift Dates</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a start date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={loading}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>END of Shift Dates</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick an end date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={loading}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step={100}
                          // min={storeData?.openTime}
                          // max={storeData?.closeTime}
                          disabled={loading}
                          placeholder="000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step={100}
                          // min={storeData?.openTime}
                          // max={storeData?.closeTime}
                          disabled={loading}
                          placeholder="000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="py-5 flex justify-end">
                <Button type="submit" disabled={loading}>
                  {action}
                </Button>
              </div>
            </form>
          </Form>
          <Separator />
        </>
      )}
    </>
  );
};
