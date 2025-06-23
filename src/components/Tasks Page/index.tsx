import styles from "./styles.module.css"
import task from "../../assets/task.svg"
import type { Task } from "../../types/typing"

interface TaskListPageProps {
  tasks: Task[]
  goToCreatePage: () => void
}

export function ListTasks({ tasks, goToCreatePage }: TaskListPageProps) {
  return (
    <div className={styles.container}>
      <h2>Tasks</h2>
      {tasks.map((task) => (
        <div key={task.id} className={styles.cardTasks}>
          <div className={styles.colorIndicator} style={{background:task.color}} ></div>
          <div className={styles.taskContent}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </div>
        </div>
      ))}
      <button onClick={goToCreatePage} className={styles.buttonContainer}>
        <img src={task} alt="" />
      </button>
    </div>
  )
}
