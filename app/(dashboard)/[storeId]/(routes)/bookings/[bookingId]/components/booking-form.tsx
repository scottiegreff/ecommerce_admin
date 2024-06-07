"use client";

import { useState, useEffect, use } from "react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { CalendarIcon } from "lucide-react";
import { SearchIcon } from "lucide-react";
import { Search } from "lucide-react";
import { CheckIcon } from "lucide-react";
import { format, set } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Booking, Employee, Service, Shift, Customer } from "@/types";
import React from "react";

interface BookingFormProps {
  data: Customer[];
}

const BookingForm: React.FC<BookingFormProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service>();
  const [serviceId, setServiceId] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(data);
  const [customerId, setCustomerId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [services, setServices] = useState<Service[]>();
  const [serviceDuration, setServiceDuration] = useState<number>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shift, setShift] = useState<Shift>();
  const [date, setDate] = useState<Date>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  let [bookingHours, setBookingHours] = useState<Date[] | undefined>([]);
  const [shiftStart, setShiftStart] = useState<Date>();
  const [shiftEnd, setShiftEnd] = useState<Date>();
  const [bookingTimes, setBookingTimes] = useState<Date[]>();
  const [startTime, setStartTime] = useState<Number>();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const [loading, setLoading] = useState(false);

  const bookingToastMessage = "Booking created.";
  const bookingAction = "Book Appointment";

  const onSubmit = async () => {
    const data = {
      serviceId: serviceId,
      date: date,
      startTime: startTime,
      employeeId: employeeId,
      customerId: customerId,
      shiftId: shift?.id,
      email: customerEmail,
    };
    console.log("DATA: ", data);
    try {
      setLoading(true);
      const response = await fetch(
        `/api/${params.storeId}/bookings`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json(); // Access the response data
      router.refresh();
      toast.success(bookingToastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Depending where the app is deployed the timeZone may need to be changed.
  function formatUTCtoLocalDate(date: Date) {
    return new Date(
      date.toLocaleString("en-US", { timeZone: "America/Vancouver" })
    );
  }

  // Function called from the date disabled attribute to check if the date is the same as the employeeId.
  // If the date is the same as the employeeId then the date is NOT disabled.
  function isDateSameAsEmployeeId(date: Date, shifts: Shift[]) {
    // console.log("SHIFT.DATE: ", typeof(shifts[2]?.date), "- DATE: ", typeof(date));
    return shifts?.some((shift) => {
      return shift.date.toString() == date.toString();
    });
  }

  useEffect(() => {
    // Fetch employees and services from the API
    const employees = async () => {
      try {
        const response = await fetch(`/api/${params.storeId}/employeesStore`);
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("There was an error!", error);
      }
    };
    const services = async () => {
      try {
        const response = await fetch(`/api/${params.storeId}/services`);
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("There was an error!", error);
      }
    };
    services();
    employees();
  }, []);

  useEffect(() => {
    // Fetch all shifts of employeeId from the API, and returns the shifts from today onwards, then setShifts.
    if (employeeId && customerId && serviceId) {
      const shifts = async () => {
        try {
          const response = await fetch(`/api/${params.storeId}/shiftsStore`, {
            method: "POST",
            body: JSON.stringify({ employeeId: employeeId }),
          });
          const data = await response.json();
          data.forEach((item: any) => {
            item.date = formatUTCtoLocalDate(item.date);
          });
          setShifts(data);
        } catch (error) {
          console.error("There was an error!", error);
        }
      };
      shifts();
    }
  }, [employeeId]);

  useEffect(() => {
    // Fetch the existing bookings for the selected date/shift of employeeId.
    if (employeeId && date && shift) {
      const shifts = async () => {
        try {
          const response = await fetch(
            `/api/${params.storeId}/bookingsStoreGet`,
            {
              method: "POST",
              body: JSON.stringify({
                shiftId: shift.id,
                employeeId: employeeId,
              }),
            }
          );
          const data = await response.json();
          data.forEach((item: any) => {
            item.date = new Date(
              date.toLocaleString("en-US", { timeZone: "America/Vancouver" })
            );
          });
          setBookings(data);

          const shiftStart = new Date(shift.date);
          shiftStart.setHours(
            Math.floor(shift.startTime / 100),
            shift.startTime % 100
          );
          setShiftStart(shiftStart);

          const shiftEnd = new Date(shift.date);
          shiftEnd.setHours(
            Math.floor(shift.endTime / 100),
            shift.endTime % 100
          );
          setShiftEnd(shiftEnd);
          let bookingTimes: Date[] = data.map((item: any) => {
            let date = new Date(item.date);
            date.setHours(
              Math.floor(item.startTime / 100),
              item.startTime % 100
            );
            return date;
          });

          setBookingTimes(bookingTimes);
          setBookingHours(
            getAvailableBookingTimes(shiftStart, shiftEnd, bookingTimes)
          );
        } catch (error) {
          console.error("There was an error!", error);
        }
      };
      shifts();
    }
  }, [date]);

  // Creates an array of available booking times based on the shift start and end times,
  //  and the existing bookings of the selected date/shift.
  //  The interval can be changed by changing the interval variable.
  function getAvailableBookingTimes(
    shiftStart: Date,
    shiftEnd: Date,
    bookedTimes: Date[]
  ): Date[] {
    const availableTimes: Date[] = [];
    const interval = 15 * 60 * 1000; // 15 minutes in milliseconds
    let appointmentDuration = service?.duration;
    if (!appointmentDuration) {
      return [];
    }
    appointmentDuration = appointmentDuration * 60 * 1000;
    for (
      let time = new Date(shiftStart.getTime());
      time.getTime() + appointmentDuration <= shiftEnd.getTime();
      time.setTime(time.getTime() + interval)
    ) {
      const appointmentEnd = new Date(time.getTime() + appointmentDuration);

      const isBooked = bookedTimes.some((bookedTime) => {
        const bookedEnd = new Date(bookedTime.getTime() + appointmentDuration);
        return time < bookedEnd && appointmentEnd > bookedTime;
      });

      if (!isBooked) {
        availableTimes.push(new Date(time.getTime()));
      }
    }
    return availableTimes;
  }

  // Formats the time to a 24 hour format.
  function formatTime(dateString: string): number {
    const date: Date = new Date(dateString);
    let hours: number = date.getHours();
    let minutes: number = date.getMinutes();
    const formattedTime: string = `${hours}${
      minutes < 10 ? "0" : ""
    }${minutes}`;

    return parseInt(formattedTime, 10);
  }
  return (
    <>
      <div>
        <h2 className="mb-10 text-2xl text-center font-bold text-gray-800">
          Book
        </h2>
        <div className="md:grid md:grid-cols-2 gap-8">
          {/* SERVICE */}
          <div className="flex flex-col gap-2 my-3 md:my-0">
            <label className="text-md font-light">Service</label>
            <Select
              onValueChange={(value) => {
                const selectedService = services?.find(
                  (service) => service.id === value
                );
                setServiceId(value);
                setService(selectedService);
              }}
            >
              <SelectTrigger className="text-muted-foreground font-normal">
                <SelectValue placeholder="Select a staff" />
              </SelectTrigger>

              <SelectContent className="w-full bg-white">
                {services?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* CUSTOMER */}
          <div className="flex flex-col gap-2 my-3 md:my-0">
            <label className="text-md font-light">Book Customer</label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between text-muted-foreground font-normal"
                >
                  {value
                    ? customers.find((item) => item.email === value)?.email
                    : "Select a customer"}
                  <CheckIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search for customer"
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No customer found.</CommandEmpty>
                    <CommandGroup>
                      {customers.map((item) => (
                        <CommandItem
                          key={item.id}
                          value={item.email}
                          disabled={loading || !serviceId}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setCustomerId(item.id);
                            setCustomerEmail(item.email);
                            setOpen(false);
                          }}
                        >
                          {item.email} - {item.custFName} {item.custLName}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              value === item.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* EMPLOYEE ID */}
          <div className="flex flex-col gap-2 my-3 md:my-0">
            <label className="text-md font-light">Book Staff</label>
            <Select onValueChange={(value) => setEmployeeId(value)}>
              <SelectTrigger className="text-muted-foreground font-normal">
                <SelectValue placeholder="Select a staff" />
              </SelectTrigger>

              <SelectContent className="w-full bg-white">
                {employees?.map((item) => (
                  <SelectItem
                    key={item.id}
                    value={item.id}
                    disabled={loading || !serviceId || !customerId}
                    onSelect={() => {
                      if (item.id) {
                        setEmployeeId(item.id);
                      }
                    }}
                  >
                    {item.fName} {item.lName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* DATE PICKER */}
          <div className="flex flex-col gap-2 my-3 md:my-0">
            <label className="text-md font-light">Booking Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white h-[325px]"
                align="start"
              >
                <Calendar
                  className="overflow-hidden font-bold"
                  mode="single"
                  selected={date}
                  onSelect={(value) => {
                    setDate(value);
                    shifts.forEach((item) => {
                      if (item.date.toString() === value?.toString()) {
                        setShift(item);
                      }
                    });
                  }}
                  disabled={(date) => {
                    const currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    const maxDate = new Date();
                    maxDate.setDate(currentDate.getDate() + 60);
                    return (
                      employeeId == undefined ||
                      date < currentDate ||
                      date >= maxDate ||
                      !isDateSameAsEmployeeId(date, shifts || [])
                    );
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* START TIME */}
          <div className="flex flex-col gap-2 my-3 md:my-0">
            <label className="text-md font-light">Booking Time</label>
            <Select
              defaultValue={startTime?.toString()}
              onValueChange={(value) => {
                setStartTime(formatTime(value));
              }}
            >
              <SelectTrigger className="text-muted-foreground font-normal">
                <SelectValue placeholder="Pick an available time" />
              </SelectTrigger>
              <SelectContent className="w-[20vw] bg-white mt-1 block pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-md max-h-100 overflow-y-auto">
                {bookingHours?.map((time) => (
                  <SelectItem
                    key={time.toString()}
                    value={time.toString()}
                    disabled={loading || !employeeId || !date || !shift}
                  >
                    {format(time, "p")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Button
            onClick={onSubmit}
            disabled={loading || !employeeId || !date || !shift || !startTime}
            className="py-6 mt-10 w-full md:w-[25vw] md:text-lg text-white bg-slate-700 shadow-lg"
          >
            {bookingAction}
          </Button>
        </div>
      </div>
    </>
  );
};

export default BookingForm;

{
  /* <FormField
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
/> */
}
