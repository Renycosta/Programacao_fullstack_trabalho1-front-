import type { ProdutoType } from "./ProdutoType"
import type { CompraType } from "./CompraType"

export type Produtos_da_compraType = {
    Produto_Id: number
    Produto: ProdutoType
    Compra_Id: number
    Compra: CompraType
}