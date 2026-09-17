import type { UsuarioType } from "./UsuarioType"

export type EnderecoType = {
  IdEndereco: number
  CEP: string
  Estado: string
  Cidade: string
  Bairro: string
  Rua: string
  Numero: number
  Complemento: string | null
  Usuario_Id: number
  Usuario: UsuarioType
}