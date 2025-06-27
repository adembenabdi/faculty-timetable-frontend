"use client"

import { useState, useEffect } from "react"
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
  Loader2,
} from "lucide-react"

interface Room {
  id: string
  name: string
  code: string
  type: string
  capacity: number
  building: string
  floor: number
  equipment: string[] | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface DepartmentSchedule {
  type: string
  weeklySchedule?: Record<string, string[]>
  alternatingSchedule?: {
    evenWeeks: string
    oddWeeks: string
  }
  customSchedule?: string
}

interface NewRoom {
  name: string
  code: string
  type: string
  capacity: string
  building: string
  floor: string
  equipment: string
  selectedDepartments: string[]
  departmentSchedules: Record<string, DepartmentSchedule>
}

const departments = [
  "Commun",
  "Architecture",
  "Mathématiques",
  "Informatique",
  "Sciences de la Matière",
  "Sciences de la Nature et de la Vie",
]

const roomTypes = [
  { value: "amphi", label: "Amphithéâtre" },
  { value: "td", label: "TD" },
  { value: "tp", label: "TP" },
  { value: "lab", label: "Laboratoire" },
  { value: "bureau", label: "Bureau" },
]

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
const timeSlots = ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00"]

const scheduleTypes = [
  { value: "full", label: "Accès complet" },
  { value: "weekly", label: "Horaires hebdomadaires" },
  { value: "alternating", label: "Alternance (semaines paires/impaires)" },
  { value: "custom", label: "Planning personnalisé" },
]

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [newRoom, setNewRoom] = useState<NewRoom>({
    name: "",
    code: "",
    type: "",
    capacity: "",
    building: "",
    floor: "",
    equipment: "",
    selectedDepartments: [],
    departmentSchedules: {},
  })
  const [freeSearchTerm, setFreeSearchTerm] = useState("")
  const [selectedDay, setSelectedDay] = useState(days[0])
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([timeSlots[0]])
  const [selectedDepartment, setSelectedDepartment] = useState("Tous")
  const [selectedType, setSelectedType] = useState("Tous")
  const [minCapacity, setMinCapacity] = useState("")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  // Pending states for free rooms filters
  const [pendingFreeSearchTerm, setPendingFreeSearchTerm] = useState("")
  const [pendingSelectedDay, setPendingSelectedDay] = useState(days[0])
  const [pendingSelectedTimeSlots, setPendingSelectedTimeSlots] = useState<string[]>([timeSlots[0]])
  const [pendingSelectedDepartment, setPendingSelectedDepartment] = useState("Tous")
  const [pendingSelectedType, setPendingSelectedType] = useState("Tous")
  const [pendingMinCapacity, setPendingMinCapacity] = useState("")

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true)
        const res = await fetch("http://localhost:5000/api/salles")
        if (!res.ok) throw new Error("Failed to fetch salles")
        const data = await res.json()
        setRooms(data)
      } catch (error) {
        console.error("❌ Failed to load salles:", error)
        setError("Échec du chargement des salles")
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleAddRoom = async () => {
    try {
      const roomData = {
        name: newRoom.name,
        code: newRoom.code,
        type: newRoom.type,
        capacity: parseInt(newRoom.capacity),
        building: newRoom.building,
        floor: parseInt(newRoom.floor),
        equipment: newRoom.equipment ? newRoom.equipment.split(",").map(item => item.trim()) : null,
      }

      const res = await fetch("http://localhost:5000/api/salles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      })

      if (!res.ok) throw new Error("Failed to create room")
      
      const createdRoom = await res.json()
      setRooms([...rooms, createdRoom])
      
      setNewRoom({
        name: "",
        code: "",
        type: "",
        capacity: "",
        building: "",
        floor: "",
        equipment: "",
        selectedDepartments: [],
        departmentSchedules: {},
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("❌ Failed to create room:", error)
      setError("Échec de la création de la salle")
    }
  }

  const handleDeleteRoom = async (roomId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/salles/${roomId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete room")
      
      setRooms(rooms.filter((room) => room.id !== roomId))
    } catch (error) {
      console.error("❌ Failed to delete room:", error)
      setError("Échec de la suppression de la salle")
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Inactive</Badge>
    )
  }

  const getRoomIcon = (type: string) => {
    switch (type) {
      case "amphi":
        return <Users className="h-4 w-4" />
      case "tp":
      case "lab":
        return <Monitor className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getRoomTypeLabel = (type: string) => {
    const roomType = roomTypes.find(rt => rt.value === type)
    return roomType ? roomType.label : type
  }

  const getLocationDisplay = (room: Room) => {
    return `${room.building} - ${room.floor === 0 ? 'RDC' : `Étage ${room.floor}`}`
  }

  function isRoomFree(room: Room, day: string, timeSlots: string[]): boolean {
    return true
  }

  const freeRooms = rooms.filter((room: Room) => {
    const isFree = isRoomFree(room, selectedDay, selectedTimeSlots)
    const matchesSearch = room.name.toLowerCase().includes(freeSearchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(freeSearchTerm.toLowerCase())
    const matchesDepartment = true // Always true until departments are available on Room
    const matchesType = selectedType === "Tous" || getRoomTypeLabel(room.type) === selectedType
    const matchesCapacity = !minCapacity || room.capacity >= parseInt(minCapacity)
    return isFree && matchesSearch && matchesDepartment && matchesType && matchesCapacity
  })

  const resetFilters = () => {
    setFreeSearchTerm("")
    setSelectedDay(days[0])
    setSelectedTimeSlots([timeSlots[0]])
    setSelectedDepartment("Tous")
    setSelectedType("Tous")
    setMinCapacity("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement des salles...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="manage" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="manage">Gestion des Salles</TabsTrigger>
            <TabsTrigger value="free">Salles Libres</TabsTrigger>
          </TabsList>
          <TabsContent value="manage">
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
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Ajouter une Nouvelle Salle</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations de la nouvelle salle.
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
                          placeholder="Ex: Amphithéâtre A"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="code">Code</Label>
                        <Input
                          id="code"
                          value={newRoom.code}
                          onChange={(e) => setNewRoom({ ...newRoom, code: e.target.value })}
                          placeholder="Ex: AMPHI-A"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select value={newRoom.type} onValueChange={(value) => setNewRoom({ ...newRoom, type: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                          <SelectContent>
                            {roomTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Capacité</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={newRoom.capacity}
                          onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                          placeholder="Ex: 50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="building">Bâtiment</Label>
                        <Input
                          id="building"
                          value={newRoom.building}
                          onChange={(e) => setNewRoom({ ...newRoom, building: e.target.value })}
                          placeholder="Ex: Bâtiment Principal"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="floor">Étage</Label>
                        <Input
                          id="floor"
                          type="number"
                          value={newRoom.floor}
                          onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
                          placeholder="Ex: 0 pour RDC"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="equipment">Équipements (optionnel)</Label>
                      <Textarea
                        id="equipment"
                        placeholder="Séparer par des virgules (Ex: Projecteur, Micro, Tableau numérique)"
                        value={newRoom.equipment}
                        onChange={(e) => setNewRoom({ ...newRoom, equipment: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      onClick={handleAddRoom} 
                      disabled={!newRoom.name || !newRoom.code || !newRoom.type || !newRoom.capacity || !newRoom.building}
                    >
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
                      placeholder="Rechercher par nom, code, type ou bâtiment..."
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
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacité</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Équipements</TableHead>
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
                        <TableCell className="font-mono text-sm">{room.code}</TableCell>
                        <TableCell>{getRoomTypeLabel(room.type)}</TableCell>
                        <TableCell>{room.capacity} places</TableCell>
                        <TableCell>{getLocationDisplay(room)}</TableCell>
                        <TableCell className="max-w-xs">
                          {room.equipment && room.equipment.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {room.equipment.slice(0, 2).map((eq, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {eq}
                                </Badge>
                              ))}
                              {room.equipment.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{room.equipment.length - 2}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">Aucun</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(room.is_active)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Link href={`/salles/${room.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedRoom(room)
                                setIsEditDialogOpen(true)
                              }}
                            >
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
                {filteredRooms.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucune salle trouvée
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="free">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-gray-900">Salles Libres</h1>
                <p className="text-gray-600 ml-4">Trouver des salles disponibles selon vos critères</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <span>Filtres Avancés</span>
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  <span>Réinitialiser</span>
                </Button>
              </div>
            </div>
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher par nom ou localisation..."
                      value={pendingFreeSearchTerm}
                      onChange={(e) => setPendingFreeSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div>
                    <Label>Jour</Label>
                    <Select value={pendingSelectedDay} onValueChange={setPendingSelectedDay}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Créneaux</Label>
                    <div className="flex flex-wrap gap-2">
                      {timeSlots.map((slot) => (
                        <label key={slot} className="flex items-center space-x-1">
                          <Checkbox
                            checked={pendingSelectedTimeSlots.includes(slot)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setPendingSelectedTimeSlots([...pendingSelectedTimeSlots, slot])
                              } else {
                                setPendingSelectedTimeSlots(pendingSelectedTimeSlots.filter((s) => s !== slot))
                              }
                            }}
                            id={`slot-${slot}`}
                          />
                          <span>{slot}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button onClick={() => {
                    setFreeSearchTerm(pendingFreeSearchTerm)
                    setSelectedDay(pendingSelectedDay)
                    setSelectedTimeSlots(pendingSelectedTimeSlots)
                    setSelectedDepartment(pendingSelectedDepartment)
                    setSelectedType(pendingSelectedType)
                    setMinCapacity(pendingMinCapacity)
                  }}>
                    Filtrer
                  </Button>
                </div>
              </CardContent>
            </Card>
            {showAdvancedFilters && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Département</Label>
                      <Select value={pendingSelectedDepartment} onValueChange={setPendingSelectedDepartment}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Tous", ...departments].map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Type de Salle</Label>
                      <Select value={pendingSelectedType} onValueChange={setPendingSelectedType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Tous", ...roomTypes.map(rt => rt.label)].map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Capacité Minimum</Label>
                      <Input
                        type="number"
                        placeholder="Ex: 30"
                        value={pendingMinCapacity}
                        onChange={(e) => setPendingMinCapacity(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button variant="outline" onClick={resetFilters} className="w-full">
                        Réinitialiser
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Salles Libres ({freeRooms.length})
                  </h2>
                  <p className="text-gray-600">
                    Pour le {selectedDay} de {selectedTimeSlots.join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total des salles</p>
                  <p className="text-2xl font-bold text-blue-600">{rooms.length}</p>
                </div>
              </div>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacité</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {freeRooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {getRoomIcon(room.type)}
                            <span className="ml-2">{room.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getRoomTypeLabel(room.type)}</TableCell>
                        <TableCell>{room.capacity} places</TableCell>
                        <TableCell>{getLocationDisplay(room)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Link href={`/salles/${room.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {freeRooms.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Aucune salle libre trouvée</p>
                    <p className="text-sm">
                      Essayez de modifier vos critères de recherche ou de changer le créneau horaire.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}