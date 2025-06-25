import styles from "./styles.module.css"
import taskimg from "../../assets/task.svg"
import plusimg from "../../assets/plus.svg"
import type { Task } from "../../types/typing"
import { useState } from "react"
import { Modal } from "../Modal"
import { loadTasks, saveTasks } from "../../utils/storage"
import { useEffect } from "react"
import { EditTask } from "../Edit Task"

export function ListTasks() {
  const COLORS = ["#DC2127", "#7AE7BF", "#A4BDFC", "#FF887C"]

  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [color, setColor] = useState<string>("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [modal, setModal] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    const saved = loadTasks()
    setTasks(saved)
  }, [])

  function handleEdit(taskID: string) {
    const taskToEdit = tasks.find((task) => task.id === taskID)

    if (taskToEdit) {
      setEditingTask(taskToEdit)
      setDescription(taskToEdit.description)
      setColor(taskToEdit.color)
      setTitle(taskToEdit.title)
      setOpenEdit(!openEdit)
    }
  }

  function handleModal() {
    setModal(!modal)
  }

  function addTask(task: Omit<Task, "id">) {
    const newTask: Task = { id: crypto.randomUUID(), ...task }
    const updatedTask = [...tasks, newTask]
    saveTasks(updatedTask)
    setTasks(updatedTask)

  }

  function handleSaveEdit() {
    if (!editingTask) return

    if(description.length === 0 || title.length === 0 || color.length === 0 ){
      return alert("Preencha todos os campos para salvar a edição")
    }

    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id ? { ...task, title, description, color } : task
    )

    setTasks(updatedTasks)
    saveTasks(updatedTasks)
     

     setEditingTask(null);
     setTitle("");
     setDescription("");
     setColor("")
     setOpenEdit(!openEdit)
  }

  return (
    <div className={styles.container}>
      <h2>MyTasks</h2>
       {tasks.length === 0 && 
           <p className={styles.noTasks}>Nenhuma tarefa criada ainda. Comece a organizar seu dia adicionando sua primeira tarefa!</p>
       }
      {tasks.map((task) => (
        <div className={styles.cardTasks}>
          <div key={task.id} className={styles.contentContainer}>
            <div
              className={styles.colorIndicator}
              style={{ background: task.color }}
            ></div>
            <div className={styles.taskContent}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
          </div>
          <button
            onClick={() => handleEdit(task.id)}
            id={task.id}
            className={styles.buttonEdit}
          >
            <img src={taskimg} alt="" />
          </button>
        </div>
      ))}
      <button onClick={handleModal} className={styles.buttonContainer}>
        <img src={plusimg} alt="" />
      </button>
      {modal && (
        <Modal
          createTask={() => {
            if (description === "") {
              return alert(
                "Complete o preenchimento das informações para criar uma tarefa"
              )
            }

            if (title === "") {
              return alert(
                "Complete o preenchimento das informações para criar uma tarefa"
              )
            }

            if (color === "") {
              return alert(
                "Complete o preenchimento das informações para criar uma tarefa"
              )
            }

            addTask({ description, title, color })
            setTitle("");
            setDescription("");
            setColor("")
            handleModal()
          }}
          onSelect={(selectedColor) => {
            setColor(selectedColor)
          }}
          onChangeDescription={(e) => setDescription(e.target.value)}
          onChangeTitle={(e) => setTitle(e.target.value)}
          colors={COLORS}
        />
      )}
      {openEdit && (
        <EditTask
          valueTitle={title}
          valueDescription={description}
          onSelect={(selectedColor) => {
            setColor(selectedColor)
          }}
          valueColor={color}
          colors={COLORS}
          onChangeDescription={(e) => setDescription(e.target.value)}
          onChangeTitle={(e) => setTitle(e.target.value)}
          editTask={handleSaveEdit}
          closeEdit={() => setOpenEdit(!openEdit)}
        />
      )}
    </div>
  )
}
