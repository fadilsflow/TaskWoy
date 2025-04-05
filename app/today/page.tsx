"use client"

import { useState } from "react"
import TodoForm from "@/components/todo-form"
import { Checkbox } from "@/components/ui/checkbox"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TodoHeader from "@/components/todo-header"
export default function Today() {
    const [selectedTask, setSelectedTask] = useState<string | null>(null)

    return (
        <section className="min-h-screen">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={60} minSize={40}>
                    <div className="p-5 h-full">
                    <TodoHeader />
                        <TodoForm />
                        <div className="flex flex-col pt-4">
                            <ul className="space-y-2">
                                <li>
                                    <div
                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer"
                                        onClick={() => setSelectedTask("task1")}
                                    >
                                        <Checkbox />
                                        <p>Contoh task 1</p>
                                    </div>
                                </li>
                                <li>
                                    <div
                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer"
                                        onClick={() => setSelectedTask("task2")}
                                    >
                                        <Checkbox />
                                        <p>Contoh task 2</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel defaultSize={40} minSize={30}>
                    <div className="h-full p-5">
                        {selectedTask ? (
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>Task Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-medium">Task Name</h3>
                                            <p>Contoh task {selectedTask}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Due Date</h3>
                                            <p>2024-04-10</p>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Priority</h3>
                                            <p>High</p>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Description</h3>
                                            <p>Ini adalah deskripsi task yang dipilih</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                Select a task to view details
                            </div>
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </section>
    )
}