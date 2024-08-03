"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Copy, CreditCard, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import useCart from "@/hooks/use-cart";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modals/alert-modal";

import { BookingColumn } from "./columns";
import { Service } from "@/types";

interface CellActionProps {
  data: BookingColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartItem, setCartItem] = useState<Service>();

  const onConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/bookings/${data?.bookingId}`);
      toast.success("Booking deleted.");
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while deleting the booking");
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Booking ID copied to clipboard.");
  };

  const onPayNow = (id: string) => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/${params.storeId}/bookings/${id}`);
        const booking = res.data;
        booking.service.map((item: Service) => {
          cart.addItem(item);
        });
        router.push(`/${params.storeId}/cart`);
        router.refresh();
      } catch (error) {
      } finally {
        setOpen(false);
        setLoading(false);
      }
    };
    fetchBooking();
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onPayNow(data?.bookingId)}>
            <CreditCard className="mr-2 h-4 w-4" /> ADD TO CART
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(data?.bookingId)}>
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
