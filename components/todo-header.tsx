"use client"

import { ModeToggle } from "./mode-toggle";

import { SidebarTrigger } from "./ui/sidebar";

import { Button } from "./ui/button";
import { Settings2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function TodoHeader() {
    const pathname = usePathname();
    return (
        <header className=" justify-between pr-4 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <h1 className="text-xl font-bold capitalize ">{pathname.split("/").pop()}</h1>
            </div>
            <div className="flex items-center gap-2">
                {/* TODO: GROUP BY and SORT BY */}
            </div>
        </header>
    );
}