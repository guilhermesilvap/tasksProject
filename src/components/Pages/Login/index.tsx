import { useState } from "react"
import styles from "./styles.module.css"
import { useNavigate } from "react-router"
import { useAuth } from "../../../hooks/UseAuth"
import { api } from "../../../api/api"
import { z, ZodError } from "zod"
import { AxiosError } from "axios"

const signInSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().trim().min(1, { message: "Informe a senha" }),
})

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const auth = useAuth()

  function handleRegister() {
    navigate("/register")
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const data = signInSchema.parse({ email, password })

      const response = await api.post("/sessions", data)

      auth.createSession(response.data)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        setErrorMsg(error.issues[0].message)
        console.log(errorMsg)
      }

      if (error instanceof AxiosError) {
        setErrorMsg(error.response?.data.message)
        console.log(errorMsg)
      }

      return { message: "Não foi possível entrar" }
    }
  }

  return (
    <div className={styles.container}>
      <h2>MyTasks</h2>
      <form className={styles.form} onSubmit={onSubmit}>
        <div>
          <legend>E-mail</legend>
          <input
            type="email"
            placeholder="example@email.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <legend>Senha</legend>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
          />
        </div>
        {errorMsg && (
          <p className={styles.errorMsg} style={{ color: "red" }}>
            {errorMsg}
          </p>
        )}
        <button className={styles.createButton}>Entrar</button>
      </form>
      <p>
        Para efetuar o cadastro, <a onClick={handleRegister}>clique aqui.</a>
      </p>
    </div>
  )
}
