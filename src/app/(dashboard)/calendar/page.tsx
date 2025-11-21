"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Filter, X, RotateCcw, Clock, Calendar, User, Mail } from "lucide-react"

type UserRecord = {
  id: string
  fullName: string
  email: string
  avatar?: string
  active: boolean
}

type Appointment = {
  id: string
  userId: string
  date: string
  time: string
  type: string
  description: string
  status: string
}

// Lista de todos os usuários disponíveis
const allUsers: UserRecord[] = [
  { id: "user-1", fullName: "João Silva", email: "joao@exemplo.com", active: true },
  { id: "user-2", fullName: "Maria Santos", email: "maria@exemplo.com", active: true },
  { id: "user-3", fullName: "Pedro Oliveira", email: "pedro@exemplo.com", active: false },
  { id: "user-4", fullName: "Ana Costa", email: "ana@exemplo.com", active: true },
  { id: "user-5", fullName: "Carlos Mendes", email: "carlos@exemplo.com", active: true },
]

const appointmentTypes = ["Consulta", "Reunião", "Follow-up", "Avaliação"]
const appointmentStatuses = ["Agendado", "Confirmado", "Pendente", "Cancelado"]

// Função para gerar eventos próximos da data atual
const generateEvents = () => {
  const today = new Date()
  const events: Record<string, Appointment[]> = {}
  const times = ["09:00", "10:30", "14:00", "15:30", "16:00", "17:00"]
  
  // Adicionar eventos para os próximos 30 dias
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateKey = date.toISOString().split("T")[0]
    
    // Adicionar eventos aleatórios em alguns dias
    if (i % 3 === 0 || i % 5 === 0 || i % 7 === 0) {
      const numAppointments = Math.floor(Math.random() * 3) + 1
      const appointments: Appointment[] = []
      
      for (let j = 0; j < numAppointments; j++) {
        const user = allUsers[Math.floor(Math.random() * allUsers.length)]
        appointments.push({
          id: `appt-${dateKey}-${j}`,
          userId: user.id,
          date: dateKey,
          time: times[Math.floor(Math.random() * times.length)],
          type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
          description: `Agendamento de ${appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)].toLowerCase()} com ${user.fullName}`,
          status: appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)],
        })
      }
      
      events[dateKey] = appointments
    }
  }
  
  // Adicionar alguns eventos no passado recente
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateKey = date.toISOString().split("T")[0]
    
    if (i % 2 === 0) {
      const numAppointments = Math.floor(Math.random() * 2) + 1
      const appointments: Appointment[] = []
      
      for (let j = 0; j < numAppointments; j++) {
        const user = allUsers[Math.floor(Math.random() * allUsers.length)]
        appointments.push({
          id: `appt-${dateKey}-${j}`,
          userId: user.id,
          date: dateKey,
          time: times[Math.floor(Math.random() * times.length)],
          type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
          description: `Agendamento de ${appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)].toLowerCase()} com ${user.fullName}`,
          status: appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)],
        })
      }
      
      events[dateKey] = appointments
    }
  }
  
  return events
}

