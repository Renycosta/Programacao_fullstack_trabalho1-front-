import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { useUsuarioStore } from "./context/UsuarioContext"

type Inputs = {
  Email: string
  Senha: string
  manter: boolean
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Login() {
  const {
    register,
    handleSubmit
  } = useForm<Inputs>({
    defaultValues: {
      manter: false
    }
  })

  const { logaUsuario } = useUsuarioStore()

  const navigate = useNavigate()

  async function verificaLogin(data: Inputs) {
      try {
          const responseUsuario = await fetch(`${apiUrl}/usuarios/login`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  Email: data.Email,
                  Senha: data.Senha
              })
          })

          const dadosUsuario = await responseUsuario.json()

          console.log("STATUS LOGIN:", responseUsuario.status)
          console.log("RESPOSTA LOGIN:", dadosUsuario)

          if (responseUsuario.ok) {

              logaUsuario(dadosUsuario)

              if (data.manter) {
                  localStorage.setItem(
                      "usuarioKey",
                      String(dadosUsuario.IdUsuario)
                  )
              } else {
                  localStorage.removeItem("usuarioKey")
              }

              toast.success("Login realizado com sucesso!")
              navigate("/")

              return
          }

          toast.error(
              dadosUsuario?.erro ||
              "Login ou senha incorretos"
          )

      } catch (error) {

          console.error("Erro no login:", error)

          toast.error(
              "Não foi possível conectar ao servidor"
          )
      }
  }

  return (
    <section className="min-h-screen bg-stone-950">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-10">
        <div className="w-full bg-stone-900 border border-stone-800 rounded-lg shadow-xl sm:max-w-md">
          <div className="p-6 space-y-5 sm:p-8">
            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-4 w-14 h-14 rounded-lg bg-amber-900/40 border border-amber-800">
                <span className="text-3xl">
                  📖
                </span>
              </div>
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-amber-100 md:text-3xl">
                Bem-vindo de volta
              </h1>
              <p className="mt-2 text-sm text-stone-400">
                Entre na sua conta para continuar.
              </p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit(verificaLogin)}>
              <div>
                <label htmlFor="Email" className="block mb-2 text-sm font-medium text-stone-200">
                  Seu e-mail
                </label>
                <input type="email" id="Email" className="bg-stone-950 border border-stone-700 text-stone-200 placeholder-stone-500 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-700 outline-none block w-full p-2.5" placeholder="seu@email.com" required {...register("Email")}/>
              </div>
              <div>
                <label htmlFor="Senha" className="block mb-2 text-sm font-medium text-stone-200">
                  Senha de acesso
                </label>
                <input type="password" id="Senha" className="bg-stone-950 border border-stone-700 text-stone-200 placeholder-stone-500 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-700 outline-none block w-full p-2.5" placeholder="••••••••" required {...register("Senha")}/>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember" type="checkbox" className="w-4 h-4 border border-stone-700 rounded bg-stone-950 focus:ring-2 focus:ring-amber-800" {...register("manter")}/>
                  <label htmlFor="remember" className="ml-3 text-sm text-stone-400">
                    Manter conectado
                  </label>
                </div>
                <Link to="#" className="text-sm font-medium text-amber-500 hover:text-amber-400 hover:underline">
                  Esqueceu sua senha?
                </Link>
              </div>
              <button type="submit" className="w-full text-stone-100 bg-amber-900 hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-amber-950 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors">
                Entrar
              </button>
              <p className="text-sm text-center font-light text-stone-400">
                Ainda não possui conta?{" "}
                <Link to="/cadUsuario" className="font-medium text-amber-500 hover:text-amber-400 hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}