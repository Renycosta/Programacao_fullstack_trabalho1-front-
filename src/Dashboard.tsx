import { useEffect, useState } from "react"

import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryPie
} from "victory"

const colorPalette = ['#6366F1', '#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B']
const primaryColor = '#6366F1'

const apiUrl = import.meta.env.VITE_API_URL

type Resumo = {
  produtos: number
  categorias: number
  usuarios: number
  compras: number
}

type ProdutoCategoria = {
  categoria: string
  quantidade: number
}

type Autor = {
  autor: string
  quantidade: number
}

type Produto = {
  IdProduto: number
  Nome: string
  Autor: string
  Valor: string
  Data_inclusao?: string
}

export default function Dashboard() {

  const [resumo, setResumo] = useState<Resumo>({
    produtos: 0,
    categorias: 0,
    usuarios: 0,
    compras: 0
  })

  const [produtosCategoria, setProdutosCategoria] = useState<ProdutoCategoria[]>([])
  const [autores, setAutores] = useState<Autor[]>([])
  const [produtosCaros, setProdutosCaros] = useState<Produto[]>([])
  const [produtosRecentes, setProdutosRecentes] = useState<Produto[]>([])

  useEffect(() => {

    async function carregarDashboard() {

      try {

        const [
          respostaResumo,
          respostaCategorias,
          respostaAutores,
          respostaCaros,
          respostaRecentes
        ] = await Promise.all([
          fetch(`${apiUrl}/dashboard/resumo`),
          fetch(`${apiUrl}/dashboard/produtos-categoria`),
          fetch(`${apiUrl}/dashboard/autores`),
          fetch(`${apiUrl}/dashboard/mais-caros`),
          fetch(`${apiUrl}/dashboard/mais-recentes`)
        ])

        const [
          dadosResumo,
          dadosCategorias,
          dadosAutores,
          dadosCaros,
          dadosRecentes
        ] = await Promise.all([
          respostaResumo.json(),
          respostaCategorias.json(),
          respostaAutores.json(),
          respostaCaros.json(),
          respostaRecentes.json()
        ])

        setResumo(dadosResumo)
        setProdutosCategoria(dadosCategorias)
        setAutores(dadosAutores)
        setProdutosCaros(dadosCaros)
        setProdutosRecentes(dadosRecentes)

      } catch (error) {

        console.error(
          "Erro ao carregar dashboard:",
          error
        )

      }
    }

    carregarDashboard()

  }, [])

  return (
    <div className="min-h-screen bg-stone-950 p-6 text-white md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>
        <p className="mt-2 text-stone-400">
          Visão geral da livraria
        </p>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-stone-800 bg-stone-900 p-5">
          <p className="text-sm text-stone-400">
            Produtos
          </p>
          <p className="mt-2 text-3xl font-bold">
            {resumo.produtos}
          </p>
        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900 p-5">
          <p className="text-sm text-stone-400">
            Categorias
          </p>
          <p className="mt-2 text-3xl font-bold">
            {resumo.categorias}
          </p>
        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900 p-5">
          <p className="text-sm text-stone-400">
            Usuários
          </p>
          <p className="mt-2 text-3xl font-bold">
            {resumo.usuarios}
          </p>

        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900 p-5">
          <p className="text-sm text-stone-400">
            Compras
          </p>
          <p className="mt-2 text-3xl font-bold">
            {resumo.compras}
          </p>
        </div>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Produtos por categoria
          </h2>
        <VictoryPie
            data={produtosCategoria.map((item) => ({
                x: item.categoria,
                y: item.quantidade
            }))}
            innerRadius={60}
            padAngle={2} 
            colorScale={colorPalette}
            labels={({ datum }) => `${datum.x}\n(${datum.y})`}
            labelRadius={120} 
            style={{
                data: {
                    fillOpacity: 0.9,
                    stroke: '#ffffff',
                    strokeWidth: 2
                },
                labels: {
                    fontSize: 12,
                    fill: '#374151', 
                    fontWeight: '500'
                }
            }}
        />
        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Autores com mais de um livro
          </h2>
        <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={30}
        >
            <VictoryAxis
                style={{
                    axis: { stroke: '#E5E7EB' }, 
                    tickLabels: { 
                        fontSize: 11, 
                        fill: '#4B5563', 
                    }
                }}
            />
            <VictoryAxis
                dependentAxis
                tickFormat={(valor) => `${valor}`}
                style={{
                    axis: { stroke: 'transparent' },
                    grid: { stroke: '#F3F4F6', strokeDasharray: '4, 4' }, 
                    tickLabels: { fontSize: 11, fill: '#4B5563' }
                }}
            />
            <VictoryBar
                data={autores.map((item) => ({
                    x: item.autor,
                    y: item.quantidade
                }))}
                cornerRadius={{ top: 6 }}
                style={{
                    data: {
                        fill: primaryColor,
                        width: 22 
                    },
                    labels: {
                        fontSize: 11,
                        fill: '#374151',
                        fontWeight: '600'
                    }
                }}
            />
        </VictoryChart>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="mb-5 text-xl font-semibold">
            Livros de maior valor
          </h2>
          <div className="space-y-4">
            {produtosCaros.map((produto) => (
            <div key={produto.IdProduto} className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div>
                  <p className="font-medium">
                    {produto.Nome}
                  </p>
                  <p className="text-sm text-stone-400">
                    {produto.Autor}
                  </p>
                </div>
                <p className="font-semibold">
                  R$ {Number(produto.Valor).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900 p-6">
            <h2 className="mb-5 text-xl font-semibold">
                Livros adicionados recentemente
            </h2>
            <div className="space-y-4">
                {produtosRecentes.map((produto) => (
                    <div key={produto.IdProduto} className="border-b border-stone-800 pb-3">
                    <p className="font-medium">
                    {produto.Nome}
                    </p>
                    <p className="text-sm text-stone-400">
                    {produto.Autor}
                    </p>
                    {produto.Data_inclusao && (
                    <p className="mt-1 text-xs text-stone-500">
                        Adicionado em{" "}
                        {new Date(
                        produto.Data_inclusao
                        ).toLocaleDateString("pt-BR")}
                    </p>
                    )}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}