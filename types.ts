export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
}
export interface Booking {
  id: string;
  startOfBooking: Date;
  endOfBooking: Date;
  serviceId: string;
}
export interface BookingStartAndEnd {
  startOfBooking: string;
  endOfBooking: string;
}
export interface Category {
  id: string;
  name: string;
  itemType: "GOODS" | "SERVICES";
  billboard: Billboard;
}
export interface Color {
  id: string;
  name: string;
  value: string;
}
export interface Customer {
  id: string;
  custFName: string;
  custLName: string;
  email: string;
  phone: string;
}
export interface Employee {
  id: string;
  fName: string;
  lName: string;
}
export interface Hero {
  id: string;
  label: string;
  imageUrl: string;
  logoUrl: string;
}
export interface Image {
  id: string;
  url: string;
}
export interface Product {
  id: string;
  category: Category;
  name: string;
  price: string;
  isFeatured: boolean;
  size: Size;
  color: Color;
  images: Image[];
}
export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: string;
  isFeatured: boolean;
  duration: number;
  images: Image[];  
}

export interface Size {
  id: string;
  name: string;
  value: string;
}
export interface Shift {
  id: string;
  employeeId: string;
  startShift: Date;
  endShift: Date;
}


