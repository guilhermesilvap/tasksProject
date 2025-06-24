import styles from "./styles.module.css"
import { useState } from "react"

type Props = {
  colors: string[]
  onSelect: (color: string) => void
  onChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeDescription: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  createTask: () => void
}

export function Modal({
  colors,
  onSelect,
  onChangeTitle,
  onChangeDescription,
  createTask,
}: Props) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const handleSelect = (color: string) => {
    setSelectedColor(color)
    onSelect(color)
  }
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <p>Título</p>
        <input maxLength={15} type="text" onChange={onChangeTitle} />
      </div>
      <div className={styles.textAreaContainer}>
        <p>Descrição</p>
        <textarea maxLength={70} onChange={onChangeDescription} />
      </div>

      <div className={styles.containerColor}>
        <p>Selecione a cor do marcador</p>
        <div>
          {colors.map((color) => {
            return (
              <button
                className={styles.item}
                key={color}
                onClick={() => handleSelect(color)}
                style={{
                  background: color,
                  outline:
                    selectedColor === color ? "5px solid grey" : "none",
                }}
              ></button>
            )
          })}
        </div>
      </div>
      <button onClick={createTask} className={styles.createButton}>
        Criar
      </button>
    </div>
  )
}
