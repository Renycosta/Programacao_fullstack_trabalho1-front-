import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useUsuarioStore } from "./context/UsuarioContext.ts"

const apiUrl = import.meta.env.VITE_API_URL

type Produto = {
    IdProduto: number
    Nome: string
    Autor: string
    Valor: number
    Img?: string
}

type ItemCarrinho = Produto & {
    quantidade: number
}

export default function Carrinho() {
    const navigate = useNavigate()

    const { usuario } = useUsuarioStore()

    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])

    useEffect(() => {
        const carrinhoSalvo = localStorage.getItem("carrinho")

        if (carrinhoSalvo) {
            setCarrinho(JSON.parse(carrinhoSalvo))
        }
    }, [])

    function salvarCarrinho(novoCarrinho: ItemCarrinho[]) {
        setCarrinho(novoCarrinho)
        localStorage.setItem(
            "carrinho",
            JSON.stringify(novoCarrinho)
        )
    }

    function aumentarQuantidade(IdProduto: number) {
        const novoCarrinho = carrinho.map((produto) =>
            produto.IdProduto === IdProduto
                ? {
                    ...produto,
                    quantidade: produto.quantidade + 1
                }
                : produto
        )

        salvarCarrinho(novoCarrinho)
    }

    function diminuirQuantidade(IdProduto: number) {
        const novoCarrinho = carrinho
            .map((produto) =>
                produto.IdProduto === IdProduto
                    ? {
                        ...produto,
                        quantidade: produto.quantidade - 1
                    }
                    : produto
            )
            .filter((produto) => produto.quantidade > 0)

        salvarCarrinho(novoCarrinho)
    }

    function removerProduto(IdProduto: number) {
        const novoCarrinho = carrinho.filter(
            (produto) => produto.IdProduto !== IdProduto
        )

        salvarCarrinho(novoCarrinho)
    }

    function limparCarrinho() {
        setCarrinho([])
        localStorage.removeItem("carrinho")
    }

    const total = carrinho.reduce(
        (soma, produto) =>
            soma + Number(produto.Valor) * produto.quantidade,
        0
    )

    const quantidadeProdutos = carrinho.reduce(
        (soma, produto) =>
            soma + produto.quantidade,
        0
    )

    async function finalizarCompra() {
        if (!usuario?.IdUsuario) {
            toast.error("Você precisa estar logado para finalizar a compra.")
            navigate("/login")
            return
        }

        if (carrinho.length === 0) {
            toast.error("Seu carrinho está vazio.")
            return
        }

        try {
            const urlCompra = `${apiUrl}/compras`

            console.log("Enviando compra para:", urlCompra)

            const responseCompra = await fetch(urlCompra, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Valor_total: Number(total.toFixed(2)),
                    Usuario_Id: usuario.IdUsuario
                })
            })

            console.log("Status da compra:", responseCompra.status)

            const textoCompra = await responseCompra.text()

            console.log("Resposta da compra:", textoCompra)

            if (!responseCompra.ok) {
                toast.error("Erro ao criar a compra.")
                return
            }

            const compra = JSON.parse(textoCompra)

            const IdCompra = compra.IdCompra

            if (!IdCompra) {
                toast.error("A API não retornou o ID da compra.")
                return
            }

            for (const produto of carrinho) {
                const urlProduto =
                    `${apiUrl}/produtos_das_compras`

                console.log(
                    "Adicionando produto:",
                    produto.IdProduto,
                    "para compra:",
                    IdCompra
                )

                const responseProduto = await fetch(urlProduto, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        Produto_Id: produto.IdProduto,
                        Compra_Id: IdCompra
                    })
                })

                console.log(
                    "Status produto da compra:",
                    responseProduto.status
                )

                const textoProduto = await responseProduto.text()

                console.log(
                    "Resposta produto da compra:",
                    textoProduto
                )

                if (!responseProduto.ok) {
                    toast.error(
                        `Erro ao adicionar "${produto.Nome}" à compra.`
                    )
                    return
                }

                JSON.parse(textoProduto)
            }

            toast.success("Compra realizada com sucesso!")

            localStorage.removeItem("carrinho")

            setTimeout(() => {
                navigate("/")
            }, 1000)

        } catch (error) {
            console.error("Erro ao finalizar compra:", error)
            toast.error("Não foi possível finalizar a compra.")
        }
    }

    return (
        <div className="min-h-screen bg-stone-950 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-amber-100 mb-8">
                    Meu carrinho
                </h1>
                {carrinho.length === 0 ? (
                    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-10 text-center">
                        <div className="text-5xl mb-4">
                            🛒
                        </div>
                        <h2 className="text-xl font-bold text-stone-200 mb-2">
                            Seu carrinho está vazio
                        </h2>
                        <p className="text-stone-400 mb-6">
                            Adicione alguns livros para começar sua compra.
                        </p>
                        <button onClick={() => navigate("/")} className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-lg transition-colors">
                            Ver livros
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            {carrinho.map((produto) => (
                                <div key={produto.IdProduto} className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex gap-4">
                                    <div className="w-24 h-32 bg-stone-950 rounded-lg overflow-hidden flex-shrink-0">
                                        {produto.Img && (
                                            <img src={produto.Img} alt={produto.Nome} className="w-full h-full object-contain"/>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-lg font-bold text-amber-100">
                                            {produto.Nome}
                                        </h2>
                                        <p className="text-sm text-stone-400">
                                            {produto.Autor}
                                        </p>
                                        <p className="text-amber-500 font-bold mt-2">
                                            R$ {Number(produto.Valor).toLocaleString(
                                                "pt-BR",
                                                {
                                                    minimumFractionDigits: 2
                                                }
                                            )}
                                        </p>
                                        <div className="flex items-center gap-3 mt-4">
                                            <button
                                                onClick={() =>
                                                    diminuirQuantidade(
                                                        produto.IdProduto
                                                    )
                                                }
                                                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200">
                                                -
                                            </button>
                                            <span className="text-stone-200 font-bold">
                                                {produto.quantidade}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    aumentarQuantidade(
                                                        produto.IdProduto
                                                    )
                                                }
                                                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() =>
                                                    removerProduto(
                                                        produto.IdProduto
                                                    )
                                                }
                                                className="ml-4 text-red-400 hover:text-red-300 text-sm"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 sticky top-6">
                                <h2 className="text-xl font-bold text-stone-100 mb-6">
                                    Resumo da compra
                                </h2>
                                <div className="flex justify-between text-sm text-stone-400 mb-3">
                                    <span>
                                        Produtos
                                    </span>
                                    <span>
                                        {quantidadeProdutos}
                                    </span>
                                </div>
                                <div className="border-t border-stone-800 pt-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-300 font-medium">
                                            Total
                                        </span>
                                        <span className="text-2xl font-bold text-amber-500">
                                            R$ {total.toLocaleString(
                                                "pt-BR",
                                                {
                                                    minimumFractionDigits: 2
                                                }
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={finalizarCompra} className="w-full mt-6 py-3.5 px-6 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl transition-colors">
                                    Finalizar compra
                                </button>

                                <button onClick={limparCarrinho} className="w-full mt-3 py-3 px-6 border border-stone-700 hover:bg-stone-800 text-stone-400 hover:text-stone-200 rounded-xl transition-colors">
                                    Limpar carrinho
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}