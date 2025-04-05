"use client"

import { useState } from "react"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { QuickDatePicker } from "@/components/quick-date-picker"

export default function TodoForm() {
    const [date, setDate] = useState<Date>()
    const [taskName, setTaskName] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission
        console.log({
            taskName,
            date,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center">
                <Input
                    type="text"
                    placeholder="Add a task"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="pr-24"
                />

                <div className="absolute right-0 flex items-center gap-1 pr-2">
                    <QuickDatePicker date={date} setDate={setDate} />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                Priority
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Tags
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Project
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </form>
    )
}   