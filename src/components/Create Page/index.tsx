import styles from "./styles.module.css"
import { useEffect } from "react"
import { useState } from "react"

import type { Task } from "../../types/typing"

import { loadTasks, saveTasks } from "../../utils/storage"

import { Input } from "./Input"
import { Button } from "./Button"
import { Modal } from "./Modal"

interface CreatePageProps {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  goToListPage: () => void
}

export function CreatePage({ tasks, setTasks, goToListPage }: CreatePageProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [modal, setModal] = useState(false)

  const COLORS = ["#DC2127", "#7AE7BF", "#A4BDFC", "#FF887C"]
  const toggleModal = () => setModal((prev) => !prev)

  useEffect(() => {
    const saved = loadTasks()
    setTasks(saved)
  }, [])

  function addTask(task: Omit<Task, "id">) {
    const newTask: Task = { id: crypto.randomUUID(), ...task }
    const updatedTask = [...tasks, newTask]
    setTasks((prev) => [...prev, newTask])
    saveTasks(updatedTask)
  }

  return (
    <div className={styles.containerChild}>
      <div>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Insert Task Title"
        id="title"
      />

      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your text"
        id="description"
      />
      </div>

      <Button onClick={toggleModal} />

      {modal && (
        <Modal
          colors={COLORS}
          onSelect={(color) => {
            if (title.trim() === "") {
              alert("Por favor digite um título para criar uma tarefa")
              return
            }

            if (description.trim() === "") {
              alert("Por favor digite uma descrição para criar uma tarefa")
              return
            }

            addTask({ title, description, color })
            setTitle("")
            setDescription("")
            toggleModal()

            goToListPage()
          }}
        />
      )}
    </div>
  )
}
