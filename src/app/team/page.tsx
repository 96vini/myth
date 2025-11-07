"use client"

import { useState } from "react"
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  MoreVerticalIcon,
  CalendarIcon,
  ClockIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UsersIcon,
  BriefcaseIcon,
  ActivityIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppTabsList from "@/components/app-tab-list"
import AppTabsTrigger from "@/components/app-tab/app-tab-trigger"

// Employee type definition
type Employee = {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  status: "active" | "inactive" | "vacation"
  hireDate: string
  salary?: string
}

// Schedule type definition
type Schedule = {
  id: string
  employeeId: string
  date: string
  startTime: string
  endTime: string
  status: "scheduled" | "completed" | "cancelled"
}

// Mock employees data
const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@company.com",
    phone: "+55 (11) 98765-4321",
    role: "Desenvolvedora Senior",
    department: "Tecnologia",
    status: "active",
    hireDate: "2022-03-15",
    salary: "R$ 12.000",
  },
  {
    id: "2",
    name: "Carlos Santos",
    email: "carlos.santos@company.com",
    phone: "+55 (11) 98765-4322",
    role: "Designer UX/UI",
    department: "Design",
    status: "active",
    hireDate: "2023-01-10",
    salary: "R$ 8.000",
  },
  {
    id: "3",
    name: "Maria Oliveira",
    email: "maria.oliveira@company.com",
    phone: "+55 (11) 98765-4323",
    role: "Gerente de Projetos",
    department: "Gestão",
    status: "vacation",
    hireDate: "2021-06-20",
    salary: "R$ 15.000",
  },
  {
    id: "4",
    name: "Pedro Costa",
    email: "pedro.costa@company.com",
    phone: "+55 (11) 98765-4324",
    role: "Desenvolvedor Junior",
    department: "Tecnologia",
    status: "active",
    hireDate: "2024-02-01",
    salary: "R$ 6.000",
  },
]

// Mock schedules data
const initialSchedules: Schedule[] = [
  {
    id: "1",
    employeeId: "1",
    date: "2024-11-01",
    startTime: "09:00",
    endTime: "18:00",
    status: "scheduled",
  },
  {
    id: "2",
    employeeId: "2",
    date: "2024-11-01",
    startTime: "10:00",
    endTime: "19:00",
    status: "scheduled",
  },
  {
    id: "3",
    employeeId: "4",
    date: "2024-11-01",
    startTime: "09:00",
    endTime: "18:00",
    status: "scheduled",
  },
  {
    id: "4",
    employeeId: "1",
    date: "2024-11-02",
    startTime: "09:00",
    endTime: "18:00",
    status: "completed",
  },
]

