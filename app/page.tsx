import TaskInputForm from "@/components/todo-form"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <main className="flex min-h-screen h-full  flex-col items-center justify-center px-5 lg:px-10">
      <Navbar />
      <div className="container flex-1 py-6">
        <h1>HOme</h1>
      </div>
    </main>
  )
}
