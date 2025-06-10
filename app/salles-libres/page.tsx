"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Search, MapPin, Users, Monitor } from "lucide-react"

const departments = [
  "Tous les départements",
  "Architecture",
  "Mathématiques",
  "Informatique",
  "Sciences de la Matière",
  "Sciences de la Nature et de la Vie",
]

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]
const timeSlots = ["08:00-09:30", "09:45-11:15", "11:30-13:00", "14:00-15:30", "15:45-17:15"]

const mockRooms = [
  { id: "amphi-a", name: "Amphi A", type: "Amphithéâtre", capacity: 200, department: "Commun", available: true },
  { id: "amphi-b", name: "Amphi B", type: "Amphithéâtre", capacity: 150, department: "Commun", available: false },
  { id: "salle-101", name: "Salle 101", type: "TD", capacity: 40, department: "Mathématiques", available: true },
  { id: "salle-102", name: "Salle 102", type: "TD", capacity: 35, department: "Mathématiques", available: true },
  { id: "lab-info", name: "Lab Informatique", type: "TP", capacity: 25, department: "Informatique", available: false },
  {
    id: "lab-physique",
    name: "Lab Physique",
    type: "TP",
    capacity: 30,
    department: "Sciences de la Matière",
    available: true,
  },
  {
    id: "lab-chimie",
    name: "Lab Chimie",
    type: "TP",
    capacity: 20,
    department: "Sciences de la Matière",
    available: true,
  },
  { id: "salle-201", name: "Salle 201", type: "TD", capacity: 45, department: "Architecture", available: true },
]

export default function FreeRoomsPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("Tous les départements")
  const [selectedDay, setSelectedDay] = useState("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [roomType, setRoomType] = useState("Tous")

  const filteredRooms = mockRooms.filter((room) => {
    if (selectedDepartment !== "Tous les départements" && room.department !== selectedDepartment) {
      return false
    }
    if (roomType !== "Tous" && room.type !== roomType) {
      return false
    }
    return room.available
  })

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Salles Libres</h1>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Filtres de Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Département</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Jour</label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un jour" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Créneau</label>
                <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un créneau" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type de Salle</label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tous">Tous</SelectItem>
                    <SelectItem value="Amphithéâtre">Amphithéâtre</SelectItem>
                    <SelectItem value="TD">TD</SelectItem>
                    <SelectItem value="TP">TP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Salles Disponibles ({filteredRooms.length} résultats)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map((room) => (
                <Card key={room.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        {getRoomIcon(room.type)}
                        <h3 className="font-semibold ml-2">{room.name}</h3>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Libre</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        Type: <span className="font-medium">{room.type}</span>
                      </div>
                      <div>
                        Capacité: <span className="font-medium">{room.capacity} places</span>
                      </div>
                      <div>
                        Département: <span className="font-medium">{room.department}</span>
                      </div>
                    </div>
                    <Link href={`/salles/${room.id}`}>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        Voir l'emploi du temps
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredRooms.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune salle libre trouvée avec ces critères.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
