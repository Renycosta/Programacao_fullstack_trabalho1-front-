import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({

    Nome: z.string()
        .min(6, "Nome deve ter pelo menos 6 caracteres")
        .max(45, "Nome deve ter no máximo 45 caracteres")
        .refine(value => value.includes(" "), {
            message: "Informe o nome completo (nome e sobrenome)"
        }),

    Telefone: z.string()
        .min(10, "Telefone inválido")
        .max(45, "Telefone inválido"),

    Email: z.email("Formato de email inválido")
        .toLowerCase(),

    CPF: z.string()
        .regex(/^\d{11}$/, "CPF deve conter 11 números"),

    Data_nasc: z.string()
        .min(1, "Informe sua data de nascimento"),

    Senha: z.string()
        .min(8, "Senha deve ter pelo menos 8 caracteres")
        .regex(/[a-z]/, "Senha deve conter, no mínimo, uma letra minúscula")
        .regex(/[A-Z]/, "Senha deve conter, no mínimo, uma letra maiúscula")
        .regex(/[0-9]/, "Senha deve conter, no mínimo, um número")
        .regex(/[!@#$%^&*]/, "Senha deve conter, no mínimo, um caractere especial"),

    Senha2: z.string()

}).refine(data => data.Senha === data.Senha2, {
    message: "Senhas não coincidem",
    path: ["Senha2"]
})

type FormData = z.infer<typeof schema>

const apiUrl = import.meta.env.VITE_API_URL

export default function CadUsuario() {

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    const navigate = useNavigate()

    async function cadastraUsuario(data: FormData) {

        try {

            const response = await fetch(`${apiUrl}/usuarios`, {

                headers: {
                    "Content-Type": "application/json"
                },

                method: "POST",

                body: JSON.stringify({

                    Nome: data.Nome,
                    Telefone: data.Telefone,
                    Email: data.Email,
                    CPF: data.CPF,
                    Data_nasc: data.Data_nasc,
                    Senha: data.Senha

                })

            })

            if (response.status === 201) {

                toast.success("Cadastro realizado com sucesso!")

                setTimeout(() => {
                    navigate("/login")
                }, 3000)

            } else {

                const responseData = await response.json()

                console.log(responseData)

                if (responseData.erro === "E-mail já cadastrado") {

                    setError("Email", {
                        type: "server",
                        message: responseData.erro
                    })

                    toast.error(responseData.erro)

                    return
                }

                toast.error(
                    responseData.erro || "Erro ao realizar cadastro"
                )
            }

        } catch (error) {

            console.error(error)

            toast.error("Não foi possível realizar o cadastro")
        }
    }

    return (

        <section className="min-h-screen bg-stone-950">

            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-10">

                <div className="w-full bg-stone-900 border border-stone-800 rounded-lg shadow-xl sm:max-w-lg">

                    <div className="p-6 space-y-5 sm:p-8">

                        <div className="text-center">

                            <div className="flex items-center justify-center mx-auto mb-4 w-14 h-14 rounded-lg bg-amber-900/40 border border-amber-800">

                                <span className="text-3xl">
                                    📖
                                </span>

                            </div>

                            <h1 className="text-2xl font-bold leading-tight tracking-tight text-amber-100 md:text-3xl">
                                Crie sua conta
                            </h1>

                            <p className="mt-2 text-sm text-stone-400">
                                Cadastre-se para começar a explorar nossos livros.
                            </p>

                        </div>

                        <form
                            className="space-y-4"
                            onSubmit={handleSubmit(cadastraUsuario)}
                        >

                            <div>

                                <label
                                    htmlFor="Nome"
                                    className="block mb-2 text-sm font-medium text-stone-300"
                                >
                                    Nome completo:
                                </label>

                                <input
                                    type="text"
                                    id="Nome"
                                    placeholder="Seu nome completo"
                                    className="bg-stone-800 border border-stone-700 text-stone-100 text-sm rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-700 block w-full p-2.5 placeholder-stone-500 outline-none"
                                    {...register("Nome")}
                                />

                                {errors.Nome && (
                                    <p
                                        role="alert"
                                        className="mt-1 text-sm text-red-400"
                                    >
                                        {errors.Nome.message}
                                    </p>
                                )}

                            </div>

                            <div>

                                <label
                                    htmlFor="Telefone"
                                    className="block mb-2 text-sm font-medium text-stone-300"
                                >
                                    Telefone:
                                </label>

                                <input
                                    type="tel"
                                    id="Telefone"
                                    placeholder="(00) 00000-0000"
                                    className="bg-stone-800 border border-stone-700 text-stone-100 text-sm rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-700 block w-full p-2.5 placeholder-stone-500 outline-none"
                                    {...register("Telefone")}
                                />

                                {errors.Telefone && (
                                    <p
                                        role="alert"
                                        className="mt-1 text-sm text-red-400"
                                    >
                                        {errors.Telefone.message}
                                    </p>
                                )}

                            </div>

                            <div>

                                <label
                                    htmlFor="Email"
                                    className="block mb-2 text-sm font-medium text-stone-300"
                                >
                                    E-mail:
                                </label>

                                <input
                                    type="email"
                                    id="Email"
                                    placeholder="nome@email.com"
                                    className="bg-stone-800 border border-stone-700 text-stone-100 text-sm rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-700 block w-full p-2.5 placeholder-stone-500 outline-none"
                                    {...register("Email")}
                                />

                                {errors.Email && (
                                    <p
                                        role="alert"
                                        className="mt-1 text-sm text-red-400"
                                    >
                                        {errors.Email.message}
                                    </p>
                                )}

                            </div>

                            <div>

                                <label
                                    htmlFor="CPF"
                                    className="block mb-2 text-sm font-medium text-stone-300"
                                >
                                    CPF:
                                </label>

                                <input
                                    type="text"
                                    id="CPF"
                                    placeholder="Somente números"
                                    maxLength={11}
                                    className="bg-stone-800 border border-stone-700 text-stone-100 text-sm rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-700 block w-full p-2.5 placeholder-stone-500 outline-none"
                                    {...register("CPF")}
                                />

                                {errors.CPF && (
                                    <p
                                        role="alert"
                                        className="mt-1 text-sm text-red-400"
                                    >
                                        {errors.CPF.message}
                                    </p>
                                )}

                            </div>

                            <div>

                                <label
                                    htmlFor="Data_nasc"
                                    className="block mb-2 text-sm font-medium text-stone-300"
                                >
                                    Data de nascimento:
                                </label>

                                <input
                                    type="date"
                                    id="Data_nasc"
                                    className="bg-stone-800 border border-stone-700 text-stone-100 text-sm rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-700 block w-full p-2.5 outline-none"
                                    {...register("Data_nasc")}
                                />

                                {errors.Data_nasc && (
                                    <p
                                        role="alert"
                                        className="mt-1 text-sm text-red-400"
                                    >
                                        {errors.Data_nasc.message}
                                    </p>
                                )}

                            </div>

                            <div>

                                <label
                                    htmlFor="Senha"
                                    className="block mb-2 text-sm font-medium text-stone-300"
                                >
                                    Senha:
                                </label>

                                <input
                                    type="password"
                                    id="Senha"
                                    placeholder="••••••••"
                                    className="bg-stone-800 border border-stone-700 text-stone-100 text-sm rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-700 block w-full p-2.5 placeholder-stone-500 outline-none"
                                    {...register("Senha")}
                                />

                                {errors.Senha && (
                                    <p
                                        role="alert"
                                        className="mt-1 text-sm text-red-400"
                                    >
                                        {errors.Senha.message}
                                    </p>
                                )}

                            </div>

                            <div>

                                <label
                                    htmlFor="Senha2"
                                    className="block mb-2 text-sm font-medium text-stone-300"
                                >
                                    Confirme a senha:
                                </label>

                                <input
                                    type="password"
                                    id="Senha2"
                                    placeholder="••••••••"
                                    className="bg-stone-800 border border-stone-700 text-stone-100 text-sm rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-700 block w-full p-2.5 placeholder-stone-500 outline-none"
                                    {...register("Senha2")}
                                />

                                {errors.Senha2 && (
                                    <p
                                        role="alert"
                                        className="mt-1 text-sm text-red-400"
                                    >
                                        {errors.Senha2.message}
                                    </p>
                                )}

                            </div>

                            <button
                                type="submit"
                                className="w-full text-stone-100 bg-amber-900 hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-amber-950 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
                            >
                                Criar sua conta
                            </button>

                            <p className="text-sm text-center font-light text-stone-400">

                                Já possui uma conta?{" "}

                                <Link
                                    to="/login"
                                    className="font-medium text-amber-500 hover:text-amber-400 hover:underline"
                                >
                                    Faça login
                                </Link>

                            </p>

                        </form>

                    </div>

                </div>

            </div>

        </section>

    )
}