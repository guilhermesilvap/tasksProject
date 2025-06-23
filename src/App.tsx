import { useState } from 'react'

import type { Task } from './types/typing'
import styles from "./app.module.css"
import { CreatePage } from './components/Create Page'
import { ListTasks } from './components/Tasks Page'


function App() {
 
  const [page, setPage] = useState<"create" | "list">("create")
  const [tasks, setTasks] = useState<Task[]>([])

  return (

    <div className={styles.container}>
      
      {page === "create" && (
        <CreatePage
          tasks={tasks}
          setTasks={setTasks}
          goToListPage={() => setPage("list")}
        />
      )}

      {page === "list" && (
        <ListTasks
          tasks={tasks}
          goToCreatePage={() => setPage("create")}
        />
      )}
    </div>      
    
  )
}

export default App
