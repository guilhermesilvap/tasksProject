import { useState } from 'react'

import type { Task } from './types/typing'
import styles from "./app.module.css"
import { ListTasks } from './components/Tasks Page'

function App() {
 
    const [tasks, setTasks] = useState<Task[]>([])
    const [modal, setModal] = useState<Task[]>([])


  return (

    <div className={styles.container}>
      
      

     
 <ListTasks/> 
       

    </div>      
    
  )
}

export default App
