import TaskInputForm from "@/components/todo-form"
import { Navbar } from "@/components/navbar"

export default function Home() {
    return (
        <main className="flex min-h-screen h-full  flex-col items-center justify-center ">
            <Navbar />
            <div className="container px-5 lg:px-10 flex-1 py-6">
                <TaskInputForm />
            </div>
        </main>
    )
}