const appointments = generateEvents()

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { year, month, firstDayOfMonth, lastDayOfMonth, daysInMonth, startingDayOfWeek } = useMemo(() => {
    const y = currentDate.getFullYear()
    const m = currentDate.getMonth()
    const first = new Date(y, m, 1)
    const last = new Date(y, m + 1, 0)
    
    return {
      year: y,
      month: m,
      firstDayOfMonth: first,
      lastDayOfMonth: last,
      daysInMonth: last.getDate(),
      startingDayOfWeek: first.getDay(),
    }
  }, [currentDate])

  const previousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const formatDateKey = (day: number) => {
    const date = new Date(year, month, day)
    return date.toISOString().split("T")[0]
  }

  const formatDateDisplay = (dateKey: string) => {
    const date = new Date(dateKey)
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isDateInRange = (dateKey: string) => {
    if (!startDate && !endDate) return true
    
    const date = new Date(dateKey)
    const start = startDate ? new Date(startDate) : null
    const end = endDate ? new Date(endDate) : null
    
    if (start && date < start) return false
    if (end && date > end) return false
    
    return true
  }

  const getAppointmentsForDay = (day: number) => {
    const dateKey = formatDateKey(day)
    let dayAppointments = appointments[dateKey] || []
    
    // Filtrar por usuário
    if (selectedUser !== "all") {
      dayAppointments = dayAppointments.filter(appt => appt.userId === selectedUser)
    }
    
    // Filtrar por intervalo de datas
    if (!isDateInRange(dateKey)) {
      return []
    }
    
    return dayAppointments
  }

  const getUserById = (userId: string) => {
    return allUsers.find(user => user.id === userId) || allUsers[0]
  }

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  const resetFilters = () => {
    setSelectedUser("all")
    setStartDate("")
    setEndDate("")
  }

  const hasActiveFilters = selectedUser !== "all" || startDate || endDate

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = []
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }, [startingDayOfWeek, daysInMonth])

  return (
    <div className="max-w-7xl mt-4 mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Calendário</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Visualize e gerencie os usuários distribuídos ao longo dos próximos dias.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-semibold">
                {months[month]} {year}
              </h2>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                size="sm"
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filtros</span>
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  size="sm"
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">Resetar</span>
                </Button>
              )}
              <Button variant="outline" onClick={goToToday} size="sm">
                Hoje
              </Button>
            </div>
          </div>

          {/* Month/Year Display */}
          <div className="flex items-center justify-start">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={previousMonth} className="h-9 w-9">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth} className="h-9 w-9">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="bg-background/50 border-none">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="user">Filtrar por usuário</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger id="user">
                      <SelectValue placeholder="Todos os usuários" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os usuários</SelectItem>
                      {allUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={user.avatar} alt={user.fullName} />
                              <AvatarFallback className="text-[10px]">
                                {user.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            {user.fullName}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 space-y-2">
                  <Label htmlFor="startDate">Data inicial</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <Label htmlFor="endDate">Data final</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Calendar Grid */}
        <Card className="bg-card overflow-hidden">
          <CardContent className="p-2 sm:p-4 overflow-hidden">
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {/* Week Days Header */}
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-2"
                >
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day[0]}</span>
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]"></div>
                }

                const dayAppointments = getAppointmentsForDay(day)
                const today = isToday(day)

                return (
                  <div
                    key={day}
                    className={`min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] bg-muted/60 border rounded-lg p-1 sm:p-2 ${
                      today ? "border-[#23b559] bg-[#23b559]/5" : "border-border"
                    }`}
                  >
                    <div
                      className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                        today ? "text-[#23b559]" : "text-foreground"
                      }`}
                    >
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.length === 0 ? (
                        <div className="text-[10px] sm:text-xs text-muted-foreground/50 text-center py-1 sm:py-2">
                          <span className="hidden sm:inline">Sem eventos</span>
                        </div>
                      ) : (
                        <>
                          {dayAppointments.slice(0, 3).map((appointment) => {
                            const user = getUserById(appointment.userId)
                            return (
                              <div
                                key={appointment.id}
                                onClick={() => handleAppointmentClick(appointment)}
                                className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs p-1 sm:p-1.5 rounded bg-muted hover:bg-muted cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] group"
                              >
                                <Avatar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 shrink-0 group-hover:ring-2 group-hover:ring-[#23b559] transition-all">
                                  <AvatarImage src={user.avatar} alt={user.fullName} />
                                  <AvatarFallback className="text-[8px] sm:text-[10px] font-medium">
                                    {user.fullName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                      .slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <span className="truncate flex-1 font-medium hidden sm:inline block">{user.fullName}</span>
                                  <span className="text-[9px] text-muted-foreground hidden sm:block">{appointment.time}</span>
                                </div>
                              </div>
                            )
                          })}
                          {dayAppointments.length > 3 && (
                            <div className="text-[10px] sm:text-xs text-muted-foreground text-center py-0.5 sm:py-1">
                              +{dayAppointments.length - 3}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Detalhes do Agendamento */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes do Agendamento</DialogTitle>
                <DialogDescription>
                  Informações completas do agendamento
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                {/* Informações do Usuário */}
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={getUserById(selectedAppointment.userId).avatar} alt={getUserById(selectedAppointment.userId).fullName} />
                    <AvatarFallback>
                      {getUserById(selectedAppointment.userId).fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold">{getUserById(selectedAppointment.userId).fullName}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{getUserById(selectedAppointment.userId).email}</p>
                    </div>
                  </div>
                </div>

                {/* Data e Hora */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Data</span>
                    </div>
                    <p className="font-medium">{formatDateDisplay(selectedAppointment.date)}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Horário</span>
                    </div>
                    <p className="font-medium">{selectedAppointment.time}</p>
                  </div>
                </div>

                {/* Tipo e Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <Badge variant="outline" className="w-fit">
                      {selectedAppointment.type}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge 
                      variant={
                        selectedAppointment.status === "Confirmado" ? "default" :
                        selectedAppointment.status === "Agendado" ? "secondary" :
                        selectedAppointment.status === "Pendente" ? "outline" :
                        "destructive"
                      }
                      className="w-fit"
                    >
                      {selectedAppointment.status}
                    </Badge>
                  </div>
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="text-sm">{selectedAppointment.description}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
