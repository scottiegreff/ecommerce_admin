"use client";

import * as z from "zod";
import axios from "axios";
import { FormEventHandler, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Employee, Position, Shift } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

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
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  fName: z.string().min(1),
  lName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  positionId: z.string().min(1),
  color: z
    .string({
      required_error: "Please select an email to display.",
    })
    .min(7)
    .max(7),
  isActive: z.boolean().default(true),
});

type EmployeeFormValues = z.infer<typeof formSchema>;

interface EmployeeFormProps {
  initialData: Employee | null;
  positions: Position[];
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  positions,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const colorArr = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080", // Purple
    "#008000", // Dark Green
    "#008080", // Teal
    "#FFC0CB", // Pink
    "#800000", // Maroon
    "#008B8B", // Dark Cyan
    "#808000", // Olive
    "#4B0082", // Indigo
    "#8B4513", // Saddle Brown
    "#2E8B57", // Sea Green
    "#000080", // Navy
  ];

  const title = initialData ? "Edit Staff" : "Create Staff";
  const description = initialData
    ? `Edit ${initialData.fName}'s Personal Information.`
    : "Add a new staff";
  const toastMessage = initialData ? "Staff updated." : "Staff created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      fName: "",
      lName: "",
      phone: "",
      email: "",
      positionId: "",
      color: "#D2A0A0",
      isActive: true,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/employees/${params.employeeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/employees`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/employees`);
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
        `/api/${params.storeId}/employees/${params.employeeId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/employees`);
      toast.success("Employee deleted.");
    } catch (error: any) {
      toast.error("Something went wrong.");
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
      {/* FORM */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <Separator />
          <div className="md:grid md:grid-cols-2 gap-8 py-10">
            {/* FIRST NAME */}
            <FormField
              control={form.control}
              name="fName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Employee First name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* LAST NAME */}
            <FormField
              control={form.control}
              name="lName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Employee Last name"
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Employee email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* PHONE */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Employee phone"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* POSITION */}
            <FormField
              control={form.control}
              name="positionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee Title</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Title" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                      {positions.map((position) => (
                        <SelectItem
                          className="w-full"
                          key={position.id}
                          value={position.id}
                          disabled={loading}
                          placeholder="Title"
                        >
                          <div className="flex gap-3 items-center">
                            <p>{position.title}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Pick a color for employee to display on the schedule
                    calendar.{" "}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* COLOR */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                      {colorArr.map((color) => (
                        <SelectItem
                          className="w-full"
                          key={color}
                          value={color}
                          disabled={loading}
                          placeholder="Color"
                        >
                          <div className="flex gap-3 items-center">
                            <div
                              className="border rounded-full h-6 w-6"
                              style={{ backgroundColor: color }}
                            ></div>
                            <p>{color}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Pick a color for employee to display on the schedule
                    calendar.{" "}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ACTIVE */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      defaultChecked={true}
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Currently Active</FormLabel>
                    <FormDescription>
                      If the employee is currently working.{" "}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
