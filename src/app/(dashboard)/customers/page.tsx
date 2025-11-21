"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus } from "lucide-react"

type ClientRecord = {
  id: string
  fullName: string
  email: string
  avatar?: string
  active: boolean
  origin: string
}

const initialClients: ClientRecord[] = [
  {
    id: "client-1",
    fullName: "João Silva",
    email: "joao@exemplo.com",
    active: true,
    origin: "Website",
  },
  {
    id: "client-2",
    fullName: "Maria Santos",
    email: "maria@exemplo.com",
    active: true,
    origin: "Indicação",
  },
  {
    id: "client-3",
    fullName: "Pedro Oliveira",
    email: "pedro@exemplo.com",
    active: false,
    origin: "Redes Sociais",
  },
]

export default function Page() {
  const router = useRouter()
  const [clientList, setClientList] = useState<ClientRecord[]>(initialClients)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clientList
    const term = searchTerm.toLowerCase()
    return clientList.filter((client) => {
      const haystack = [client.fullName, client.email, client.origin].join(" ").toLowerCase()
      return haystack.includes(term)
    })
  }, [clientList, searchTerm])

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Clientes</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Gerencie os clientes do sistema
            </p>
          </div>
          <Button
            onClick={() => router.push("/customers/new")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo cliente
          </Button>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <Input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Client List */}
        {filteredClients.length === 0 ? (
          <div className="border border-dashed rounded-lg p-10 text-center">
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className="p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={client.avatar} alt={client.fullName} />
                      <AvatarFallback>
                        {client.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{client.fullName}</CardTitle>
                      <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                    </div>
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        client.active ? "bg-[#23b559]" : "bg-zinc-300"
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Origem:</span>
                    <span className="text-xs font-medium">{client.origin}</span>
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
