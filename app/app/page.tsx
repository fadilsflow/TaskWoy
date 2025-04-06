"use client"

import TodoForm from "@/components/todo-form"
import { Navbar } from "@/components/navbar"

export default function App() {
    return (
        <div className="h-full  w-full flex flex-col px-0 lg:px-20 bg-gradient-to-b ">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
                <TodoForm />
            </div>
        </div>
    )
}