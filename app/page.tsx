import TaskInputForm from "@/components/todo-form"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container flex-1 py-6">
        <TaskInputForm />
      </div>
    </main>
  )
}
