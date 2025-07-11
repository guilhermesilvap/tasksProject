import { useState } from "react"
import { useNavigate } from "react-router"
import back from "../../../assets/back.svg"
import styles from "./styles.module.css"
import { z, ZodError } from "zod"
import { api } from "../../../api/api"
import { AxiosError } from "axios"

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Digite um nome com pelo menos dois caracteres" }),
    email: z.string().email({ message: "Digite um e-mail válido" }),
    password: z
      .string()
      .min(6, { message: "Digite uma senha com pelo menos 6 caractteres" }),
  })
 
export function SignUp() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const navigate = useNavigate()
 

 async function onSubmit(e: React.FormEvent) {
  e.preventDefault()
    try {
      const data = signUpSchema.parse({name, password, email})
      
      await api.post("/users", data) 

      if(confirm("Cadastro efetuado com sucesso!, Ir para tela de Login?")){
        navigate("/")
      }

    } catch (error) {
      if(error instanceof ZodError){
        setErrorMsg(error.issues[0].message)
        console.log(errorMsg)
      }
      if(error instanceof AxiosError){
        setErrorMsg(error.response?.data.message)
      }
    }
  }

  function handleBack() {
    navigate("/")
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <img className={styles.exitButton} onClick={handleBack} src={back} alt="botão de voltar" />
        <h2>MyTasks</h2>
      </div>
      <h3>Faça o seu cadastro abaixo:</h3>
      <form className={styles.form} onSubmit={onSubmit}>
        <legend>Nome completo</legend>
        <input
          type="text"
          placeholder="Guilherme Silva"
          onChange={(e) => setName(e.target.value)}
        />
        <legend>Email</legend>
        <input
          type="email"
          placeholder="example@email.com"
          onChange={(e) => setEmail(e.target.value)}
        />

        <legend>Senha</legend>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="123456"
        />
        {errorMsg && <p className={styles.errorMsg} style={{ color: "red" }}>{errorMsg}</p>}
        <button className={styles.createButton}>Cadastrar</button>
      </form>
    </div>
  )
}
