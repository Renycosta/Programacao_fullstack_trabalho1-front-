import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useUsuarioStore } from "./context/UsuarioContext.ts"
import type { CompraType } from "./utils/CompraType"

const apiUrl = import.meta.env.VITE_API_URL

export default function MinhasCompras() {
    const navigate = useNavigate()

    const { usuario } = useUsuarioStore()

    const [compras, setCompras] = useState<CompraType[]>([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        if (!usuario?.IdUsuario) {
            setCarregando(false)
            return
        }

        async function buscarCompras() {
            try {
                const url =
                    `${apiUrl}/compras/usuario/${usuario?.IdUsuario}`

                console.log("Buscando compras:", url)

                const response = await fetch(url)

                if (!response.ok) {
                    toast.error("Erro ao buscar suas compras.")
                    return
                }

                const dados: CompraType[] = await response.json()

                setCompras(dados)
            } catch (error) {
                console.error(
                    "Erro ao buscar compras:",
                    error
                )

                toast.error(
                    "Não foi possível carregar suas compras."
                )
            } finally {
                setCarregando(false)
            }
        }

        buscarCompras()
    }, [usuario])

    function formatarData(data: Date | string) {
        return new Date(data).toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        )
    }

    function formatarValor(valor: number) {
        return Number(valor).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        )
    }

    if (!usuario) {
        return (
            <div className="min-h-screen bg-stone-950 py-10 px-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-amber-100 mb-8">
                        Minhas compras
                    </h1>
                    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-10 text-center">
                        <div className="text-5xl mb-4">
                            🛍️
                        </div>
                        <h2 className="text-xl font-bold text-stone-200 mb-2">
                            Você não está logado
                        </h2>
                        <p className="text-stone-400 mb-6">
                            Entre na sua conta para visualizar
                            suas compras.
                        </p>
                        <button onClick={() => navigate("/login")} className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-lg transition-colors">
                            Fazer login
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (carregando) {
        return (
            <div className="min-h-screen bg-stone-950 py-10 px-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-amber-100 mb-8">
                        Minhas compras
                    </h1>
                    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-10 text-center">
                        <p className="text-stone-400">
                            Carregando suas compras...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-stone-950 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-amber-100 mb-8">
                    Minhas compras
                </h1>
                {compras.length === 0 ? (
                    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-10 text-center">
                        <div className="text-5xl mb-4">
                            📚
                        </div>
                        <h2 className="text-xl font-bold text-stone-200 mb-2">
                            Você ainda não realizou nenhuma compra
                        </h2>
                        <p className="text-stone-400 mb-6">
                            Encontre um livro e faça sua primeira
                            compra.
                        </p>
                        <button onClick={() => navigate("/")} className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-lg transition-colors">
                            Ver livros
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {compras.map((compra) => (
                            <div key={compra.IdCompra} className="bg-stone-900 border border-stone-800 rounded-xl p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-stone-500">
                                            Compra
                                        </p>
                                        <h2 className="text-xl font-bold text-amber-100">
                                            #{compra.IdCompra}
                                        </h2>
                                    </div>
                                    <div>
                                        <p className="text-sm text-stone-500">
                                            Data da compra
                                        </p>
                                        <p className="text-stone-300">
                                            {formatarData(
                                                compra.Data_venda
                                            )}
                                        </p>
                                    </div>
                                    <div className="sm:text-right">
                                        <p className="text-sm text-stone-500">
                                            Total
                                        </p>
                                        <p className="text-xl font-bold text-amber-500">
                                            {formatarValor(
                                                compra.Valor_total
                                            )}
                                        </p>
                                    </div>

                                </div>
                                <div className="border-t border-stone-800 mt-5 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <p className="text-sm text-stone-400">
                                        Compra realizada com sucesso.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}