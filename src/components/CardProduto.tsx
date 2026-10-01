import { Link } from "react-router-dom"
import type { ProdutoType } from "../utils/ProdutoType"

export function CardProduto({ data }: { data: ProdutoType }) {
    return (
       <div className="max-w-sm overflow-hidden bg-stone-900 border border-stone-800 rounded-xl shadow-lg hover:border-amber-700 hover:shadow-amber-950/20 transition-all duration-300 flex flex-col">
            <div className="relative h-72 bg-stone-950 flex items-center justify-center overflow-hidden">
                <img className="h-full w-full object-contain p-4 transition-transform duration-300 hover:scale-105" src={data.Img} alt={`Capa do livro ${data.Nome}`}/>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-amber-100 line-clamp-2">
                        {data.Nome}
                    </h5>
                    <p className="text-sm text-stone-400">
                        {data.Autor}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                        {data.Ano_public}
                    </p>
                </div>
                <div className="mt-5 pt-4 border-t border-stone-800 flex items-end justify-between">
                    <div>
                        <span className="text-xs text-stone-500 block mb-1">
                            Preço
                        </span>
                        <span className="text-xl font-extrabold text-amber-500">
                            R$ {Number(data.Valor).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2
                            })}
                        </span>
                    </div>
                    <Link to={`/detalhes/${data.IdProduto}`} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-100 bg-amber-900 rounded-lg hover:bg-amber-800 hover:shadow-md transition-all duration-200">
                        Ver detalhes
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    )
}