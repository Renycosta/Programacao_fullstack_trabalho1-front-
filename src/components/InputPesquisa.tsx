import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { ProdutoType } from "../utils/ProdutoType"

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
    termo: string
}

type InputPesquisaProps = {
    setProdutos: React.Dispatch<
        React.SetStateAction<ProdutoType[]>
    >
}

export function InputPesquisa({
    setProdutos
}: InputPesquisaProps) {

    const {
        register,
        handleSubmit
    } = useForm<Inputs>()

    async function enviaPesquisa(data: Inputs) {

        const termo = data.termo.trim()

        if (termo.length < 2) {
            toast.error("Informe, no mínimo, 2 caracteres")
            return
        }

        try {

            const url =
                `${apiUrl}/produtos/pesquisa/${encodeURIComponent(termo)}`

            console.log("Pesquisando:", url)

            const response = await fetch(url)

            if (!response.ok) {

                console.error(
                    "Status da pesquisa:",
                    response.status
                )

                toast.error("Erro ao realizar pesquisa")
                return
            }

            const dados: ProdutoType[] =
                await response.json()

            console.log(
                "Resultado da pesquisa:",
                dados
            )

            if (dados.length === 0) {
                toast.info("Nenhum livro encontrado")
            }

            setProdutos(dados)

        } catch (error) {

            console.error(
                "Erro ao realizar pesquisa:",
                error
            )

            toast.error(
                "Não foi possível realizar a pesquisa"
            )
        }
    }

    return (
        <div className="flex mx-auto max-w-5xl mt-4 px-3">

            <form
                className="flex-1"
                onSubmit={handleSubmit(enviaPesquisa)}
            >

                <label
                    htmlFor="pesquisa-livro"
                    className="mb-2 text-sm font-medium text-stone-300 sr-only"
                >
                    Pesquisar livros
                </label>

                <div className="relative">

                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">

                        <svg
                            className="w-5 h-5 text-stone-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>

                    </div>

                    <input
                        type="search"
                        id="pesquisa-livro"
                        className="block w-full p-4 ps-12 pe-32 text-sm text-stone-200 border border-stone-700 rounded-lg bg-stone-900 placeholder-stone-500 focus:ring-2 focus:ring-amber-800 focus:border-amber-700 outline-none"
                        placeholder="Pesquise por título ou autor..."
                        {...register("termo")}
                    />

                    <button
                        type="submit"
                        className="text-stone-100 absolute end-2.5 bottom-2.5 bg-amber-900 hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-amber-950 font-medium rounded-lg text-sm px-4 py-2 transition-colors"
                    >
                        Pesquisar
                    </button>

                </div>

            </form>

        </div>
    )
}