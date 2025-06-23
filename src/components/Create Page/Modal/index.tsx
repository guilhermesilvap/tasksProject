import styles from "./styles.module.css"

type Props = {
  colors: string[];
  onSelect: (color: string) => void;
}



export function Modal({colors, onSelect}:Props){
    return(<div className={styles.container}>
        <h2>Pick accent color</h2>

        <div className={styles.grid}>  
             {colors.map((color) => {
                return(
                    <button className={styles.item} key={color} onClick={() => onSelect(color)} style={{background:color}}>
                    </button>
                )
             })}
        </div>  
        </div>
        
    )
}