"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Clock, Clock1, Clock2, Clock3, Clock4, Clock5, Clock6, Clock7, Clock8, Clock9, Clock10, Clock11, Clock12 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface TimePickerProps {
    time: string | undefined
    setTime: (time: string | undefined) => void
}

export function     TimePicker({ time, setTime }: TimePickerProps) {
    const [open, setOpen] = React.useState(false)

    // Generate time options from 00:00 to 23:30 with 30-minute intervals
    const timeOptions = React.useMemo(() => {
        const times = []
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
                times.push(timeString)
            }
        }
        return times
    }, [])

    const getClockIcon = (hour: number) => {
        const icons = {
            0: Clock12,
            1: Clock1,
            2: Clock2,
            3: Clock3,
            4: Clock4,
            5: Clock5,
            6: Clock6,
            7: Clock7,
            8: Clock8,
            9: Clock9,
            10: Clock10,
            11: Clock11,
            12: Clock12,
            13: Clock1,
            14: Clock2,
            15: Clock3,
            16: Clock4,
            17: Clock5,
            18: Clock6,
            19: Clock7,
            20: Clock8,
            21: Clock9,
            22: Clock10,
            23: Clock11,
        }
        return icons[hour as keyof typeof icons]
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[240px] justify-between"
                >
                    <div className="flex items-center gap-2">
                        {time ? (
                            <>
                                {React.createElement(getClockIcon(parseInt(time.split(':')[0])), { className: "h-4 w-4" })}
                                <span>{time}</span>
                            </>
                        ) : (
                            <>
                                <Clock className="h-4 w-4" />
                                <span>Time</span>
                            </>
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-0">
                <Command>
                    <CommandGroup className="max-h-[300px] overflow-auto">
                        {timeOptions.map((timeOption) => {
                            const hour = parseInt(timeOption.split(':')[0])
                            const Icon = getClockIcon(hour)
                            return (
                                <CommandItem
                                    key={timeOption}
                                    value={timeOption}
                                    onSelect={() => {
                                        setTime(timeOption)
                                        setOpen(false)
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{timeOption}</span>
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            time === timeOption ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            )
                        })}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
} 