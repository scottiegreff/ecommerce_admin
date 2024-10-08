"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/heros`,
      label: "Hero",
      active: pathname === `/${params.storeId}/heros`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}`,
      label: "|",
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: "Colors",
      active: pathname === `/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}`,
      label: "|",
    },
    {
      href: `/${params.storeId}/services`,
      label: "Services",
      active: pathname === `/${params.storeId}/service`,
    },
    {
      href: `/${params.storeId}/customers`,
      label: "Customers",
      active: pathname === `/${params.storeId}/customers`,
    },
    {
      href: `/${params.storeId}/bookings`,
      label: "Bookings",
      active: pathname === `/${params.storeId}/bookings`,
    },
    {
      href: `/${params.storeId}`,
      label: "|",
    },
    {
      href: `/${params.storeId}/positions`,
      label: "Positions",
      active: pathname === `/${params.storeId}/positions`,
    },
  
    {
      href: `/${params.storeId}/employees`,
      label: "Employees",
      active: pathname === `/${params.storeId}/employees`,
    },
    {
      href: `/${params.storeId}/shifts`,
      label: "Shifts",
      active: pathname === `/${params.storeId}/shifts`,
    },

    {
      href: `/${params.storeId}`,
      label: "|",
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/cart`,
      label: "Cart",
      active: pathname === `/${params.storeId}/cart`,
    },
    {
      href: `/${params.storeId}/analytics`,
      label: "Analytics",
      active: pathname === `/${params.storeId}/analytics`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm flex flex-wrap font-medium transition-colors pb-2 hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
