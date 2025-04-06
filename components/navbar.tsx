import React from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { Github, Layers } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"

export function Navbar() {
    return (
        <div className="w-full px-5  lg:px-10  bg-card border-b">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 flex">
                    <Link className="mr-6 flex items-center space-x-2" href="/">
                        <Layers className="w-4 h-4" />
                        <h1 className="text-xl font-bold">
                            TaskCoyy
                        </h1>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <div className="flex items-center space-x-2">
                        <Link href="https://github.com/taskcoyy">
                            <Button variant="ghost" size="icon">
                                <Github className="w-4 h-4" />
                            </Button>
                        </Link>
                        <ModeToggle />
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>TC</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </div>
    )
}