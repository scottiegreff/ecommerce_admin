import { Booking } from "@/types";
import qs from "query-string";

const URL="api/bookings";

interface Query {
  shiftId?: string;
  employeeId?: string;
}

const getBookings = async (query: Query): Promise<Booking[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: { 
      shiftId: query.shiftId,
      employeeId: query.employeeId,
    },
  });

  const res = await fetch(url);

  return res.json();
};

export default getBookings;
