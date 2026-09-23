import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { useUsuarioStore } from "./context/UsuarioContext.ts"

const schema = z
  .object({
    Nome: z
      .string()
      .min(10, "Nome deve possuir, no mínimo, 10 caracteres")
      .max(45, "Nome deve possuir, no máximo, 45 caracteres")
      .refine(
        (nome) => nome.trim().split(" ").length >= 2,
        "Informe nome e sobrenome"
      ),

    Telefone: z
      .string()
      .min(10, "Telefone deve possuir, no mínimo, 10 caracteres")
      .max(45, "Telefone deve possuir, no máximo, 45 caracteres"),

    Email: z
      .email("Informe um e-mail válido")
      .toLowerCase(),

    CPF: z
      .string()
      .length(11, "CPF deve possuir 11 caracteres"),

    Data_nasc: z
      .string()
      .min(1, "Informe sua data de nascimento"),

    Senha: z
      .string()
      .min(8, "A senha deve possuir, no mínimo, 8 caracteres")
      .regex(/[a-z]/, "A senha deve possuir letra minúscula")
      .regex(/[A-Z]/, "A senha deve possuir letra maiúscula")
      .regex(/[0-9]/, "A senha deve possuir número")
      .regex(/[!@#$%^&*]/, "A senha deve possuir símbolo"),

    Senha2: z
      .string()
  })
  .refine((data) => data.Senha === data.Senha2, {
    message: "As senhas não coincidem",
    path: ["Senha2"]
  })

type FormData = z.infer<typeof schema>

function CadUsuario() {
  const navigate = useNavigate()

  const { logaUsuario } = useUsuarioStore()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const apiUrl = import.meta.env.VITE_API_URL

  async function onSubmit(data: FormData) {
    try {
      const response = await fetch(`${apiUrl}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Nome: data.Nome,
          Telefone: data.Telefone,
          Email: data.Email,
          CPF: data.CPF,
          Data_nasc: data.Data_nasc,
          Senha: data.Senha
        })
      })

      const responseData = await response.json()

      if (response.status === 201) {
        /*
         * O backend deve retornar:
         *
         * {
         *   usuario: {
         *      IdUsuario,
         *      Nome,
         *      Telefone,
         *      Email,
         *      CPF,
         *      Data_nasc
         *   }
         * }
         */

        logaUsuario(responseData.usuario)

        toast.success("Cadastro realizado com sucesso!")

        setTimeout(() => {
          navigate("/")
        }, 1000)

        return
      }

      if (responseData.erro === "E-mail já cadastrado") {
        setError("Email", {
          type: "manual",
          message: "Este e-mail já está cadastrado"
        })

        return
      }

      if (
        typeof responseData.erro === "string" &&
        responseData.erro.toLowerCase().includes("cpf")
      ) {
        setError("CPF", {
          type: "manual",
          message: responseData.erro
        })

        return
      }

      if (typeof responseData.erro === "string") {
        toast.error(responseData.erro)
      } else {
        toast.error("Erro ao realizar cadastro")
      }

    } catch (error) {
      console.error(error)
      toast.error("Erro ao conectar com o servidor")
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
                Criar sua conta
                </h1>

                <p className="mt-2 text-sm text-stone-400">
                Cadastre-se para começar a aproveitar a nossa livraria.
                </p>

            </div>

            <form
                className="space-y-5"
                onSubmit={handleSubmit(onSubmit)}
            >

                {/* Nome */}
                <div>
                <label
                    htmlFor="Nome"
                    className="block mb-2 text-sm font-medium text-stone-200"
                >
                    Nome completo
                </label>

                <input
                    type="text"
                    id="Nome"
                    placeholder="Seu nome completo"
                    className="bg-stone-950 border border-stone-700 text-stone-200 placeholder-stone-500 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-700 outline-none block w-full p-2.5"
                    {...register("Nome")}
                />

                {errors.Nome && (
                    <p className="mt-1 text-sm text-red-400">
                    {errors.Nome.message}
                    </p>
                )}
                </div>

                {/* Telefone */}
                <div>
                <label
                    htmlFor="Telefone"
                    className="block mb-2 text-sm font-medium text-stone-200"
                >
                    Telefone
                </label>

                <input
                    type="text"
                    id="Telefone"
                    placeholder="(00) 00000-0000"
                    className="bg-stone-950 border border-stone-700 text-stone-200 placeholder-stone-500 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-700 outline-none block w-full p-2.5"
                    {...register("Telefone")}
                />

                {errors.Telefone && (
                    <p className="mt-1 text-sm text-red-400">
                    {errors.Telefone.message}
                    </p>
                )}
                </div>

                {/* E-mail */}
                <div>
                <label
                    htmlFor="Email"
                    className="block mb-2 text-sm font-medium text-stone-200"
                >
                    Seu e-mail
                </label>

                <input
                    type="email"
                    id="Email"
                    placeholder="seu@email.com"
                    className="bg-stone-950 border border-stone-700 text-stone-200 placeholder-stone-500 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-700 outline-none block w-full p-2.5"
                    {...register("Email")}
                />

                {errors.Email && (
                    <p className="mt-1 text-sm text-red-400">
                    {errors.Email.message}
                    </p>
                )}
                </div>

                {/* CPF */}
                <div>
                <label
                    htmlFor="CPF"
                    className="block mb-2 text-sm font-medium text-stone-200"
                >
                    CPF
                </label>

                <input
                    type="text"
                    id="CPF"
                    maxLength={11}
                    placeholder="00000000000"
                    className="bg-stone-950 border border-stone-700 text-stone-200 placeholder-stone-500 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-700 outline-none block w-full p-2.5"
                    {...register("CPF")}
                />

                {errors.CPF && (
                    <p className="mt-1 text-sm text-red-400">
                    {errors.CPF.message}
                    </p>
                )}
                </div>

                {/* Data de nascimento */}
                <div>
                <label
                    htmlFor="Data_nasc"
                    className="block mb-2 text-sm font-medium text-stone-200"
                >
                    Data de nascimento
                </label>

                <input
                    type="date"
                    id="Data_nasc"
                    className="bg-stone-950 border border-stone-700 text-stone-200 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-700 outline-none block w-full p-2.5"
                    {...register("Data_nasc")}
                />

                {errors.Data_nasc && (
                    <p className="mt-1 text-sm text-red-400">
                    {errors.Data_nasc.message}
                    </p>
                )}
                </div>

                {/* Senha */}
                <div>
                <label
                    htmlFor="Senha"
                    className="block mb-2 text-sm font-medium text-stone-200"
                >
                    Senha
                </label>

                <input
                    type="password"
                    id="Senha"
                    placeholder="••••••••"
                    className="bg-stone-950 border border-stone-700 text-stone-200 placeholder-stone-500 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-700 outline-none block w-full p-2.5"
                    {...register("Senha")}
                />

                {errors.Senha && (
                    <p className="mt-1 text-sm text-red-400">
                    {errors.Senha.message}
                    </p>
                )}
                </div>

                {/* Confirmar senha */}
                <div>
                <label
                    htmlFor="Senha2"
                    className="block mb-2 text-sm font-medium text-stone-200"
                >
                    Confirmar senha
                </label>

                <input
                    type="password"
                    id="Senha2"
                    placeholder="••••••••"
                    className="bg-stone-950 border border-stone-700 text-stone-200 placeholder-stone-500 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-700 outline-none block w-full p-2.5"
                    {...register("Senha2")}
                />

                {errors.Senha2 && (
                    <p className="mt-1 text-sm text-red-400">
                    {errors.Senha2.message}
                    </p>
                )}
                </div>

                {/* Botão */}
                <button
                type="submit"
                className="w-full text-stone-100 bg-amber-900 hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-amber-950 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
                >
                Criar conta
                </button>

                {/* Login */}
                <p className="text-sm text-center font-light text-stone-400">
                Já possui uma conta?{" "}

                <a
                    href="/login"
                    className="font-medium text-amber-500 hover:text-amber-400 hover:underline"
                >
                    Entrar
                </a>
                </p>

            </form>

            </div>

        </div>

        </div>

    </section>
    )
}

export default CadUsuario