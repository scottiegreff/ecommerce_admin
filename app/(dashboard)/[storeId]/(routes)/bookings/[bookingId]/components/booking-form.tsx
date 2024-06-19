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
import { Booking, Employee, Service, Shift, Customer, BookingStartAndEnd } from "@/types";
import React from "react";

interface BookingFormProps {
  services: Service[];
  customers: Customer[];
  employees: Employee[];
}

const BookingForm: React.FC<BookingFormProps> = ( { services, customers, employees }, ) => {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service>();
  const [serviceId, setServiceId] = useState("");
  // const [customers, setCustomers] = useState<Customer[]>(data);
  const [customerId, setCustomerId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  // const [services, setServices] = useState<Service[]>();
  const [serviceDuration, setServiceDuration] = useState<number>();
  // const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shift, setShift] = useState<Shift>();
  const [date, setDate] = useState<Date>();
  let [bookingHours, setBookingHours] = useState<Date[] | undefined>([]);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [bookingStartDateAndTime, setBookingStartDateAndTime] =
  useState<String>();

  const [loading, setLoading] = useState(false);

  const toastMessage = "Booking created.";
  const action = "Book Appointment";

  const onSubmit = async () => {
    if (!employeeId) {
      toast.error("Please select a staff member.");
      return;
    }
    if (!date) {
      toast.error("Please select a date.");
      return;
    }
    if (!bookingStartDateAndTime) {
      toast.error("Please select a time.");
      return;
    }
    const startOfBooking = new Date(bookingStartDateAndTime as string); // Convert bookingStartDateAndTime to a string before assigning it to start
    const endOfBooking = new Date(
      startOfBooking.getTime() + (service?.duration ?? 0) * 60000
    );
    const data = {
      serviceId: serviceId,
      startOfBooking: startOfBooking,
      endOfBooking: endOfBooking,
      employeeId: employeeId,
      customerId: customerId,
      shiftId: shift?.id,
      email: customerEmail,
    };
    // console.log("DATA: ", data);
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
      // console.log("RESPONSE DATA: ", responseData);
      router.refresh();
      toast.success(toastMessage);
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
    // console.log("SHIFT.START SHIFT: ", shifts[0].startShift, "- DATE: ", date);
    return shifts?.some((shift) => {
      let temp = new Date(shift.startShift);
      temp.setHours(0, 0, 0, 0);
      return temp.toString() == date.toString();
    });
  }
  useEffect(() => {
    console.log("UE: 1")
    // Fetch all shifts of employeeId from the API, and returns the shifts from today onwards, then setShifts.
    if (service && employeeId) {
      const shifts = async () => {
        try {
          const response = await fetch(
            `/api/${params.storeId}/shiftsStore`,
            {
              method: "POST",
              body: JSON.stringify({ employeeId: employeeId }),
            }
          );
          const data: Shift[] = await response.json();

          data.forEach((item: Shift) => {
            item.startShift = formatUTCtoLocalDate(item.startShift);
            item.endShift = formatUTCtoLocalDate(item.endShift);
          });
          setShifts(data);
        } catch (error) {
          console.error("There was an error!", error);
        }
      };
      shifts();
    }
  }, [service,customerId, employeeId]);

  useEffect(() => {
    console.log("UE: 2")
    // this useEffect is used to gather data needed for the availableSlots function,
    //  ultimately used for selecting the time of the booking
    // get the shift the user selected, and setShift
    if (service && employeeId && date) {
      const shift = shifts.find((item) => {
        let startShift = new Date(item.startShift);
        startShift.setHours(0, 0, 0, 0);
        return startShift.toString() == date.toString();
      });
      setShift(shift);

      // set the shift start and end times
      let startShift = "";
      let endShift = "";
      if (shift) {
        startShift = shift.startShift.toString();
        endShift = shift.endShift.toString();
      }

      const bookings = async () => {
        try {
          const response = await fetch(
            `/api/${params.storeId}/bookingsStoreGet`,
            {
              method: "POST",
              body: JSON.stringify({
                shiftId: shift?.id,
                employeeId: employeeId,
              }),
            }
          );
          const data = await response.json();
          const startAndEndOfBookings: BookingStartAndEnd[] = data.map(
            (item: any) => {
              let startOfBooking = new Date(item.startOfBooking).toString();
              let endOfBooking = new Date(item.endOfBooking).toString();
              return { startOfBooking, endOfBooking };
            }
          );

          if (service?.duration == undefined) {
            return;
          }
          const availableSlots = getAvailableTimeSlots(
            startShift,
            endShift,
            startAndEndOfBookings,
            service?.duration
          );
          setBookingHours(availableSlots);
        } catch (error) {
          console.error("There was an error!", error);
        }
      };
      bookings();
    }
  }, [service, customerId, employeeId, date]);

  // Creates an array of available booking times based on the shift start and end times,
  //  and the existing bookings of the selected date/shift.
  //  The interval can be changed by changing the interval variable.
  function getAvailableTimeSlots(
    startTime: string,
    endTime: string,
    bookings: BookingStartAndEnd[],
    serviceDuration: number
  ): Date[] {
    const shiftStart = new Date(startTime);
    const shiftEnd = new Date(endTime);

    // Convert booking times to Date objects
    const parsedBookings = bookings.map((booking) => ({
      startOfBooking: new Date(booking.startOfBooking),
      endOfBooking: new Date(booking.endOfBooking),
    }));

    // Helper function to add minutes to a date
    function addMinutes(date: Date, minutes: number): Date {
      return new Date(date.getTime() + minutes * 60000);
    }

    // Helper function to check if a time slot overlaps with existing bookings
    function isOverlapping(start: Date, end: Date): boolean {
      return parsedBookings.some(
        (booking) =>
          (start < booking.endOfBooking && end > booking.startOfBooking) ||
          (start < booking.startOfBooking &&
            end > addMinutes(booking.startOfBooking, +serviceDuration))
      );
    }

    // Generate 15-minute intervals
    let availableSlots: Date[] = [];
    for (
      let currentTime = shiftStart;
      addMinutes(currentTime, serviceDuration) <= shiftEnd;
      currentTime = addMinutes(currentTime, 15)
    ) {
      const slotEnd = addMinutes(currentTime, serviceDuration);
      if (!isOverlapping(currentTime, slotEnd) && slotEnd <= shiftEnd) {
        availableSlots.push(new Date(currentTime));
      }
    }
    return availableSlots;
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
              // defaultValue={startTime?.toString()}
              onValueChange={(value) => {
                setBookingStartDateAndTime(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pick an available time" />
              </SelectTrigger>
              <SelectContent className="w-[20vw] bg-white mt-1 block pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-md">
                {bookingHours?.map((time) => (
                  <SelectItem
                    key={time.toString()}
                    value={time.toString()}
                    disabled={loading || !employeeId || !date}
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
            disabled={loading}
            className="py-6 mt-10 w-full md:w-[25vw] md:text-lg text-white bg-slate-700 shadow-lg"
          >
            {action}
          </Button>
        </div>
      </div>
    </>
  );
};

export default BookingForm;