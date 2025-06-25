import styles from "./styles.module.css"

import exitimg from "../../assets/exit.svg"

type Props = {
  colors: string[]
  valueTitle: string
  valueDescription: string
  onSelect: (color: string) => void
  onChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeDescription: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  editTask: () => void
  closeEdit: () => void
  valueColor: string

}

export function EditTask({
  colors,
  onSelect,
  onChangeTitle,
  onChangeDescription,
  editTask,
  closeEdit,
  valueTitle,
  valueDescription,
  valueColor
}: Props) {
 
  return (
    <div className={styles.container}>
      <header>
        <button className={styles.exitButton} onClick={closeEdit}><img src={exitimg} alt="" /></button>
        <h3 className={styles.editTaskTitle}>Editar tarefa</h3>
      </header>
      <div className={styles.formContainer}>
        <div className={styles.titleContainer} >
          <p>Título</p>
          <input maxLength={15} className={styles.inputText} value={valueTitle} type="text" onChange={onChangeTitle}/>
        </div>
        <div className={styles.descriptionContainer}>
          <p>Descrição</p>
          <textarea maxLength={200} value={valueDescription}className={styles.textAreaDescription} onChange={onChangeDescription}></textarea>
        </div>
        <div className={styles.colorContainer}>
          <p>Cor</p>
          {colors.map((color) => {
            return (
              <button
                className={styles.item}
                key={color}
                onClick={() => onSelect(color)}
                style={{
                  background: color,
                  outline:
                    valueColor === color ? "5px solid grey" : "none",
                }}
              ></button>
            )
          })}
        </div>
      </div>
      <button className={styles.saveTasks} onClick={editTask}>Salvar</button>
    </div>
  )
}
