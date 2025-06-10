"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Users,
  Monitor,
  Eye,
  Clock,
  Building,
  Calendar,
  RotateCcw,
} from "lucide-react"

const mockRooms = [
  {
    id: "1",
    name: "Amphi A",
    type: "Amphithéâtre",
    capacity: 200,
    departments: [
      {
        name: "Commun",
        schedule: { type: "full", pattern: "Toute la semaine" },
      },
    ],
    location: "Bâtiment Principal - RDC",
    equipment: ["Projecteur", "Micro", "Tableau numérique"],
    status: "Disponible",
    isShared: false,
  },
  {
    id: "2",
    name: "Amphi B",
    type: "Amphithéâtre",
    capacity: 150,
    departments: [
      {
        name: "Mathématiques",
        schedule: {
          type: "weekly",
          pattern: "Lun-Mer 08:00-12:00, Ven 14:00-18:00",
        },
      },
      {
        name: "Informatique",
        schedule: {
          type: "weekly",
          pattern: "Mar-Jeu 08:00-18:00, Ven 08:00-12:00",
        },
      },
    ],
    location: "Bâtiment Principal - 1er étage",
    equipment: ["Projecteur", "Micro"],
    status: "Occupée",
    isShared: true,
  },
  {
    id: "3",
    name: "Lab Multidisciplinaire",
    type: "TP",
    capacity: 30,
    departments: [
      {
        name: "Sciences de la Matière",
        schedule: {
          type: "alternating",
          pattern: "Semaines paires: Lun-Ven 08:00-12:00",
        },
      },
      {
        name: "Sciences de la Nature et de la Vie",
        schedule: {
          type: "alternating",
          pattern: "Semaines impaires: Lun-Ven 08:00-12:00",
        },
      },
    ],
    location: "Bâtiment Sciences - RDC",
    equipment: ["Équipement scientifique", "Tableau blanc"],
    status: "Disponible",
    isShared: true,
  },
]

const departments = [
  "Commun",
  "Architecture",
  "Mathématiques",
  "Informatique",
  "Sciences de la Matière",
  "Sciences de la Nature et de la Vie",
]

const roomTypes = ["Amphithéâtre", "TD", "TP", "Bureau"]

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
const timeSlots = ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00"]

