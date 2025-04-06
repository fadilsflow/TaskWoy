"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUp, Bell, Grab } from "lucide-react"
import { QuickDatePicker } from "@/components/quick-date-picker"
import { cn } from "@/lib/utils"
import { startOfDay } from "date-fns"

// Tipe data
type TaskStatus = "pending" | "in_progress" | "completed" | "archived"

interface Todo {
    id: string
    text: string
    status: TaskStatus
    date?: Date
}

interface TodoFormProps { }


// Komponen untuk menampilkan konten todo item
const TodoItemContent = ({ todo, selectedTodos }: { todo: Todo; selectedTodos: string[] }) => {
    // Pastikan todo.date adalah objek Date yang valid
    const dateObj = todo.date ? new Date(todo.date) : null;

    // Cek apakah waktu adalah waktu default (00:00) atau waktu yang dipilih pengguna
    const hasCustomTime = dateObj && !isNaN(dateObj.getTime()) &&
        (dateObj.getHours() > 0 || dateObj.getMinutes() > 0);

    return (
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
            {dateObj && (
                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                    <Bell className="w-4 h-4" />
                    <div className="flex items-center gap-1">
                        {dateObj.toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                        {hasCustomTime && (
                            <>
                                <span className="mx-1">•</span>
                                <div className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    {dateObj.toLocaleTimeString('id-ID', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

// Komponen untuk menampilkan kolom todo
const TodoColumn = ({
    title,
    status,
    todos,
    onTodoSelect,
    selectedTodos,
    isDraggingMultiple,
    onArchiveAll
}: {
    title: string
    status: TaskStatus
    todos: Todo[]
    onTodoSelect: (todoId: string, event: React.MouseEvent) => void
    selectedTodos: string[]
    isDraggingMultiple: boolean
    onArchiveAll?: () => void
}) => (
    <div className="bg-card rounded-lg flex flex-col min-w-[300px] h-[calc(110vh-16rem)] sm:h-[calc(110vh-18rem)] border shadow-sm">
        <div className="p-2 sm:p-3 border-b flex justify-between items-center">
            <h3 className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                <span className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    status === "pending" && "bg-red-700",
                    status === "in_progress" && "bg-yellow-700",
                    status === "completed" && "bg-emerald-700",
                    status === "archived" && "bg-gray-700"
                )}></span>
                {title}
            </h3>
            {status === "completed" && onArchiveAll && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onArchiveAll}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                    Arsipkan Semua
                </Button>
            )}
        </div>
        <div className="p-2 sm:p-3 flex-1 overflow-hidden">
            <Droppable droppableId={status}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="h-full overflow-y-auto scrollbar-hide"
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
                                            "flex flex-col p-2 md:p-3 rounded-lg ",
                                            "bg-card border-b",
                                            "hover:bg-accent/50 hover:shadow-md shadow-sm",
                                            selectedTodos.includes(todo.id) && "bg-primary/5 border-primary/20",
                                            snapshot.isDragging && "opacity-75 shadow-lg"
                                        )}
                                        style={{
                                            ...provided.draggableProps.style,
                                            zIndex: snapshot.isDragging ? 9999 : 'auto'
                                        }}
                                    >
                                        <TodoItemContent todo={todo} selectedTodos={selectedTodos} />
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
    const scrollContainerRef = useRef<HTMLDivElement>(null)

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

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        if (task.trim()) {
            const newTodo: Todo = {
                id: Date.now().toString(),
                text: task.trim(),
                status: "pending",
                date: date || startOfDay(new Date()),
            }
            setTodos(prevTodos => [...prevTodos, newTodo])
            setTask("")
            setDate(undefined)
        }
    }, [task, date])

    const handleDateSelect = useCallback((selectedDate: Date) => {
        setDate(selectedDate)
    }, [])

    const handleDragStart = useCallback((start: any) => {
        const draggedId = start.draggableId
        setIsDraggingMultiple(selectedTodos.includes(draggedId) && selectedTodos.length > 1)
    }, [selectedTodos])

    const handleDragEnd = useCallback((result: any) => {
        setIsDraggingMultiple(false)

        if (!result.destination) return

        const { source, destination } = result
        const draggedId = result.draggableId
        const isSelectedItemDragged = selectedTodos.includes(draggedId)

        // Jika dragging item yang dipilih
        if (isSelectedItemDragged && selectedTodos.length > 1) {
            setTodos(prevTodos => {
                // Buat map posisi saat ini
                const todoPositions = new Map<string, number>();

                // Dapatkan semua todo di status tujuan
                const destStatusTodos = prevTodos.filter(todo =>
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
                const selectedTodosList = prevTodos.filter(todo => selectedTodos.includes(todo.id));
                selectedTodosList.forEach((todo, index) => {
                    todo.status = destination.droppableId as TaskStatus;
                    todoPositions.set(todo.id, destination.index + index);
                });

                // Update todo lainnya
                const otherTodos = prevTodos.filter(todo =>
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

                return newTodosArray;
            });

            setSelectedTodos([]); // Hapus seleksi setelah pindah
            return;
        }

        // Logika drag item tunggal
        setTodos(prevTodos => {
            const todosCopy = [...prevTodos]

            if (source.droppableId === destination.droppableId) {
                // Jika dalam card yang sama, urutkan ulang
                const sourceTodos = todosCopy.filter(todo => todo.status === source.droppableId);

                // Pastikan sourceTodos tidak kosong dan index valid
                if (sourceTodos.length === 0 || source.index >= sourceTodos.length) {
                    return todosCopy;
                }

                // Temukan item yang akan dipindahkan
                const movedItem = sourceTodos[source.index];

                // Hapus item dari posisi asal
                sourceTodos.splice(source.index, 1);

                // Pastikan destination.index valid
                const validDestIndex = Math.min(destination.index, sourceTodos.length);

                // Masukkan item ke posisi baru
                sourceTodos.splice(validDestIndex, 0, movedItem);

                // Gabungkan dengan todo lainnya
                const otherTodos = todosCopy.filter(todo => todo.status !== source.droppableId);
                return [...otherTodos, ...sourceTodos];
            } else {
                // Jika pindah ke card lain
                const sourceTodos = todosCopy.filter(todo => todo.status === source.droppableId);
                const destTodos = todosCopy.filter(todo => todo.status === destination.droppableId);

                if (sourceTodos.length === 0 || source.index >= sourceTodos.length) {
                    return todosCopy;
                }

                const movedItem = sourceTodos[source.index];
                sourceTodos.splice(source.index, 1);

                const updatedItem = { ...movedItem, status: destination.droppableId as TaskStatus };
                const validDestIndex = Math.min(destination.index, destTodos.length);
                destTodos.splice(validDestIndex, 0, updatedItem);

                const newTodos = todosCopy.filter(todo =>
                    todo.status !== source.droppableId &&
                    todo.status !== destination.droppableId
                );
                return [...newTodos, ...sourceTodos, ...destTodos];
            }
        });
    }, [selectedTodos])

    const handleTodoSelect = useCallback((todoId: string, event: React.MouseEvent) => {
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
    }, [todos, lastSelectedId])

    const handleArchiveAllCompleted = useCallback(() => {
        setTodos(prevTodos => {
            return prevTodos.map(todo => {
                if (todo.status === "completed") {
                    return { ...todo, status: "archived" as TaskStatus };
                }
                return todo;
            });
        });
    }, []);

    // Kelompokkan todo berdasarkan status menggunakan useMemo untuk menghindari perhitungan ulang yang tidak perlu
    const groupedTodos = useMemo(() => ({
        pending: todos.filter(todo => todo.status === "pending"),
        in_progress: todos.filter(todo => todo.status === "in_progress"),
        completed: todos.filter(todo => todo.status === "completed"),
        archived: todos.filter(todo => todo.status === "archived"),
    }), [todos]);

    return (
        <div className="w-full max-w-full flex flex-col h-full">
            {/* Todo List Card */}
            <div className="flex-1 overflow-hidden min-h-[calc(100vh-12rem)]">
                <DragDropContext
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div
                        ref={scrollContainerRef}
                        className="overflow-x-auto pb-4 h-full scrollbar-hide touch-pan-x"
                    >
                        <div className="flex md:grid md:grid-cols-3 gap-4 min-w-full h-full" style={{ minWidth: "max-content" }}>
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
                                onArchiveAll={handleArchiveAllCompleted}
                            />
                        </div>
                    </div>
                </DragDropContext>
            </div>

            {/* Todo Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="w-full mt-auto">
                <div className="flex flex-col border rounded-lg shadow-sm bg-card">
                    <div className="flex items-center gap-2 p-3 sm:p-4">
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