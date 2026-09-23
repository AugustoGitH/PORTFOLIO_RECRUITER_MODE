"use client"

import type { FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { LockKeyholeIcon, MailIcon } from "lucide-react"
import { Button } from "../../../components/action/Button"
import { Input } from "../../../components/input/Input"
import { http } from "../../../libs/http"
import { useAdminMutationToast } from "../hooks"

type AdminLoginPayload = { email: string; password: string }

export const AdminLoginForm = () => {
  const router = useRouter()
  const adminToast = useAdminMutationToast()
  const loginMutation = useMutation({
    mutationFn: async (payload: AdminLoginPayload) => (await http.post("api/admin/auth/login", payload)).data,
    onSuccess: () => {
      adminToast.success("AdminLoginSuccess")
      router.replace("/admin")
      router.refresh()
    },
    onError: () => adminToast.error("AdminLoginError"),
  })
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    loginMutation.mutate({ email: String(form.get("email") ?? ""), password: String(form.get("password") ?? "") })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ud-neutral-0 p-4">
      <form onSubmit={submit} className="w-96 max-w-full rounded-lg border border-ud-neutral-300 bg-ud-neutral-100 p-6 shadow-modal">
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-ud-auxiliary-purple p-2 text-ud-neutral-0"><LockKeyholeIcon size={20} /></span>
          <div><h1 className="text-xl font-bold text-ud-neutral-950">Administração</h1><p className="text-xs text-ud-secondary-600">Acesso restrito ao portfólio.</p></div>
        </div>
        <div className="mt-6 space-y-4">
          <Input required name="email" type="email" label="E-mail" autoComplete="username" placeholder="voce@exemplo.com" />
          <Input required name="password" type="password" label="Senha" autoComplete="current-password" />
        </div>
        <Button type="submit" highlight className="mt-6 w-full justify-center" loading={{ verb: "Entrando", state: loginMutation.isPending }} startAdornment={<MailIcon size={16} />}>Entrar</Button>
      </form>
    </main>
  )
}
