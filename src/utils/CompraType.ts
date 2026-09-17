import type { UsuarioType } from "./UsuarioType"

export type CompraType = {
    IdCompra: number
    Data_venda: Date
    Valor_total: number
    Usuario_Id: number
    Usuario: UsuarioType
}