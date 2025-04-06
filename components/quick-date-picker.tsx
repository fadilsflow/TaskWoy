"use client"

import { useState, useEffect } from "react"
import {
    Calendar as CalendarIcon,
    X,
    Sun,
    CalendarDays,
    Moon,
    Star
} from "lucide-react"
import { addDays, addWeeks, addMonths, startOfDay, format, setHours, setMinutes } from "date-fns"
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
    const [time, setTime] = useState<string | undefined>(undefined)

    // Inisialisasi waktu dari date jika ada
    useEffect(() => {
        if (date) {
            // Hanya set time jika bukan waktu default (00:00)
            if (date.getHours() > 0 || date.getMinutes() > 0) {
                const hours = date.getHours().toString().padStart(2, '0')
                const minutes = date.getMinutes().toString().padStart(2, '0')
                setTime(`${hours}:${minutes}`)
            } else {
                setTime(undefined)
            }
        } else {
            // Reset time jika date tidak ada
            setTime(undefined)
        }
    }, [date])

    const getDatePreview = () => {
        if (!date) return "Today"

        // Format tanggal
        const dateStr = format(date, "MMM d")

        // Jika ada waktu yang dipilih, tambahkan preview waktu
        if (time) {
            return `${dateStr} • ${time}`
        }

        return dateStr
    }

    const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            // Jika ada waktu yang dipilih, terapkan ke tanggal yang dipilih
            if (time) {
                const [hours, minutes] = time.split(':').map(Number)
                selectedDate = setHours(selectedDate, hours)
                selectedDate = setMinutes(selectedDate, minutes)
            } else {
                // Jika tidak ada waktu yang dipilih, set ke tengah hari (12:00)
                // Ini akan dianggap sebagai waktu default dan tidak akan ditampilkan
                selectedDate = setHours(selectedDate, 0)
                selectedDate = setMinutes(selectedDate, 0)
            }
            setDate(selectedDate)
            if (onSelect) {
                onSelect(selectedDate)
            }
        } else {
            setDate(undefined)
        }
        setIsOpen(false)
    }

    // Fungsi untuk menangani perubahan waktu
    const handleTimeChange = (newTime: string | undefined) => {
        setTime(newTime)

        // Jika ada waktu yang dipilih
        if (newTime) {
            // Gunakan tanggal yang sudah dipilih atau tanggal hari ini sebagai default
            const targetDate = date || startOfDay(new Date())
            const [hours, minutes] = newTime.split(':').map(Number)
            const updatedDate = setMinutes(setHours(targetDate, hours), minutes)
            setDate(updatedDate)
            if (onSelect) {
                onSelect(updatedDate)
            }
        } else {
            // Jika waktu dihapus, set tanggal ke hari ini tanpa waktu
            const today = startOfDay(new Date())
            setDate(today)
            if (onSelect) {
                onSelect(today)
            }
        }
    }

    // Fungsi untuk mereset time
    const resetTime = () => {
        setTime(undefined)
        if (date) {
            const resetDate = setHours(setMinutes(date, 0), 0)
            setDate(resetDate)
            if (onSelect) {
                onSelect(resetDate)
            }
        }
    }

    const quickOptions = [
        {
            label: "Today",
            icon: Sun,
            action: () => {
                const today = startOfDay(new Date())
                handleSelect(today)
            },
        },
        {
            label: "Tomorrow",
            icon: Moon,
            action: () => {
                const tomorrow = startOfDay(addDays(new Date(), 1))
                handleSelect(tomorrow)
            },
        },
        {
            label: "Next Week",
            icon: CalendarDays,
            action: () => {
                const nextWeek = startOfDay(addWeeks(new Date(), 1))
                handleSelect(nextWeek)
            },
        },
        {
            label: "Next Month",
            icon: Star,
            action: () => {
                const nextMonth = startOfDay(addMonths(new Date(), 1))
                handleSelect(nextMonth)
            },
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
                            <TimePicker time={time} setTime={handleTimeChange} />
                            {time && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={resetTime}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
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