import type { AdminType } from "./AdminType"

export type CategoriaType = {
    IdCategoria: number
    Descricao: string
    email: string
    Usuario_Id: number
    Usuario: AdminType
}