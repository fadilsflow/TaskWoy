"use client"

import { ModeToggle } from "./mode-toggle";

import { SidebarTrigger } from "./ui/sidebar";

import { Button } from "./ui/button";
import { Settings2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    return (
        <header className="border-b justify-between pr-4 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <h1 className="text-xl font-bold capitalize ">{pathname.split("/").pop()}</h1>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost">
                    View <Settings2 />
                </Button>
                <ModeToggle />

            </div>
        </header>
    );
}