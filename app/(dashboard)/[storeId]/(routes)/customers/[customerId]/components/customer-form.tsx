"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Customer } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
  custFName: z.string().nonempty(),
  custLName: z.string().nonempty(),
  email: z.string().email(),
  phone: z.string().min(10),
});

type CustomerFormValues = z.infer<typeof formSchema>;

interface CustomerFormProps {
  initialData: Customer | null;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");

  const title = initialData ? "Edit customer" : "Create customer";
  const description = initialData ? "Edit a customer." : "Add a new customer";
  const toastMessage = initialData ? "Customer updated." : "Customer created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      custFName: "",
      custLName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    console.log("DATA", data);
    if (data.email !== confirmEmail) {
      toast.error("Emails do not match.");
      return;
    }
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/customers/${params.customerId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/customers`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/customers`);
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
      await axios.delete(
        `/api/${params.storeId}/customers/${params.customerId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/customers`);
      toast.success("Customer deleted.");
    } catch (error: any) {
      toast.error(
        "Make sure you removed all categories using this customer first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

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
      {/* CUST FIRST NAME */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="custFName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer&apos;s First Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="First name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* CUST LAST NAME */}
            <FormField
              control={form.control}
              name="custLName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer&apos;s Last Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Last name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* EMAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer&apos;s Email</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*  CONFIRM EMAIL */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Confirm Customer Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Confirm email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
            </div>

            {/* PHONE NUMBER */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer&apos;s Phone Number</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Phone" {...field} />
                  </FormControl>
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
