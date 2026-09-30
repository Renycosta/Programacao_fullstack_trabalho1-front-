import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useUsuarioStore } from "./context/UsuarioContext.ts"

const apiUrl = import.meta.env.VITE_API_URL

export default function Vender() {
    const navigate = useNavigate()
    const { usuario } = useUsuarioStore()

    const [nome, setNome] = useState("")
    const [autor, setAutor] = useState("")
    const [anoPublic, setAnoPublic] = useState("")
    const [peso, setPeso] = useState("")
    const [descricao, setDescricao] = useState("")
    const [img, setImg] = useState("")
    const [valor, setValor] = useState("")
    const [categoriaId, setCategoriaId] = useState("")

    const [carregando, setCarregando] = useState(false)

    async function cadastrarLivro(event: React.FormEvent) {
        event.preventDefault()

        if (!usuario?.IdUsuario) {
            toast.error("Você precisa estar logado para vender um livro.")
            navigate("/login")
            return
        }

        if (
            !nome ||
            !autor ||
            !anoPublic ||
            !peso ||
            !descricao ||
            !valor ||
            !categoriaId
        ) {
            toast.error("Preencha todos os campos obrigatórios.")
            return
        }

        const dados = {
            Nome: nome,
            Autor: autor,
            Ano_public: Number(anoPublic),
            Peso: peso,
            Descricao: descricao,
            Img: img,
            Valor: Number(valor),
            Usuario_Id: usuario.IdUsuario,
            Categoria_Id: Number(categoriaId)
        }

        try {
            setCarregando(true)

            const response = await fetch(`${apiUrl}/produtos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            })

            const resultado = await response.json()

            if (!response.ok) {
                console.error(resultado)

                if (resultado.erro) {
                    toast.error(
                        typeof resultado.erro === "string"
                            ? resultado.erro
                            : "Erro ao cadastrar livro."
                    )
                } else {
                    toast.error("Erro ao cadastrar livro.")
                }

                return
            }

            toast.success("Livro cadastrado com sucesso!")

            setTimeout(() => {
                navigate(`/`)
            }, 1000)

        } catch (error) {
            console.error("Erro ao cadastrar livro:", error)
            toast.error("Não foi possível cadastrar o livro.")
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="min-h-screen bg-stone-950 py-10 px-4">
            <div className="max-w-4xl mx-auto">

                <div className="bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden">

                    {/* Cabeçalho */}
                    <div className="p-6 md:p-8 border-b border-stone-800">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-amber-900/40 border border-amber-800">
                                <span className="text-2xl">📖</span>
                            </div>

                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-amber-100">
                                    Vender livro
                                </h1>

                                <p className="text-sm text-stone-400 mt-1">
                                    Cadastre um livro para disponibilizá-lo na loja.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={cadastrarLivro} className="p-6 md:p-8">

                        {/* Informações principais */}
                        <div className="mb-8">
                            <h2 className="text-lg font-bold text-stone-100 mb-4">
                                Informações do livro
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* Nome */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-stone-300 mb-2">
                                        Nome do livro *
                                    </label>

                                    <input
                                        type="text"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        placeholder="Ex.: Senhor das Moscas"
                                        className="w-full rounded-lg bg-stone-950 border border-stone-700 px-4 py-3 text-stone-200 placeholder-stone-600 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                                    />
                                </div>

                                {/* Autor */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-300 mb-2">
                                        Autor *
                                    </label>

                                    <input
                                        type="text"
                                        value={autor}
                                        onChange={(e) => setAutor(e.target.value)}
                                        placeholder="Ex.: William Golding"
                                        className="w-full rounded-lg bg-stone-950 border border-stone-700 px-4 py-3 text-stone-200 placeholder-stone-600 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                                    />
                                </div>

                                {/* Ano */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-300 mb-2">
                                        Ano de publicação *
                                    </label>

                                    <input
                                        type="number"
                                        value={anoPublic}
                                        onChange={(e) => setAnoPublic(e.target.value)}
                                        placeholder="Ex.: 1954"
                                        className="w-full rounded-lg bg-stone-950 border border-stone-700 px-4 py-3 text-stone-200 placeholder-stone-600 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                                    />
                                </div>

                                {/* Peso */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-300 mb-2">
                                        Peso *
                                    </label>

                                    <input
                                        type="text"
                                        step="0.01"
                                        value={peso}
                                        onChange={(e) => setPeso(e.target.value)}
                                        placeholder="Ex.: 0.350"
                                        className="w-full rounded-lg bg-stone-950 border border-stone-700 px-4 py-3 text-stone-200 placeholder-stone-600 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                                    />
                                </div>

                                {/* Categoria */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-300 mb-2">
                                        Categoria *
                                    </label>

                                    <input
                                        type="number"
                                        value={categoriaId}
                                        onChange={(e) => setCategoriaId(e.target.value)}
                                        placeholder="ID da categoria"
                                        className="w-full rounded-lg bg-stone-950 border border-stone-700 px-4 py-3 text-stone-200 placeholder-stone-600 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preço e imagem */}
                        <div className="mb-8">
                            <h2 className="text-lg font-bold text-stone-100 mb-4">
                                Venda
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* Valor */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-300 mb-2">
                                        Valor *
                                    </label>

                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-stone-500">
                                            R$
                                        </span>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={valor}
                                            onChange={(e) => setValor(e.target.value)}
                                            placeholder="39.90"
                                            className="w-full rounded-lg bg-stone-950 border border-stone-700 pl-11 pr-4 py-3 text-stone-200 placeholder-stone-600 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                                        />
                                    </div>
                                </div>

                                {/* Imagem */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-300 mb-2">
                                        URL da imagem
                                    </label>

                                    <input
                                        type="url"
                                        value={img}
                                        onChange={(e) => setImg(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full rounded-lg bg-stone-950 border border-stone-700 px-4 py-3 text-stone-200 placeholder-stone-600 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Descrição */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-stone-300 mb-2">
                                Descrição *
                            </label>

                            <textarea
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                rows={6}
                                placeholder="Escreva uma descrição sobre o livro..."
                                className="w-full rounded-lg bg-stone-950 border border-stone-700 px-4 py-3 text-stone-200 placeholder-stone-600 outline-none resize-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                            />
                        </div>

                        {/* Informação da IA */}
                        <div className="mb-8 p-4 rounded-xl border border-amber-900/50 bg-amber-950/20">
                            <div className="flex gap-3">
                                <span className="text-xl">
                                    ✨
                                </span>

                                <div>
                                    <h3 className="text-sm font-bold text-amber-400">
                                        Análise por IA
                                    </h3>

                                    <p className="text-xs text-stone-400 mt-1">
                                        Depois do cadastro, uma análise editorial
                                        será gerada automaticamente para o livro.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Botões */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">

                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 rounded-lg border border-stone-700 text-stone-300 font-medium hover:bg-stone-800 transition-colors"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={carregando}
                                className="px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700 disabled:text-stone-500 text-stone-950 font-bold transition-colors"
                            >
                                {carregando
                                    ? "Cadastrando..."
                                    : "Cadastrar livro"}
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}