import type { UsuarioType } from "../utils/UsuarioType"
import { create } from "zustand"

type UsuarioStore = {
    usuario: UsuarioType | null
    logaUsuario: (usuarioLogado: UsuarioType) => void
    deslogaUsuario: () => void
}

export const useUsuarioStore = create<UsuarioStore>((set) => ({
    usuario: null,

    logaUsuario: (usuarioLogado) =>
        set({ usuario: usuarioLogado }),

    deslogaUsuario: () =>
        set({ usuario: null })
}))