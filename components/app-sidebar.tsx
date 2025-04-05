"use client"

import * as React from "react"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Calendar,
    CalendarDays,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Plus,
    Search,
    Settings2,
    SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"

import { NavUser } from "@/components/nav-user"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarRail,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
} from "@/components/ui/sidebar"
import Link from "next/link"

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Today",
            url: "/today",
            icon: Calendar,
        },
        {
            title: "Upcoming",
            url: "/upcoming",
            icon: CalendarDays,
        },
        {
            title: "Calendar",
            url: "/calendar",
            icon: Calendar,
        },

    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <NavUser user={data.user} />
            </SidebarHeader>
            <SidebarContent >
                <SidebarGroup>
                    <SidebarMenu >
                        <SidebarMenuButton onClick={() => {
                            console.log("add task")
                        }}>
                            <Plus />
                            Add Task

                        </SidebarMenuButton>
                        <SidebarMenuButton onClick={() => {
                            console.log("search")
                        }}>
                            <Search />
                            Search
                        </SidebarMenuButton>
                    </SidebarMenu>
                    <NavMain items={data.navMain} />
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <p className="text-xs text-center text-muted-foreground">2025 taskwoy. All rights reserved.</p>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
