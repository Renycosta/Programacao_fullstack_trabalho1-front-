import type { ProdutoType } from "./utils/ProdutoType"

import { useParams } from "react-router-dom"

import { useEffect, useState } from "react"

import { toast } from "sonner"

const apiUrl = import.meta.env.VITE_API_URL

export default function Detalhes() {
    const params = useParams()

    const [produto, setProduto] = useState<ProdutoType>()

    useEffect(() => {
        async function buscaDados() {
            try {
                const response = await fetch(
                    `${apiUrl}/produtos/${params.produtoId}`
                )

                if (!response.ok) {
                    console.error("Livro não encontrado")
                    return
                }

                const dados: ProdutoType = await response.json()

                setProduto(dados)
            } catch (error) {
                console.error("Erro ao buscar dados do livro:", error)
            }
        }

        buscaDados()
    }, [params.produtoId])

    function adicionarAoCarrinho() {
        if (!produto) {
            return
        }

        const carrinhoSalvo = localStorage.getItem("carrinho")

        const carrinho = carrinhoSalvo
            ? JSON.parse(carrinhoSalvo)
            : []

        const produtoExistente = carrinho.find(
            (item: any) => item.IdProduto === produto.IdProduto
        )

        if (produtoExistente) {
            produtoExistente.quantidade += 1
        } else {
            carrinho.push({
                IdProduto: produto.IdProduto,
                Nome: produto.Nome,
                Autor: produto.Autor,
                Valor: Number(produto.Valor),
                Img: produto.Img,
                quantidade: 1
            })
        }

        localStorage.setItem("carrinho", JSON.stringify(carrinho))

        toast.success("Livro adicionado ao carrinho!")
    }

    return (
        <>
            <div className="min-h-screen bg-stone-950 flex">
                <section className="mt-8 mb-12 mx-auto max-w-6xl px-4">
                    <div className="bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                            {/* Coluna da Imagem (Esquerda) */}
                            <div className="lg:col-span-5 flex flex-col items-center">
                                <div className="w-full bg-stone-950 border border-stone-800 rounded-xl overflow-hidden shadow-lg p-3 flex justify-center items-center">
                                    <img className="max-h-[450px] w-auto object-contain rounded-lg" src={produto?.Img} alt={`Capa do livro ${produto?.Nome}`} />
                                </div>
                                <span className="mt-2 text-xs text-stone-500 italic">imagem ilustrativa</span>
                            </div>
                            {/* Coluna de Informações e Compra (Direita) */}
                            <div className="lg:col-span-7 flex flex-col justify-between">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-amber-100 mb-2">
                                        {produto?.Nome}
                                    </h1>
                                    <p className="text-base text-stone-400 mb-6">
                                        por <span className="text-stone-200 font-medium">{produto?.Autor}</span>
                                    </p>
                                    {/* Bloco de Preço e Ação Principal */}
                                    <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 mb-6">
                                        <div className="flex items-baseline justify-between mb-4">
                                            <div>
                                                <span className="text-xs text-stone-500 block uppercase tracking-wider">Valor do exemplar</span>
                                                <span className="text-3xl font-extrabold text-amber-500">
                                                    R$ {Number(produto?.Valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded-full font-medium">
                                                    Estoque disponível
                                                </span>
                                            </div>
                                        </div>
                                        <button onClick={adicionarAoCarrinho} className="w-full py-3.5 px-6 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                            </svg>
                                            <span>ADICIONAR AO CARRINHO</span>
                                        </button>
                                    </div>
                                    {/* Especificações Rápidas */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                                        <div className="bg-stone-950/60 border border-stone-800/80 rounded-lg p-3">
                                            <span className="text-xs text-stone-500 block">Ano</span>
                                            <span className="text-sm font-semibold text-stone-200">{produto?.Ano_public}</span>
                                        </div>
                                        <div className="bg-stone-950/60 border border-stone-800/80 rounded-lg p-3">
                                            <span className="text-xs text-stone-500 block">Peso</span>
                                            <span className="text-sm font-semibold text-stone-200">{produto?.Peso}</span>
                                        </div>
                                        <div className="bg-stone-950/60 border border-stone-800/80 rounded-lg p-3 col-span-2 md:col-span-1">
                                            <span className="text-xs text-stone-500 block">Categoria</span>
                                            <span className="text-sm font-semibold text-amber-400 truncate block">{produto?.Categoria?.Descricao}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Vendedor / Cadastro info */}
                                <div className="pt-4 border-t border-stone-800 text-xs text-stone-400 flex flex-wrap justify-between items-center gap-2">
                                    <span>Cadastrado por: <strong className="text-stone-200">{produto?.Usuario?.Nome}</strong></span>
                                    <span>Incluído em: {produto?.Data_inclusao ? new Date(produto.Data_inclusao).toLocaleDateString("pt-BR") : ""}</span>
                                </div>
                            </div>
                        </div>
                        {/* Seção Inferior: Descrição e IA */}
                        <div className="mt-10 pt-8 border-t border-stone-800 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-xl font-bold text-stone-100 mb-3 flex items-center gap-2">
                                    📖 Sinopse / Descrição
                                </h2>
                                <p className="text-stone-400 leading-relaxed text-sm">
                                    {produto?.Descricao}
                                </p>
                            </div>
                            {produto?.Comentario_IA && (
                                <div className="border border-amber-900/50 bg-amber-950/20 rounded-xl p-5 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-amber-400 mb-2 flex items-center gap-2">
                                            ✨ Análise Editorial por IA
                                        </h2>
                                        <p className="text-stone-300 text-sm leading-relaxed">
                                            {produto.Comentario_IA}
                                        </p>
                                    </div>
                                    <span className="mt-4 text-[10px] italic text-stone-500">
                                        * Gerado automaticamente por inteligência artificial.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}