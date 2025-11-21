"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus } from "lucide-react"

type UserRecord = {
  id: string
  fullName: string
  email: string
  avatar?: string
  active: boolean
}

const initialUsers: UserRecord[] = [
  {
    id: "user-1",
    fullName: "João Silva",
    email: "joao@exemplo.com",
    active: true,
  },
  {
    id: "user-2",
    fullName: "Maria Santos",
    email: "maria@exemplo.com",
    active: true,
  },
  {
    id: "user-3",
    fullName: "Pedro Oliveira",
    email: "pedro@exemplo.com",
    active: false,
  },
]

export default function Page() {
  const router = useRouter()
  const [userList, setUserList] = useState<UserRecord[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return userList
    const term = searchTerm.toLowerCase()
    return userList.filter((user) => {
      const haystack = [user.fullName, user.email].join(" ").toLowerCase()
      return haystack.includes(term)
    })
  }, [userList, searchTerm])

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Usuários</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Gerencie os usuários do sistema
            </p>
          </div>
          <Button
            onClick={() => router.push("/users/new")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo usuário
          </Button>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <Input
            type="text"
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* User List */}
        {filteredUsers.length === 0 ? (
          <div className="border border-dashed rounded-lg p-10 text-center">
            <p className="text-muted-foreground">Nenhum usuário encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.fullName} />
                      <AvatarFallback>
                        {user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{user.fullName}</CardTitle>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        user.active ? "bg-[#23b559]" : "bg-zinc-300"
                      }`}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
