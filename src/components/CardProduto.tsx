import { Link } from "react-router-dom"

import type { ProdutoType } from "../utils/ProdutoType"

export function CardProduto({ data }: { data: ProdutoType }) {

    return (
        <div className="max-w-sm overflow-hidden bg-stone-900 border border-stone-800 rounded-lg shadow-lg hover:border-amber-800 transition-colors flex flex-col justify-between">
            <div className="relative">
                <img className="w-full h-64 object-cover" src={data.Img} alt={`Capa do livro ${data.Nome}`} />
                <button className="absolute bottom-3 right-3 p-2.5 bg-stone-900/80 backdrop-blur-sm border border-stone-700 rounded-full text-stone-300 hover:text-amber-400 hover:border-amber-700 transition-colors shadow-md">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>
            </div>
                
            <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                    <h5 className="mb-1 text-xl font-bold tracking-tight text-amber-100 line-clamp-2">
                        {data.Nome}
                    </h5>
                    <p className="mb-1 text-xs text-stone-400">
                        por {data.Autor}
                    </p>
                    <p className="mb-3 text-xs text-stone-500">
                        Ano: {data.Ano_public}
                    </p>
                </div>
                
                <div className="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between">
                    <div>
                        <span className="text-xs text-stone-500 block">Valor</span>
                        <span className="text-lg font-extrabold text-amber-500">
                            R$ {Number(data.Valor).toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                        </span>
                    </div>
                    
                    <Link to={`/detalhes/${data.IdProduto}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-stone-100 bg-amber-900 rounded-lg hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-amber-950 transition-colors">
                        Detalhes
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    )
}