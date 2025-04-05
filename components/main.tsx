"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { PlusCircle, X, GripVertical, CalendarIcon, Plus, Hash } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Todo = {
  id: string
  text: string
  completed: boolean
  date?: Date
  group?: string
  tags: string[]
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [newTodoDate, setNewTodoDate] = useState<Date | undefined>(undefined)
  const [newTodoGroup, setNewTodoGroup] = useState<string>("")
  const [newTodoTags, setNewTodoTags] = useState<string[]>([])
  const [groups, setGroups] = useState<string[]>(["Personal", "Work", "Shopping", "Health"])
  const [activeFilter, setActiveFilter] = useState("all")
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        date: newTodoDate,
        group: newTodoGroup || undefined,
        tags: newTodoTags,
      }
      setTodos([...todos, newTodoItem])
      setNewTodo("")
      setNewTodoDate(undefined)
      setNewTodoGroup("")
      setNewTodoTags([])
    }
  }

  const addGroup = (group: string) => {
    if (group && !groups.includes(group)) {
      setGroups([...groups, group])
      return true
    }
    return false
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const getFilteredTodos = () => {
    let filtered = todos

    // Filter by completion status
    if (activeFilter === "active") {
      filtered = filtered.filter((todo) => !todo.completed)
    } else if (activeFilter === "completed") {
      filtered = filtered.filter((todo) => todo.completed)
    }

    // Filter by group
    if (activeGroup) {
      filtered = filtered.filter((todo) => todo.group === activeGroup)
    }

    // Filter by tag
    if (activeTag) {
      filtered = filtered.filter((todo) => todo.tags.includes(activeTag))
    }

    return filtered
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(todos)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setTodos(items)
  }

  const activeTodosCount = todos.filter((todo) => !todo.completed).length
  const filteredTodos = getFilteredTodos()

  return (
    <Card className="shadow-lg border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Task Master</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Input
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                addTodo()
              }
            }}
            className="flex-1"
          />

          <div className="flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {newTodoDate ? format(newTodoDate, "PPP") : "Add date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={newTodoDate} onSelect={setNewTodoDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Select value={newTodoGroup} onValueChange={setNewTodoGroup}>
              <SelectTrigger className="h-8 w-[150px]">
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-group">No group</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
                <CreateNewGroup onCreateGroup={addGroup} />
              </SelectContent>
            </Select>

            <TagInput tags={newTodoTags} setTags={setNewTodoTags} placeholder="Add tags..." className="h-8" />

            <Button onClick={addTodo} size="sm" className="h-8 ml-auto">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveFilter}>
          <div className="flex items-center justify-between mb-2">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <Badge variant="outline">{activeTodosCount} left</Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <Select value={activeGroup || ""} onValueChange={(value) => setActiveGroup(value || null)}>
              <SelectTrigger className="h-8 w-[150px]">
                <SelectValue placeholder="All groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-groups">All groups</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeTag ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex items-center gap-1"
                onClick={() => setActiveTag(null)}
              >
                <Hash className="h-3 w-3" />
                {activeTag}
                <X className="h-3 w-3" />
              </Button>
            ) : null}

            {todos
              .flatMap((todo) => todo.tags)
              .filter((tag, i, arr) => arr.indexOf(tag) === i && tag !== activeTag)
              .slice(0, 5)
              .map((tag) => (
                <Button key={tag} variant="ghost" size="sm" className="h-8" onClick={() => setActiveTag(tag)}>
                  <Hash className="h-3 w-3 mr-1" />
                  {tag}
                </Button>
              ))}
          </div>

          <TabsContent value="all" className="m-0">
            <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} onDragEnd={handleDragEnd} />
          </TabsContent>
          <TabsContent value="active" className="m-0">
            <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} onDragEnd={handleDragEnd} />
          </TabsContent>
          <TabsContent value="completed" className="m-0">
            <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} onDragEnd={handleDragEnd} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">Drag to reorder</span>
        <Button variant="ghost" size="sm" onClick={clearCompleted} disabled={!todos.some((todo) => todo.completed)}>
          Clear completed
        </Button>
      </CardFooter>
    </Card>
  )
}

function TodoList({
  todos,
  onToggle,
  onDelete,
  onDragEnd,
}: {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onDragEnd: (result: any) => void
}) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
            {todos.length === 0 ? (
              <li className="text-center py-4 text-muted-foreground">No tasks found</li>
            ) : (
              todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex flex-col p-3 rounded-lg border ${todo.completed ? "bg-muted/50" : "bg-card"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => onToggle(todo.id)}
                            id={`todo-${todo.id}`}
                          />
                          <label
                            htmlFor={`todo-${todo.id}`}
                            className={`text-sm font-medium ${
                              todo.completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {todo.text}
                          </label>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(todo.id)} className="h-8 w-8">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Date, Group, and Tags */}
                      <div className="ml-10 mt-2 flex flex-wrap gap-2 items-center">
                        {todo.date && (
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {format(new Date(todo.date), "PPP")}
                          </Badge>
                        )}

                        {todo.group && (
                          <Badge variant="secondary" className="text-xs">
                            {todo.group}
                          </Badge>
                        )}

                        {todo.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs bg-primary/10">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </li>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function CreateNewGroup({ onCreateGroup }: { onCreateGroup: (group: string) => boolean }) {
  const [newGroup, setNewGroup] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleAddGroup = () => {
    if (onCreateGroup(newGroup)) {
      setNewGroup("")
      setIsAdding(false)
    }
  }

  if (isAdding) {
    return (
      <div className="flex items-center p-2">
        <Input
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          placeholder="New group name"
          className="h-8 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddGroup()
            if (e.key === "Escape") setIsAdding(false)
          }}
          autoFocus
        />
        <Button size="sm" variant="ghost" onClick={handleAddGroup} className="h-8 px-2">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div
      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      onClick={() => setIsAdding(true)}
    >
      <Plus className="h-4 w-4 mr-2" />
      Create new group
    </div>
  )
}

function TagInput({
  tags,
  setTags,
  placeholder,
  className,
}: {
  tags: string[]
  setTags: (tags: string[]) => void
  placeholder?: string
  className?: string
}) {
  const [inputValue, setInputValue] = useState("")

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
    }
    setInputValue("")
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className={`flex flex-wrap items-center gap-1 border rounded-md px-3 ${className}`}>
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="text-xs flex items-center gap-1">
          <Hash className="h-3 w-3" />
          {tag}
          <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
        </Badge>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === ",") && inputValue) {
            e.preventDefault()
            addTag(inputValue)
          }
        }}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="border-0 h-7 p-0 text-sm flex-1 min-w-[80px] focus-visible:ring-0"
      />
    </div>
  )
}

