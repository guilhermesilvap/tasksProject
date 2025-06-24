import styles from "./app.module.css"
import { ListTasks } from "./components/Tasks Page"

function App() {
  return (
    <div className={styles.container}>
      <ListTasks />
    </div>
  )
}

export default App
