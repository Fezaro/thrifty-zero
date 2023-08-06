"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {

    const pathname = usePathname();
    const params = useParams();
    const routes =[
        {
            href: `/${params.userId}`,
            label: 'Overview',
            active: pathname === `/${params.userId}`,
          },
          {
            href: `/${params.userId}/seller`,
            label: "Seller",
            active: pathname === `/${params.userId}/seller`,
        },
        {
            href: `/${params.userId}/settings`,
            label: "Settings",
            active: pathname === `/${params.userId}/settings`,
        },
        {
            href: `/${params.userId}/listings`,
            label: "Listings",
            active: pathname === `/${params.userId}/listings`,
        },
    ];

    return(
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            {routes.map((route) => (
                <Link href={route.href} key={route.href}
                className={cn('text-sm font-medium transition-colors hover:text-primary',
                route.active ? 'text-black dark:text-white' : 'text-muted-foreground')}
                >
                    {route.label}
                </Link>
            
            ))}
        </nav>
)
}