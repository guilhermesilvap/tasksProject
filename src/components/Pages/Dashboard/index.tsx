import styles from "./styles.module.css"
import taskimg from "../../../assets/task.svg"
import plusimg from "../../../assets/plus.svg"
import concludedtasks from "../../../assets/concluded-tasks.svg"
import taskslist from "../../../assets/tasks-list.svg"
import completetask from "../../../assets/complete.svg"
import logoutImg from "../../../assets/logout.svg"
import { useAuth } from "../../../hooks/UseAuth"
import { api } from "../../../api/api"
import type { Task } from "../../../types/typing"
import { useState } from "react"
import { Modal } from "../../Modal"
import { useNavigate } from "react-router"
import { useEffect } from "react"
import { EditTask } from "../../Edit Task"
import { z, ZodError } from "zod"
import { AxiosError } from "axios"

const taskSchema = z.object({
  title: z.string(),
  description: z.string(),
  color: z.string(),
})

const colorsMap: Record<string, string> = {
  red: "#DC2127",
  green: "#7AE7BF",
  blue: "#A4BDFC",
  orange: "#FF887C",
}

export function ListTasks() {
  const COLORS = ["#DC2127", "#7AE7BF", "#A4BDFC", "#FF887C"]
  const navigate = useNavigate()

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
  const [errorMsg, setErrorMsg] = useState("")
  const auth = useAuth()

  useEffect(() => {
    loadCompletedTasks()
    loadTasks()
  }, [])

  async function loadTasks() {
    const response = await api.get("/tasks?status=pending")

    setTasks(response.data)
  }

  async function logout() {
    auth.logout()

    navigate("/")
  }

  async function loadCompletedTasks() {
    const response = await api.get("/tasks?status=completed")

    setCompletedTasks(response.data)
  }

  async function handleEdit(taskID: string) {
    setOpenEdit(true)
    const taskToEdit = tasks.find((task) => task.id === taskID)

    if (!taskToEdit) {
      return
    }
    setEditingTask(taskToEdit)
    setColor(taskToEdit.color)
    setTitle(taskToEdit.title)
    setDescription(taskToEdit.description)
  }

  async function editTask() {
    const data = taskSchema.parse({ title, description, color })
    if (!editingTask) {
      return
    }

    console.log(data)
    await api.put(`/tasks/${editingTask?.id}`, data)
    setOpenEdit(false)
    navigate(0)
  }

  function handleModal() {
    setModal(!modal)
  }

  function addTask() {
    try {
      const data = taskSchema.parse({ title, description, color })
      console.log(data)
      api.post("/tasks", data)
    } catch (error) {
      if (error instanceof ZodError) {
        setErrorMsg(error.issues[0].message)
      }

      if (error instanceof AxiosError) {
        setErrorMsg(error.response?.data.message)
      }
    }
    navigate(0)
  }

  async function addCompleteTask(taskID: string) {
    const confirm = window.confirm(
      "Você está concluindo a tarefa selecionada, deseja confirmar?"
    )

    const data = {
      status: "completed",
    }

    if (confirm) {
      await api.put(`/tasks/${taskID}`, data)
    }

    navigate(0)
  }

  async function deleteTask(taskID: string) {
    const confirm = window.confirm(
      "Você tem certeza que gostaria de deletar essa task?"
    )
    if (!confirm) {
      return
    }

    await api.delete(`/tasks/${taskID}`)

    loadTasks()

    setOpenEdit(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContent}>
        <h2>MyTasks</h2>
        <div className={styles.buttonsHeaderContainer}>
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
          <button onClick={() => logout()} className={styles.logoutButton}>
            <img src={logoutImg} alt="" />
          </button>
        </div>
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
      <div className={styles.listContainer}>
      {toggleTasks === "activeTasks"
        ? tasks.map((task) => (
            <div className={styles.cardTasks} key={task.id}>
              <div key={task.id} className={styles.contentContainer}>
                <div
                  className={styles.colorIndicator}
                  style={{ background: colorsMap[task.color] }}
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
            <div className={styles.cardTasks} key={task.id}>
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
        </div>
      <button onClick={handleModal} className={styles.buttonContainer}>
        <img src={plusimg} alt="Adicione uma nova tarefa" />
      </button>
      {modal && (
        <Modal
          closeModal={handleModal}
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

            addTask()
            setTitle("")
            setDescription("")
            setColor("")
            handleModal()
          }}
          onSelect={(selectedColor) => {
            switch (selectedColor) {
              case "#DC2127":
                selectedColor = "red"
                break
              case "#7AE7BF":
                selectedColor = "green"
                break
              case "#A4BDFC":
                selectedColor = "blue"
                break
              case "#FF887C":
                selectedColor = "orange"

                break
              default:
                break
            }

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
            switch (color) {
              case "#DC2127":
                setColor("red")
                break
              case "#7AE7BF":
                setColor("green")
                break
              case "#A4BDFC":
                setColor("blue")
                break
              case "#FF887C":
                setColor("orange")
                break

              default:
                break
            }
          }}
          valueColor={colorsMap[color]}
          colors={COLORS}
          onChangeDescription={(e) => setDescription(e.target.value)}
          onChangeTitle={(e) => setTitle(e.target.value)}
          editTask={() => {
            editTask()
          }}
          closeEdit={() => setOpenEdit(!openEdit)}
        />
      )}
    </div>
  )
}
