"use client";

import * as z from "zod";
import axios from "axios";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Booking, Shift, Service, Employee, Customer } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import Link from "next/link";
import { addDays, format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SearchIcon, CheckIcon, Trash } from "lucide-react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
  customerId: z.string(),
  date: z.coerce.date(),
  shiftId: z.string(),
  serviceId: z.string(),
  startTime: z.coerce.number().min(1),

});

type BookingFormValues = z.infer<typeof formSchema>;

interface BookingFormProps {
  initialData: Booking | null | undefined;
  customers: Customer[] | null;
  services: Service[] | null;
  employees: Employee[] | null;
  shifts: Shift[] | null;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialData,
  customers,
  services,
  employees,
  shifts,
}) => {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId;
  const [storeData, setStoreData] = useState(null);
  const [customerId2, setCustomerId2] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [employeeId, setEmployeeId] = useState<string>();
  const [serviceDuration, setServiceDuration] = useState<number>();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit booking" : "Create booking";
  const description = initialData
    ? "Edit booking hours on"
    : "Add a new booking";
  const toastMessage = initialData ? "Booking updated." : "Booking created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: initialData?.customerId ?? undefined,
      date: initialData?.date,

      serviceId: initialData?.serviceId,
      startTime: initialData?.startTime,

    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    console.log("DATA: ", data);

    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/bookings/${params.bookingId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/bookings/`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/bookings`);
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
      await axios.delete(`/api/${params.storeId}/bookings/${params.bookingId}`);
      router.refresh();
      router.push(`/${params.storeId}/bookings`);
      toast.success("Booking deleted.");
    } catch (error: any) {
      toast.error("Did not delete booking");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    console.log("DATE: ", date);
    console.log("EMPLOYEE: ", employeeId);
    console.log("CUSTOMER: ", customerId2);
    console.log("DURATION: ", serviceDuration);
  }, [
    customerId2,
    setCustomerId2,
    serviceDuration,
    serviceDuration,
    date,
    setDate,
    employeeId,
    setEmployeeId,
  ]);
  // const customerId = form.watch("customerId");
  // console.log("CUSTOMER: ", customers);
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem className="flex flex-col py-3">
                  <FormLabel>Customer</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground w-full"
                          )}
                        >
                          {field.value
                            ? customers?.find(
                                (customer) => customer.id === field.value
                              )?.email
                            : "Select customer"}
                          <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[30vw] p-2">
                      <Command>
                        <CommandInput
                          placeholder="Search customers..."
                          className="h-9"
                        />
                        <CommandEmpty>No customer found.</CommandEmpty>
                        <CommandGroup>
                          {customers?.map((customer) => (
                            <CommandItem
                              value={customer.email}
                              key={customer.email}
                              className="items-center"
                              onSelect={() => {
                                form.setValue("customerId", customer.id);
                                setCustomerId2(customer.id);
                              }}
                            >
                              {customer.email}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  customer.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <Label>Select Customer</Label>
              <Select
                onValueChange={(value) => {
                  setCustomerId(value);
                }}
              >
                <SelectTrigger className=" text-slate-500">
                  <SelectValue placeholder="Customers" />
                </SelectTrigger>
                <SelectContent>
                  {customers?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.custFName} {item.custLName} - {item.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}

            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selectedService = services?.find(
                        (service) => service.id === value
                      );
                      if (selectedService) {
                        setServiceDuration(selectedService.duration);
                      }
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          className="text-black"
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} - ${item.price} / {item.duration}min
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-5">
              <Label>Select Employee</Label>
              <Select onValueChange={(value) => setEmployeeId(value)}>
                <SelectTrigger className="text-slate-500">
                  <SelectValue placeholder="Employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees?.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={item.id}
                      disabled={loading || !customerId2 || !serviceDuration}
                    >
                      {item.fName} {item.lName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-5">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) =>
                      date < new Date() ||
                      date > addDays(new Date(), 30) ||
                      loading ||
                      !customerId2 ||
                      !serviceDuration
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Start Time" />
                      </SelectTrigger>
                    </FormControl>
                    {/* <SelectContent>
                      {shifts?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.startTime} - {item.endTime}
                        </SelectItem>
                      ))}
                    </SelectContent> */}
                  </Select>
                  {/* <FormDescription>
                    You can manage email addresses in your{" "}
                    <Link href="/examples/forms">email settings</Link>.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
