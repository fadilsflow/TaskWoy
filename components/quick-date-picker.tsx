"use client"

import { useState } from "react"
import {
    Calendar as CalendarIcon,
    X,
    Sun,
    Sunrise,
    CalendarDays,
    CalendarRange,
    Clock
} from "lucide-react"
import { addDays, addWeeks, addMonths, startOfDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { TimePicker } from "@/components/time-picker"

interface QuickDatePickerProps {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
}

export function QuickDatePicker({ date, setDate }: QuickDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [time, setTime] = useState<string>()

    const quickOptions = [
        {
            label: "Today",
            icon: Sun,
            action: () => setDate(startOfDay(new Date())),
        },
        {
            label: "Tomorrow",
            icon: Sunrise,
            action: () => setDate(startOfDay(addDays(new Date(), 1))),
        },
        {
            label: "Next Week",
            icon: CalendarDays,
            action: () => setDate(startOfDay(addWeeks(new Date(), 1))),
        },
        {
            label: "Next Month",
            icon: CalendarRange,
            action: () => setDate(startOfDay(addMonths(new Date(), 1))),
        },
        {
            label: "No Date",
            icon: X,
            action: () => {
                setDate(undefined)
                setTime(undefined)
            },
        },
    ]

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                >
                    <CalendarIcon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <div className="flex">
                    <div className="p-2">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                        {date && (
                            <div className="mt-2 flex items-center gap-2">
                                <TimePicker time={time} setTime={setTime} />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 p-2 border-l">
                        {quickOptions.map((option) => (
                            <Button
                                key={option.label}
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2 h-auto px-3 py-2"
                                onClick={() => {
                                    option.action()
                                    setIsOpen(false)
                                }}
                            >
                                <option.icon className="h-4 w-4" />
                                <span className="text-sm">
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