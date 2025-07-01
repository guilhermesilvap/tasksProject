import styles from "./styles.module.css"
import taskimg from "../../assets/task.svg"
import plusimg from "../../assets/plus.svg"
import concludedtasks from "../../assets/concluded-tasks.svg"
import taskslist from "../../assets/tasks-list.svg"
import completetask from "../../assets/complete.svg"
import type { Task } from "../../types/typing"
import { useState } from "react"
import { Modal } from "../Modal"
import { loadTasks, saveTasks } from "../../utils/storage"
import {
  saveConcludedTasks,
  loadConcludedTasks,
} from "../../utils/concludeTasksStorage"
import { useEffect } from "react"
import { EditTask } from "../Edit Task"

export function ListTasks() {
  const COLORS = ["#DC2127", "#7AE7BF", "#A4BDFC", "#FF887C"]

  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [color, setColor] = useState<string>("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedTasks, setCompletedTasks] = useState<Task[]>([])
  const [modal, setModal] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [toggleTasks, setToggleTasks] = useState<
    "activeTasks" | "concludedTasks"
  >("activeTasks")

  useEffect(() => {
    const tasksCompletedSaved = loadConcludedTasks()
    const saved = loadTasks()
    setTasks(saved)
    setCompletedTasks(tasksCompletedSaved)
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

  function addCompleteTask(taskID: string) {
    const confirm = window.confirm("Você está concluindo a tarefa selecionada, deseja confirmar?")
    const newCompletedTask: Task | undefined = tasks.find(
      (task) => task.id === taskID
    )

    if (!newCompletedTask) {
      return
    }
    const updatedTasks: Task[] = [...completedTasks, newCompletedTask]
    if (confirm) {
      const deleteTaskfromTasks = tasks.filter(
        (task: Task) => task.id !== taskID
      )

      setTasks(deleteTaskfromTasks)
      saveTasks(deleteTaskfromTasks)

      setCompletedTasks(updatedTasks)
      saveConcludedTasks(updatedTasks)
    }
  }

  function handleSaveEdit() {
    if (!editingTask) return

    if (description.length === 0 || title.length === 0 || color.length === 0) {
      return alert("Preencha todos os campos para salvar a edição")
    }

    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id ? { ...task, title, description, color } : task
    )

    setTasks(updatedTasks)
    saveTasks(updatedTasks)

    setEditingTask(null)
    setTitle("")
    setDescription("")
    setColor("")
    setOpenEdit(!openEdit)
  }

  function deleteTask(taskID: string) {
    const confirm = window.confirm(
      "Você tem certeza que gostaria de deletar essa task?"
    )
    if (!confirm) {
      return
    }

    const updatedTasks = tasks.filter((task: Task) => task.id !== taskID)

    setTasks(updatedTasks)
    saveTasks(updatedTasks)
    setOpenEdit(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContent}>
        <h2>MyTasks</h2>
        {toggleTasks === "activeTasks" ? (
          <button
            onClick={() => setToggleTasks("concludedTasks")}
            className={styles.concludedTasksButton}
          >
            <img src={concludedtasks} alt="Acessar tarefas concluídas" />
          </button>
        ) : (
          <button
            onClick={() => setToggleTasks("activeTasks")}
            className={styles.tasksListButton}
          >
            <img src={taskslist} alt="Acessar tarefas ativas" />
          </button>
        )}
      </div>

      {tasks.length > 0 && toggleTasks == "activeTasks" ? (
        <h3 className={styles.subtitle}>Tarefas ativas</h3>
      ) : (
        <></>
      )}

      {completedTasks.length > 0 && toggleTasks === "concludedTasks" ? (
        <h3 className={styles.subtitle}>Tarefas concluídas</h3>
      ) : (
        <></>
      )}

      {completedTasks.length === 0 && toggleTasks === "concludedTasks" ? (
        <p className={styles.noTasks}>
          Você ainda não concluiu nenhuma tarefa. Finalize uma para visualizá-la
          nesta seção.
        </p>
      ) : (
        <></>
      )}

      {tasks.length === 0 && toggleTasks === "activeTasks" ? (
        <p className={styles.noTasks}>
          Nenhuma tarefa criada ainda. Comece a organizar seu dia adicionando
          sua primeira tarefa!
        </p>
      ) : (
        <></>
      )}
      {toggleTasks === "activeTasks"
        ? tasks.map((task) => (
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
              <button
                onClick={() => addCompleteTask(task.id)}
                id={task.id}
                className={styles.buttonComplete}
              >
                <img src={completetask} alt="Clique para finalizar a tarefa" />
              </button>
            </div>
          ))
        : completedTasks.map((task) => (
            <div className={styles.cardTasks}>
              <div key={task.id} className={styles.contentContainer}>
                <div
                  className={styles.colorIndicator}
                  style={{ background: "#009000" }}
                ></div>
                <div className={styles.completedTaskContent}>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                </div>
              </div>
            </div>
          ))}
      <button onClick={handleModal} className={styles.buttonContainer}>
        <img src={plusimg} alt="Adicione uma nova tarefa" />
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

            addTask({ description, title, color, status })
            setTitle("")
            setDescription("")
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
          deleteTask={() => {
            if (!editingTask) return
            deleteTask(editingTask.id)
          }}
          valueTitle={title}
          valueDescription={description}
          onSelect={(color) => {
            setColor(color)
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
