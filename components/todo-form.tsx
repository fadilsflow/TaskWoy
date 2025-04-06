"use client"

import React, { useState, useRef, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUp, Bell, Grab } from "lucide-react"
import { QuickDatePicker } from "@/components/quick-date-picker"
import { cn } from "@/lib/utils"

// Tipe data
type TaskStatus = "pending" | "in_progress" | "completed"

interface Todo {
    id: string
    text: string
    status: TaskStatus
    date?: Date
}

interface TodoFormProps { }

// Komponen untuk menampilkan indikator multi-drag
const MultiDragIndicator = () => (
    <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center p-1 shadow-md w-6 h-6">
        <Grab className="h-3 w-3" />
    </div>
)

// Komponen untuk menampilkan konten todo item
const TodoItemContent = ({ todo, selectedTodos }: { todo: Todo; selectedTodos: string[] }) => (
    <>
        <div className="flex items-center gap-2">
            <span className={cn(
                "text-sm flex-1",
                todo.status === "completed" && "line-through text-muted-foreground"
            )}>
                {todo.text}
            </span>
            {selectedTodos.includes(todo.id) && selectedTodos.length > 1 && (
                <div className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                    {selectedTodos.indexOf(todo.id) + 1}/{selectedTodos.length}
                </div>
            )}
        </div>
        {todo.date && (
            <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                <Bell className="w-4 h-4" />
                {new Date(todo.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </div>
        )}
    </>
)

// Komponen untuk menampilkan kolom todo
const TodoColumn = ({
    title,
    status,
    todos,
    onTodoSelect,
    selectedTodos,
    isDraggingMultiple
}: {
    title: string
    status: TaskStatus
    todos: Todo[]
    onTodoSelect: (todoId: string, event: React.MouseEvent) => void
    selectedTodos: string[]
    isDraggingMultiple: boolean
}) => (
    <div className="bg-card rounded-lg flex flex-col min-w-[300px] h-[300px] sm:h-[400px] border shadow-sm">
        <div className="p-2 sm:p-3 border-b">
            <h3 className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                <span className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    status === "pending" && "bg-red-700",
                    status === "in_progress" && "bg-yellow-700",
                    status === "completed" && "bg-emerald-700"
                )}></span>
                {title}
            </h3>
        </div>
        <div className="p-2 sm:p-3 flex-1 overflow-hidden">
            <Droppable droppableId={status}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="h-full overflow-y-auto space-y-2"
                    >
                        {todos.map((todo, index) => (
                            <Draggable
                                key={todo.id}
                                draggableId={todo.id}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        onClick={(e) => onTodoSelect(todo.id, e)}
                                        className={cn(
                                            "flex flex-col p-2 md:p-3 rounded-lg transition-all duration-200",
                                            "bg-card border shadow-sm",
                                            "hover:bg-accent/50 hover:shadow-md",
                                            "active:scale-[0.98]",
                                            selectedTodos.includes(todo.id) && "bg-primary/5 border-primary/20",
                                            snapshot.isDragging && "opacity-75 shadow-lg"
                                        )}
                                        style={{
                                            ...provided.draggableProps.style,
                                            zIndex: snapshot.isDragging ? 9999 : 'auto'
                                        }}
                                    >
                                        <TodoItemContent todo={todo} selectedTodos={selectedTodos} />
                                        {isDraggingMultiple && selectedTodos.includes(todo.id) && <MultiDragIndicator />}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    </div>
)

export default function TaskInputForm({ }: TodoFormProps) {
    const [task, setTask] = useState("")
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [todos, setTodos] = useState<Todo[]>([])
    const [selectedTodos, setSelectedTodos] = useState<string[]>([])
    const [lastSelectedId, setLastSelectedId] = useState<string | null>(null)
    const [isDraggingMultiple, setIsDraggingMultiple] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    // Load todos from localStorage
    useEffect(() => {
        const savedTodos = localStorage.getItem("todos")
        if (savedTodos) {
            try {
                const parsedTodos = JSON.parse(savedTodos)
                setTodos(parsedTodos)
            } catch (e) {
                console.error("Error parsing todos from localStorage", e)
            }
        }
    }, [])

    // Save todos to localStorage
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos))
    }, [todos])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (task.trim()) {
            const newTodo: Todo = {
                id: Date.now().toString(),
                text: task.trim(),
                status: "pending",
                date: date || new Date(),
            }
            setTodos([...todos, newTodo])
            setTask("")
            setDate(undefined)
        }
    }

    const handleDateSelect = (selectedDate: Date) => {
        setDate(selectedDate)
    }

    const handleDragStart = (start: any) => {
        const draggedId = start.draggableId
        setIsDraggingMultiple(selectedTodos.includes(draggedId) && selectedTodos.length > 1)
    }

    const handleDragEnd = (result: any) => {
        setIsDraggingMultiple(false)

        if (!result.destination) return

        const { source, destination } = result
        const draggedId = result.draggableId
        const isSelectedItemDragged = selectedTodos.includes(draggedId)

        // Jika dragging item yang dipilih
        if (isSelectedItemDragged && selectedTodos.length > 1) {
            // Buat map posisi saat ini
            const todoPositions = new Map<string, number>();

            // Dapatkan semua todo di status tujuan
            const destStatusTodos = todos.filter(todo =>
                todo.status === destination.droppableId &&
                !selectedTodos.includes(todo.id)
            );

            // Atur posisi untuk setiap item di tujuan
            destStatusTodos.forEach((todo, index) => {
                const position = index >= destination.index ?
                    index + selectedTodos.length :
                    index;
                todoPositions.set(todo.id, position);
            });

            // Update status todo yang dipilih
            const selectedTodosList = todos.filter(todo => selectedTodos.includes(todo.id));
            selectedTodosList.forEach((todo, index) => {
                todo.status = destination.droppableId as TaskStatus;
                todoPositions.set(todo.id, destination.index + index);
            });

            // Update todo lainnya
            const otherTodos = todos.filter(todo =>
                !selectedTodos.includes(todo.id) &&
                todo.status !== destination.droppableId
            );

            // Buat array baru dengan semua todo
            const newTodosArray = [...otherTodos, ...destStatusTodos, ...selectedTodosList];

            // Urutkan array berdasarkan status dan posisi
            newTodosArray.sort((a, b) => {
                if (a.status !== b.status) {
                    return a.status.localeCompare(b.status);
                }

                const posA = todoPositions.get(a.id) ?? 0;
                const posB = todoPositions.get(b.id) ?? 0;
                return posA - posB;
            });

            setTodos(newTodosArray);
            setSelectedTodos([]); // Hapus seleksi setelah pindah
            return;
        }

        // Logika drag item tunggal
        if (source.droppableId === destination.droppableId) {
            const items = Array.from(todos)
            const [reorderedItem] = items.splice(source.index, 1)
            items.splice(destination.index, 0, reorderedItem)
            setTodos(items)
        } else {
            const sourceTodos = todos.filter(todo => todo.status === source.droppableId)
            const destTodos = todos.filter(todo => todo.status === destination.droppableId)
            const [movedItem] = sourceTodos.splice(source.index, 1)
            movedItem.status = destination.droppableId as TaskStatus
            destTodos.splice(destination.index, 0, movedItem)

            const newTodos = todos.filter(todo =>
                todo.status !== source.droppableId &&
                todo.status !== destination.droppableId
            )
            setTodos([...newTodos, ...sourceTodos, ...destTodos])
        }
    }

    const handleTodoSelect = (todoId: string, event: React.MouseEvent) => {
        // Mencegah seleksi saat mengklik handle drag
        if (event.target instanceof Element && event.target.closest('[data-drag-handle="true"]')) {
            return
        }

        if (event.shiftKey && lastSelectedId) {
            // Dapatkan semua todo dalam grup status yang sama
            const todoStatus = todos.find(t => t.id === todoId)?.status
            const todosInGroup = todos.filter(t => t.status === todoStatus)

            // Temukan indeks todo saat ini dan terakhir dipilih dalam grup
            const currentIndex = todosInGroup.findIndex(t => t.id === todoId)
            const lastIndex = todosInGroup.findIndex(t => t.id === lastSelectedId)

            if (currentIndex !== -1 && lastIndex !== -1) {
                // Tentukan rentang todo yang akan dipilih
                const startIndex = Math.min(currentIndex, lastIndex)
                const endIndex = Math.max(currentIndex, lastIndex)

                // Dapatkan ID todo yang akan dipilih
                const todosToSelect = todosInGroup
                    .slice(startIndex, endIndex + 1)
                    .map(t => t.id)

                // Update todo yang dipilih
                setSelectedTodos(prev => {
                    const newSelection = [...prev]
                    todosToSelect.forEach(id => {
                        if (!newSelection.includes(id)) {
                            newSelection.push(id)
                        }
                    })
                    return newSelection
                })
            }
        } else {
            // Untuk klik biasa (non-shift):
            // Jika tombol ctrl/cmd ditekan, toggle item ini dalam seleksi
            // Jika tidak, ganti seleksi dengan hanya item ini
            if (event.ctrlKey || event.metaKey) {
                setSelectedTodos(prev => {
                    if (prev.includes(todoId)) {
                        return prev.filter(id => id !== todoId)
                    } else {
                        return [...prev, todoId]
                    }
                })
            } else {
                setSelectedTodos(prev => {
                    if (prev.length === 1 && prev[0] === todoId) {
                        // Mengklik satu-satunya item yang dipilih akan menghapus seleksi
                        return []
                    } else {
                        // Jika tidak, pilih hanya item ini
                        return [todoId]
                    }
                })
            }
        }

        setLastSelectedId(todoId)
    }

    // Kelompokkan todo berdasarkan status
    const groupedTodos = {
        pending: todos.filter(todo => todo.status === "pending"),
        in_progress: todos.filter(todo => todo.status === "in_progress"),
        completed: todos.filter(todo => todo.status === "completed"),
    }

    return (
        <div className="w-full max-w-full flex flex-col px-2 sm:px-4 md:px-0">
            {/* Todo List Card */}
            <div className="flex-1 overflow-hidden">
                <DragDropContext
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    {/* Mobile view: horizontal scrollable columns */}
                    <div className="overflow-x-auto pb-4">
                        <div className="flex md:grid md:grid-cols-3 gap-4 min-w-full" style={{ minWidth: "max-content" }}>
                            <TodoColumn
                                title="Belum Dikerjakan"
                                status="pending"
                                todos={groupedTodos.pending}
                                onTodoSelect={handleTodoSelect}
                                selectedTodos={selectedTodos}
                                isDraggingMultiple={isDraggingMultiple}
                            />
                            <TodoColumn
                                title="Sedang Dikerjakan"
                                status="in_progress"
                                todos={groupedTodos.in_progress}
                                onTodoSelect={handleTodoSelect}
                                selectedTodos={selectedTodos}
                                isDraggingMultiple={isDraggingMultiple}
                            />
                            <TodoColumn
                                title="Selesai"
                                status="completed"
                                todos={groupedTodos.completed}
                                onTodoSelect={handleTodoSelect}
                                selectedTodos={selectedTodos}
                                isDraggingMultiple={isDraggingMultiple}
                            />
                        </div>
                    </div>
                </DragDropContext>
            </div>

            {/* Todo Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="w-full mt-2 sm:mt-4 mb-2 sm:mb-4">
                <div className="flex flex-col border rounded-lg shadow-sm bg-card">
                    <div className="flex items-center gap-2 p-2 sm:p-3">
                        <div className="relative flex-1 flex items-center">
                            <Input
                                type="text"
                                placeholder="Apa yang akan kamu lakukan?"
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                                className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base md:text-lg pr-10 bg-transparent placeholder:text-muted-foreground/60"
                            />
                            <div className="absolute right-2 flex items-center justify-center cursor-pointer text-muted-foreground/70 hover:text-foreground transition-colors">
                                <QuickDatePicker date={date} setDate={setDate} onSelect={handleDateSelect} />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            disabled={!task.trim()}
                            className="h-9 w-9 flex-shrink-0 hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowUp className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}