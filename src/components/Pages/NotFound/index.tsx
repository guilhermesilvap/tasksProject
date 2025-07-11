import styles from "./styles.module.css"
export function NotFound(){
    return(
        
        <div className={styles.notFoundText}>
            <h1>
                Erro 404
            </h1>
            <h3>
                Conteúdo não encontrado
            </h3>
        </div>
        
    )
}
