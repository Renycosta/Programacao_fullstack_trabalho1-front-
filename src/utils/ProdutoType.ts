import type { UsuarioType } from "./UsuarioType"
import type { CategoriaType } from "./CategoriaType"

export type ProdutoType = {
    IdProduto: number
    Nome: string
    Autor: string
    Ano_public: number
    Peso: string
    Descricao: string
    Img: string
    Valor: number
    Comentario_IA: String
    Data_inclusao: Date
    Data_atualiza: Date
    Usuario_Id: number
    Usuario: UsuarioType
    Categoria_Id: number
    Categoria: CategoriaType
}