const scheduleTypes = [
  { value: "full", label: "Accès complet" },
  { value: "weekly", label: "Horaires hebdomadaires" },
  { value: "alternating", label: "Alternance (semaines paires/impaires)" },
  { value: "custom", label: "Planning personnalisé" },
]

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState(mockRooms)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [newRoom, setNewRoom] = useState({
    name: "",
    type: "",
    capacity: "",
    location: "",
    equipment: "",
    selectedDepartments: [] as string[],
    departmentSchedules: {} as Record<string, any>,
  })

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.departments.some((dept) => dept.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDepartmentChange = (department: string, checked: boolean) => {
    if (checked) {
      setNewRoom({
        ...newRoom,
        selectedDepartments: [...newRoom.selectedDepartments, department],
        departmentSchedules: {
          ...newRoom.departmentSchedules,
          [department]: {
            type: "full",
            weeklySchedule: {},
            alternatingSchedule: { evenWeeks: "", oddWeeks: "" },
            customSchedule: "",
          },
        },
      })
    } else {
      const updatedDepartments = newRoom.selectedDepartments.filter((d) => d !== department)
      const updatedSchedules = { ...newRoom.departmentSchedules }
      delete updatedSchedules[department]
      setNewRoom({
        ...newRoom,
        selectedDepartments: updatedDepartments,
        departmentSchedules: updatedSchedules,
      })
    }
  }

  const handleScheduleTypeChange = (department: string, scheduleType: string) => {
    setNewRoom({
      ...newRoom,
      departmentSchedules: {
        ...newRoom.departmentSchedules,
        [department]: {
          ...newRoom.departmentSchedules[department],
          type: scheduleType,
        },
      },
    })
  }

  const handleWeeklyScheduleChange = (department: string, day: string, timeSlot: string, checked: boolean) => {
    const currentSchedule = newRoom.departmentSchedules[department]?.weeklySchedule || {}
    const daySchedule = currentSchedule[day] || []

    let updatedDaySchedule
    if (checked) {
      updatedDaySchedule = [...daySchedule, timeSlot]
    } else {
      updatedDaySchedule = daySchedule.filter((slot: string) => slot !== timeSlot)
    }

    setNewRoom({
      ...newRoom,
      departmentSchedules: {
        ...newRoom.departmentSchedules,
        [department]: {
          ...newRoom.departmentSchedules[department],
          weeklySchedule: {
            ...currentSchedule,
            [day]: updatedDaySchedule,
          },
        },
      },
    })
  }

  const generateSchedulePattern = (department: string) => {
    const schedule = newRoom.departmentSchedules[department]
    if (!schedule) return "Non défini"

    switch (schedule.type) {
      case "full":
        return "Accès complet - Toute la semaine"
      case "weekly":
        const weeklyPattern = Object.entries(schedule.weeklySchedule || {})
          .filter(([_, slots]) => (slots as string[]).length > 0)
          .map(([day, slots]) => `${day}: ${(slots as string[]).join(", ")}`)
          .join(" | ")
        return weeklyPattern || "Horaires non définis"
      case "alternating":
        return `Semaines paires: ${schedule.alternatingSchedule?.evenWeeks || "Non défini"} | Semaines impaires: ${schedule.alternatingSchedule?.oddWeeks || "Non défini"}`
      case "custom":
        return schedule.customSchedule || "Planning personnalisé non défini"
      default:
        return "Non défini"
    }
  }

  const handleAddRoom = () => {
    const departmentData = newRoom.selectedDepartments.map((dept) => ({
      name: dept,
      schedule: {
        type: newRoom.departmentSchedules[dept]?.type || "full",
        pattern: generateSchedulePattern(dept),
      },
    }))

    const room = {
      id: (rooms.length + 1).toString(),
      name: newRoom.name,
      type: newRoom.type,
      capacity: Number.parseInt(newRoom.capacity),
      departments: departmentData,
      location: newRoom.location,
      equipment: newRoom.equipment.split(",").map((item) => item.trim()),
      status: "Disponible",
      isShared: newRoom.selectedDepartments.length > 1,
    }
    setRooms([...rooms, room])
    setNewRoom({
      name: "",
      type: "",
      capacity: "",
      location: "",
      equipment: "",
      selectedDepartments: [],
      departmentSchedules: {},
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter((room) => room.id !== roomId))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Disponible":
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>
      case "Occupée":
        return <Badge className="bg-red-100 text-red-800">Occupée</Badge>
      case "Maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRoomIcon = (type: string) => {
    switch (type) {
      case "Amphithéâtre":
        return <Users className="h-4 w-4" />
      case "TP":
        return <Monitor className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getScheduleIcon = (scheduleType: string) => {
    switch (scheduleType) {
      case "weekly":
        return <Calendar className="h-3 w-3" />
      case "alternating":
        return <RotateCcw className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getDepartmentDisplay = (room: any) => {
    if (!room.isShared) {
      return (
        <div className="flex items-center">
          <Building className="h-3 w-3 mr-1" />
          <span>{room.departments[0].name}</span>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center">
          <Building className="h-3 w-3 mr-1" />
          <Badge variant="outline" className="text-xs">
            Partagée
          </Badge>
        </div>
        {room.departments.map((dept: any, index: number) => (
          <div key={index} className="text-xs border-l-2 border-gray-200 pl-2">
            <div className="font-medium text-gray-800">{dept.name}</div>
            <div className="flex items-center mt-1 text-gray-600">
              {getScheduleIcon(dept.schedule.type)}
              <span className="ml-1 text-xs">{dept.schedule.pattern}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Salles</h1>
              <p className="text-gray-600">Gérer toutes les salles de l'université</p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une Salle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter une Nouvelle Salle</DialogTitle>
                <DialogDescription>
                  Remplissez les informations de la nouvelle salle et configurez les horaires d'accès.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de la salle</Label>
                    <Input
                      id="name"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={newRoom.type} onValueChange={(value) => setNewRoom({ ...newRoom, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacité</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={newRoom.capacity}
                      onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Input
                      id="location"
                      value={newRoom.location}
                      onChange={(e) => setNewRoom({ ...newRoom, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipment">Équipements</Label>
                  <Textarea
                    id="equipment"
                    placeholder="Séparer par des virgules"
                    value={newRoom.equipment}
                    onChange={(e) => setNewRoom({ ...newRoom, equipment: e.target.value })}
                  />
                </div>

                {/* Department Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Départements et Horaires d'Accès</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {departments.map((dept) => (
                      <div key={dept} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={dept}
                            checked={newRoom.selectedDepartments.includes(dept)}
                            onCheckedChange={(checked) => handleDepartmentChange(dept, checked as boolean)}
                          />
                          <Label htmlFor={dept} className="font-medium">
                            {dept}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schedule Configuration */}
                {newRoom.selectedDepartments.length > 0 && (
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Configuration des Horaires</Label>
                    <Tabs defaultValue={newRoom.selectedDepartments[0]} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        {newRoom.selectedDepartments.slice(0, 3).map((dept) => (
                          <TabsTrigger key={dept} value={dept} className="text-xs">
                            {dept}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {newRoom.selectedDepartments.map((dept) => (
                        <TabsContent key={dept} value={dept} className="space-y-4">
                          <div className="space-y-2">
                            <Label>Type de planning pour {dept}</Label>
                            <Select
                              value={newRoom.departmentSchedules[dept]?.type || "full"}
                              onValueChange={(value) => handleScheduleTypeChange(dept, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {scheduleTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {newRoom.departmentSchedules[dept]?.type === "weekly" && (
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">Horaires hebdomadaires</Label>
                              <div className="grid gap-3">
                                {days.map((day) => (
                                  <div key={day} className="space-y-2">
                                    <Label className="text-sm">{day}</Label>
                                    <div className="flex flex-wrap gap-2">
                                      {timeSlots.map((slot) => (
                                        <div key={slot} className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`${dept}-${day}-${slot}`}
                                            checked={
                                              newRoom.departmentSchedules[dept]?.weeklySchedule?.[day]?.includes(
                                                slot,
                                              ) || false
                                            }
                                            onCheckedChange={(checked) =>
                                              handleWeeklyScheduleChange(dept, day, slot, checked as boolean)
                                            }
                                          />
                                          <Label htmlFor={`${dept}-${day}-${slot}`} className="text-xs">
                                            {slot}
                                          </Label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {newRoom.departmentSchedules[dept]?.type === "alternating" && (
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">Planning alternatif</Label>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-sm">Semaines paires</Label>
                                  <Input
                                    placeholder="Ex: Lun-Ven 08:00-12:00"
                                    value={newRoom.departmentSchedules[dept]?.alternatingSchedule?.evenWeeks || ""}
                                    onChange={(e) =>
                                      setNewRoom({
                                        ...newRoom,
                                        departmentSchedules: {
                                          ...newRoom.departmentSchedules,
                                          [dept]: {
                                            ...newRoom.departmentSchedules[dept],
                                            alternatingSchedule: {
                                              ...newRoom.departmentSchedules[dept]?.alternatingSchedule,
                                              evenWeeks: e.target.value,
                                            },
                                          },
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm">Semaines impaires</Label>
                                  <Input
                                    placeholder="Ex: Mar-Jeu 14:00-18:00"
                                    value={newRoom.departmentSchedules[dept]?.alternatingSchedule?.oddWeeks || ""}
                                    onChange={(e) =>
                                      setNewRoom({
                                        ...newRoom,
                                        departmentSchedules: {
                                          ...newRoom.departmentSchedules,
                                          [dept]: {
                                            ...newRoom.departmentSchedules[dept],
                                            alternatingSchedule: {
                                              ...newRoom.departmentSchedules[dept]?.alternatingSchedule,
                                              oddWeeks: e.target.value,
                                            },
                                          },
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {newRoom.departmentSchedules[dept]?.type === "custom" && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Planning personnalisé</Label>
                              <Textarea
                                placeholder="Décrivez le planning personnalisé..."
                                value={newRoom.departmentSchedules[dept]?.customSchedule || ""}
                                onChange={(e) =>
                                  setNewRoom({
                                    ...newRoom,
                                    departmentSchedules: {
                                      ...newRoom.departmentSchedules,
                                      [dept]: {
                                        ...newRoom.departmentSchedules[dept],
                                        customSchedule: e.target.value,
                                      },
                                    },
                                  })
                                }
                              />
                            </div>
                          )}

                          <div className="p-3 bg-gray-50 rounded-lg">
                            <Label className="text-sm font-medium">Aperçu du planning:</Label>
                            <p className="text-sm text-gray-600 mt-1">{generateSchedulePattern(dept)}</p>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddRoom} disabled={newRoom.selectedDepartments.length === 0}>
                  Ajouter la Salle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, département ou type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rooms Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Salles ({filteredRooms.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacité</TableHead>
                  <TableHead>Département(s) et Horaires</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {getRoomIcon(room.type)}
                        <span className="ml-2">{room.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{room.type}</TableCell>
                    <TableCell>{room.capacity} places</TableCell>
                    <TableCell className="max-w-xs">{getDepartmentDisplay(room)}</TableCell>
                    <TableCell>{room.location}</TableCell>
                    <TableCell>{getStatusBadge(room.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link href={`/salles/${room.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRoom(room.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
