"use client"

import { useState } from "react"
import {
    Calendar as CalendarIcon,
    X,
    Sun,
    CalendarDays,
    Moon,
    Star
} from "lucide-react"
import { addDays, addWeeks, addMonths, startOfDay, format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { TimePicker } from "@/components/time-picker"
import { cn } from "@/lib/utils"

export function QuickDatePicker({
    date,
    setDate,
    onSelect,
}: {
    date?: Date
    setDate: (date: Date | undefined) => void
    onSelect?: (date: Date) => void
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [time, setTime] = useState<string>()

    const getDatePreview = () => {
        if (!date) return "Today"
        return format(date, "MMM d")
    }

    const handleSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate || new Date())
        if (onSelect) {
            onSelect(selectedDate || new Date())
        }
        setIsOpen(false)
    }

    const quickOptions = [
        {
            label: "Today",
            icon: Sun,
            action: () => handleSelect(startOfDay(new Date())),
        },
        {
            label: "Tomorrow",
            icon: Moon,
            action: () => handleSelect(startOfDay(addDays(new Date(), 1))),
        },
        {
            label: "Next Week",
            icon: CalendarDays,
            action: () => handleSelect(startOfDay(addWeeks(new Date(), 1))),
        },
        {
            label: "Next Month",
            icon: Star,
            action: () => handleSelect(startOfDay(addMonths(new Date(), 1))),
        },
    ]

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-8 px-2 gap-1",
                        date && "text-blue-500"
                    )}
                >
                    <CalendarIcon className="h-4 w-4" />
                    <span className="text-xs">{getDatePreview()}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <div className="flex">
                    <div className="p-2">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleSelect}
                            initialFocus
                        />
                        <div className="mt-2 flex items-center gap-2">
                            <TimePicker time={time} setTime={setTime} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-7 pt-9 border-l">
                        {quickOptions.map((option) => (
                            <Button
                                key={option.label}
                                variant="link"
                                size="sm"
                                className="flex flex-col hover:cursor-pointer items-center gap-1 hover:no-underline"
                                onClick={() => {
                                    option.action()
                                    setIsOpen(false)
                                }}
                            >
                                <option.icon className="h-2 w-2" />
                                <span className="text-[10px] text-muted-foreground">
                                    {option.label}
                                </span>
                            </Button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
} 