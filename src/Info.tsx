import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { useUsuarioStore } from "./context/UsuarioContext.ts"

const apiUrl = import.meta.env.VITE_API_URL

type EnderecoType = {
    IdEndereco: number
    CEP: string
    Estado: string
    Cidade: string
    Bairro: string
    Rua: string
    Numero: number
    Complemento?: string
    Usuario_Id: number
}

type UsuarioType = {
    IdUsuario: number
    Nome: string
    Telefone: string
    Email: string
    CPF: string
    Data_nasc: string
}

export default function Info() {

    const { usuario } = useUsuarioStore()

    const [dadosUsuario, setDadosUsuario] = useState<UsuarioType>()
    const [enderecos, setEnderecos] = useState<EnderecoType[]>([])

    const [cep, setCep] = useState("")
    const [estado, setEstado] = useState("")
    const [cidade, setCidade] = useState("")
    const [bairro, setBairro] = useState("")
    const [rua, setRua] = useState("")
    const [numero, setNumero] = useState("")
    const [complemento, setComplemento] = useState("")

    const [carregando, setCarregando] = useState(false)

    useEffect(() => {

        if (!usuario?.IdUsuario) {
            return
        }

        async function buscaInformacoes() {

            try {

                const responseUsuario = await fetch(
                    `${apiUrl}/usuarios/${usuario?.IdUsuario}`
                )

                if (!responseUsuario.ok) {
                    throw new Error("Não foi possível buscar os dados do usuário")
                }

                const dados = await responseUsuario.json()

                setDadosUsuario(dados)

                const responseEnderecos = await fetch(
                    `${apiUrl}/enderecos/usuario/${usuario?.IdUsuario}`
                )

                if (!responseEnderecos.ok) {
                    throw new Error("Não foi possível buscar os endereços")
                }

                const dadosEnderecos: EnderecoType[] =
                    await responseEnderecos.json()

                setEnderecos(dadosEnderecos)

            } catch (error) {

                console.error(error)

                toast.error(
                    "Não foi possível carregar suas informações"
                )
            }
        }

        buscaInformacoes()

    }, [usuario?.IdUsuario])

    async function adicionaEndereco(
        event: React.FormEvent<HTMLFormElement>
    ) {

        event.preventDefault()

        if (!usuario?.IdUsuario) {
            toast.error("Usuário não encontrado")
            return
        }

        if (
            !cep ||
            !estado ||
            !cidade ||
            !bairro ||
            !rua ||
            !numero
        ) {
            toast.error("Preencha todos os campos obrigatórios")
            return
        }

        setCarregando(true)

        try {

            const response = await fetch(
                `${apiUrl}/enderecos`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        CEP: cep,
                        Estado: estado,
                        Cidade: cidade,
                        Bairro: bairro,
                        Rua: rua,
                        Numero: Number(numero),
                        Complemento: complemento || null,
                        Usuario_Id: usuario.IdUsuario
                    })
                }
            )

            const dados = await response.json()

            if (!response.ok) {
                console.error(dados)
                toast.error("Não foi possível adicionar o endereço")
                return
            }

            setEnderecos([
                ...enderecos,
                dados
            ])

            setCep("")
            setEstado("")
            setCidade("")
            setBairro("")
            setRua("")
            setNumero("")
            setComplemento("")

            toast.success("Endereço adicionado com sucesso!")

        } catch (error) {

            console.error(error)

            toast.error(
                "Não foi possível adicionar o endereço"
            )

        } finally {

            setCarregando(false)

        }
    }

    if (!usuario?.IdUsuario) {
        return (
            <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">

                <div className="text-center">

                    <h1 className="text-2xl font-bold text-stone-100">
                        Usuário não encontrado
                    </h1>

                    <Link
                        to="/login"
                        className="inline-block mt-4 text-amber-500 hover:text-amber-400"
                    >
                        Fazer login
                    </Link>

                </div>

            </div>
        )
    }

    return (
        <main className="min-h-screen bg-stone-950 text-stone-100 px-4 py-10">

            <div className="max-w-4xl mx-auto">

                <div className="mb-8">

                    <Link
                        to="/"
                        className="text-sm text-stone-400 hover:text-amber-400"
                    >
                        ← Voltar
                    </Link>

                    <h1 className="text-3xl font-bold mt-4">
                        Minhas informações
                    </h1>

                    <p className="text-stone-400 mt-2">
                        Visualize seus dados e gerencie seus endereços.
                    </p>

                </div>

                {/* INFORMAÇÕES DO USUÁRIO */}

                <section className="bg-stone-900 border border-stone-800 rounded-xl p-6 mb-6">

                    <h2 className="text-xl font-semibold text-amber-100 mb-6">
                        Dados pessoais
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>
                            <p className="text-sm text-stone-500">
                                Nome
                            </p>

                            <p className="text-stone-100 mt-1">
                                {dadosUsuario?.Nome || usuario.Nome}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-stone-500">
                                E-mail
                            </p>

                            <p className="text-stone-100 mt-1">
                                {dadosUsuario?.Email}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-stone-500">
                                Telefone
                            </p>

                            <p className="text-stone-100 mt-1">
                                {dadosUsuario?.Telefone}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-stone-500">
                                CPF
                            </p>

                            <p className="text-stone-100 mt-1">
                                {dadosUsuario?.CPF}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-stone-500">
                                Data de nascimento
                            </p>

                            <p className="text-stone-100 mt-1">
                                {dadosUsuario?.Data_nasc
                                    ? new Date(
                                        dadosUsuario.Data_nasc
                                    ).toLocaleDateString("pt-BR")
                                    : "-"
                                }
                            </p>
                        </div>

                    </div>

                </section>

                {/* ENDEREÇOS EXISTENTES */}

                <section className="bg-stone-900 border border-stone-800 rounded-xl p-6 mb-6">

                    <h2 className="text-xl font-semibold text-amber-100 mb-6">
                        Meus endereços
                    </h2>

                    {enderecos.length === 0 ? (

                        <p className="text-stone-400">
                            Você ainda não possui nenhum endereço cadastrado.
                        </p>

                    ) : (

                        <div className="space-y-4">

                            {enderecos.map((endereco) => (

                                <div
                                    key={endereco.IdEndereco}
                                    className="border border-stone-800 rounded-lg p-4"
                                >

                                    <p className="text-stone-100">
                                        {endereco.Rua}, {endereco.Numero}
                                    </p>

                                    <p className="text-stone-400">
                                        {endereco.Bairro} — {endereco.Cidade}/{endereco.Estado}
                                    </p>

                                    <p className="text-stone-400">
                                        CEP: {endereco.CEP}
                                    </p>

                                    {endereco.Complemento && (
                                        <p className="text-stone-400">
                                            Complemento: {endereco.Complemento}
                                        </p>
                                    )}

                                </div>

                            ))}

                        </div>

                    )}

                </section>

                {/* FORMULÁRIO DE ENDEREÇO */}

                <section className="bg-stone-900 border border-stone-800 rounded-xl p-6">

                    <h2 className="text-xl font-semibold text-amber-100 mb-6">
                        Adicionar endereço
                    </h2>

                    <form
                        onSubmit={adicionaEndereco}
                        className="grid grid-cols-1 md:grid-cols-2 gap-5"
                    >

                        <div>
                            <label className="block text-sm text-stone-300 mb-2">
                                CEP
                            </label>

                            <input
                                type="text"
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                placeholder="00000-000"
                                className="campo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-stone-300 mb-2">
                                Estado
                            </label>

                            <input
                                type="text"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                placeholder="RS"
                                className="campo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-stone-300 mb-2">
                                Cidade
                            </label>

                            <input
                                type="text"
                                value={cidade}
                                onChange={(e) => setCidade(e.target.value)}
                                placeholder="Cidade"
                                className="campo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-stone-300 mb-2">
                                Bairro
                            </label>

                            <input
                                type="text"
                                value={bairro}
                                onChange={(e) => setBairro(e.target.value)}
                                placeholder="Bairro"
                                className="campo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-stone-300 mb-2">
                                Rua
                            </label>

                            <input
                                type="text"
                                value={rua}
                                onChange={(e) => setRua(e.target.value)}
                                placeholder="Rua"
                                className="campo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-stone-300 mb-2">
                                Número
                            </label>

                            <input
                                type="number"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                                placeholder="Número"
                                className="campo"
                            />
                        </div>

                        <div className="md:col-span-2">

                            <label className="block text-sm text-stone-300 mb-2">
                                Complemento
                            </label>

                            <input
                                type="text"
                                value={complemento}
                                onChange={(e) => setComplemento(e.target.value)}
                                placeholder="Apartamento, bloco, etc. (opcional)"
                                className="campo"
                            />

                        </div>

                        <div className="md:col-span-2">

                            <button
                                type="submit"
                                disabled={carregando}
                                className="w-full bg-amber-900/60 hover:bg-amber-800 text-amber-100 font-medium rounded-lg px-5 py-3 transition disabled:opacity-50"
                            >
                                {carregando
                                    ? "Adicionando..."
                                    : "Adicionar endereço"
                                }
                            </button>

                        </div>

                    </form>

                </section>

            </div>

        </main>
    )
}