export default function TeamPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Employee, "id" | "hireDate">>({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    status: "active",
    salary: "",
  })

  // Filter employees based on search
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get schedules for selected date
  const getSchedulesForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return schedules.filter((schedule) => schedule.date === dateString)
  }

  // Get employee by id
  const getEmployeeById = (id: string) => {
    return employees.find((emp) => emp.id === id)
  }

  // Filter schedules by employee
  const filteredSchedules = getSchedulesForDate(selectedDate).filter(
    (schedule) => selectedEmployee === "all" || schedule.employeeId === selectedEmployee
  )

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Open dialog for adding new employee
  const handleAddEmployee = () => {
    setEditingEmployee(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      status: "active",
      salary: "",
    })
    setIsDialogOpen(true)
  }

  // Open dialog for editing employee
  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      department: employee.department,
      status: employee.status,
      salary: employee.salary,
    })
    setIsDialogOpen(true)
  }

  // Save employee (create or update)
  const handleSaveEmployee = () => {
    if (editingEmployee) {
      setEmployees(
        employees.map((e) =>
          e.id === editingEmployee.id ? { ...e, ...formData } : e
        )
      )
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...formData,
        hireDate: new Date().toISOString().split("T")[0],
      }
      setEmployees([...employees, newEmployee])
    }
    setIsDialogOpen(false)
  }

  // Open delete confirmation dialog
  const handleDeleteClick = (employeeId: string) => {
    setDeletingEmployeeId(employeeId)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete employee
  const handleConfirmDelete = () => {
    if (deletingEmployeeId) {
      setEmployees(employees.filter((e) => e.id !== deletingEmployeeId))
      setIsDeleteDialogOpen(false)
      setDeletingEmployeeId(null)
    }
  }

  // Get status badge variant
  const getStatusVariant = (status: Employee["status"]) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "vacation":
        return "outline"
      default:
        return "default"
    }
  }

  // Get schedule status badge variant
  const getScheduleStatusVariant = (status: Schedule["status"]) => {
    switch (status) {
      case "scheduled":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Navigate dates
  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setSelectedDate(newDate)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Tabs */}
        <Tabs defaultValue="schedule" className="w-full">
            <div className="flex justify-center mb-8">
              <AppTabsList>
                <AppTabsTrigger
                  value="schedule" 
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Horários
                </AppTabsTrigger>
                <AppTabsTrigger 
                  value="management"
                >
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Gerenciamento
                </AppTabsTrigger>
              </AppTabsList>
            </div>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6 animate-in fade-in-50 duration-500">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-background to-muted/30 shadow-2xl border border-border/50 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
              <div className="relative p-8">
                <div className="space-y-8">
                  {/* Date Navigation */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 backdrop-blur-sm border border-border/30">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateDate("prev")}
                      className="h-10 w-10 rounded-full hover:bg-background transition-all duration-200"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xl font-semibold capitalize tracking-tight">
                        {formatDate(selectedDate)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateDate("next")}
                      className="h-10 w-10 rounded-full hover:bg-background transition-all duration-200"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Employee Filter */}
                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/50">
                        <FilterIcon className="h-4 w-4" />
                      </div>
                      <span>Filtrar por funcionário</span>
                    </div>
                    <select
                      id="employee-filter"
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="flex h-11 w-full md:w-80 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm px-4 py-2 text-sm font-medium shadow-sm transition-all hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <option value="all">Todos os funcionários</option>
                      {employees
                        .filter((e) => e.status === "active")
                        .map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name} - {employee.role}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Schedule List */}
                  <div className="space-y-4">
                    {filteredSchedules.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mb-4">
                          <ClockIcon className="h-10 w-10" />
                        </div>
                        <p className="text-xl font-semibold mb-2">Nenhum horário encontrado</p>
                        <p className="text-sm text-muted-foreground/70">
                          Não há agendamentos para {formatDate(selectedDate)}
                        </p>
                      </div>
                    ) : (
                      filteredSchedules.map((schedule, index) => {
                        const employee = getEmployeeById(schedule.employeeId)
                        if (!employee) return null

                        return (
                          <div
                            key={schedule.id}
                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background to-muted/30 p-5 shadow-lg border border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.01] animate-in fade-in-50 slide-in-from-bottom-4"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/50" />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 ring-2 ring-background ring-offset-2 ring-offset-muted/20">
                                  <AvatarImage
                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.name}`}
                                  />
                                  <AvatarFallback className="text-sm font-semibold">
                                    {getInitials(employee.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <p className="text-lg font-semibold">{employee.name}</p>
                                    <Badge variant="outline" className="text-xs font-medium rounded-full">
                                      {employee.role}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
                                        <ClockIcon className="h-3 w-3 text-primary" />
                                      </div>
                                      <span className="font-medium">
                                        {schedule.startTime} - {schedule.endTime}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10">
                                        <BriefcaseIcon className="h-3 w-3 text-blue-500" />
                                      </div>
                                      <span className="font-medium">{employee.department}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Badge 
                                variant={getScheduleStatusVariant(schedule.status)}
                                className="rounded-full px-4 py-1.5 font-medium shadow-sm"
                              >
                                {schedule.status === "scheduled" && "Agendado"}
                                {schedule.status === "completed" && "Concluído"}
                                {schedule.status === "cancelled" && "Cancelado"}
                              </Badge>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-6 animate-in fade-in-50 duration-500">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-background to-muted/30 shadow-2xl border border-border/50 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
              <div className="relative p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Funcionários</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {filteredEmployees.length} funcionário(s) encontrado(s)
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="relative w-full md:w-72">
                      <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar funcionários..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 h-11 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm shadow-sm focus-visible:ring-primary"
                      />
                    </div>
                    <Button 
                      onClick={handleAddEmployee} 
                      className="w-full md:w-auto h-11 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Adicionar
                    </Button>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/50 overflow-hidden bg-background/50 backdrop-blur-sm shadow-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead className="font-semibold">Funcionário</TableHead>
                        <TableHead className="font-semibold">Contato</TableHead>
                        <TableHead className="font-semibold">Cargo</TableHead>
                        <TableHead className="font-semibold">Departamento</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Admissão</TableHead>
                        <TableHead className="text-right font-semibold">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={7} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-3">
                                <UserIcon className="h-8 w-8" />
                              </div>
                              <p className="font-medium">Nenhum funcionário encontrado</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredEmployees.map((employee, index) => (
                          <TableRow 
                            key={employee.id} 
                            className="border-border/30 hover:bg-muted/30 transition-colors animate-in fade-in-50 slide-in-from-bottom-2"
                            style={{ animationDelay: `${index * 30}ms` }}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 ring-2 ring-background ring-offset-1 ring-offset-muted/10">
                                  <AvatarImage
                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.name}`}
                                  />
                                  <AvatarFallback className="text-xs font-semibold">
                                    {getInitials(employee.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-semibold">{employee.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-sm">
                                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted/50">
                                    <MailIcon className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                  <span className="text-muted-foreground text-xs">
                                    {employee.email}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted/50">
                                    <PhoneIcon className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                  <span className="text-muted-foreground text-xs">
                                    {employee.phone}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-sm">{employee.role}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="rounded-full font-medium">
                                {employee.department}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusVariant(employee.status)} className="rounded-full font-medium">
                                {employee.status === "active" && "Ativo"}
                                {employee.status === "inactive" && "Inativo"}
                                {employee.status === "vacation" && "Férias"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {new Date(employee.hireDate).toLocaleDateString("pt-BR")}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-9 w-9 rounded-full hover:bg-muted/50"
                                  >
                                    <MoreVerticalIcon className="h-4 w-4" />
                                    <span className="sr-only">Abrir menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleEditEmployee(employee)}
                                    className="rounded-lg"
                                  >
                                    <EditIcon className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(employee.id)}
                                    className="text-destructive focus:text-destructive rounded-lg"
                                  >
                                    <TrashIcon className="mr-2 h-4 w-4" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Employee Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-3xl border-border/50">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold">
              {editingEmployee ? "Editar Funcionário" : "Novo Funcionário"}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingEmployee
                ? "Atualize as informações do funcionário abaixo."
                : "Preencha as informações do novo funcionário abaixo."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-6">
            <div className="grid gap-3">
              <Label htmlFor="name" className="text-sm font-semibold">Nome Completo</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex: João Silva"
                value={formData.name}
                onChange={handleInputChange}
                className="h-11 rounded-xl border-border/50 focus-visible:ring-primary"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email" className="text-sm font-semibold">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="joao.silva@empresa.com"
                value={formData.email}
                onChange={handleInputChange}
                className="h-11 rounded-xl border-border/50 focus-visible:ring-primary"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="phone" className="text-sm font-semibold">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+55 (11) 99999-9999"
                value={formData.phone}
                onChange={handleInputChange}
                className="h-11 rounded-xl border-border/50 focus-visible:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="role" className="text-sm font-semibold">Cargo</Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="Ex: Desenvolvedor"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="h-11 rounded-xl border-border/50 focus-visible:ring-primary"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="department" className="text-sm font-semibold">Departamento</Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="Ex: Tecnologia"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="h-11 rounded-xl border-border/50 focus-visible:ring-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="salary" className="text-sm font-semibold">Salário</Label>
                <Input
                  id="salary"
                  name="salary"
                  placeholder="R$ 0,00"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="h-11 rounded-xl border-border/50 focus-visible:ring-primary"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="status" className="text-sm font-semibold">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Employee["status"],
                    })
                  }
                  className="flex h-11 w-full rounded-xl border border-border/50 bg-background px-4 py-2 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="vacation">Férias</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="h-11 rounded-xl"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveEmployee}
              className="h-11 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {editingEmployee ? "Salvar Alterações" : "Criar Funcionário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-3xl border-border/50">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-base">
              Tem certeza que deseja excluir este funcionário? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="h-11 rounded-xl"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              className="h-11 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


