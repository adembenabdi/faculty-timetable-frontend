import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, MapPin, Users, Monitor, Clock, User } from "lucide-react"

// Mock room data
const roomData: { [key: string]: any } = {
  "amphi-a": {
    name: "Amphi A",
    type: "Amphithéâtre",
    capacity: 200,
    department: "Commun",
    equipment: ["Projecteur", "Micro", "Tableau numérique"],
    location: "Bâtiment Principal - RDC",
  },
  "lab-info": {
    name: "Lab Informatique",
    type: "TP",
    capacity: 25,
    department: "Informatique",
    equipment: ["25 PC", "Projecteur", "Tableau blanc"],
    location: "Bâtiment Informatique - 1er étage",
  },
}

// Mock room timetable
const roomTimetable = {
  "08:00-09:30": {
    Lundi: { subject: "Mathématiques", professor: "Dr. Benali", class: "L1 A", type: "Cours" },
    Mardi: null,
    Mercredi: { subject: "Physique", professor: "Dr. Mansouri", class: "L2 B", type: "Cours" },
    Jeudi: null,
    Vendredi: { subject: "Chimie", professor: "Dr. Amara", class: "L3 A", type: "Cours" },
  },
  "09:45-11:15": {
    Lundi: null,
    Mardi: { subject: "Informatique", professor: "Dr. Khelifi", class: "L2 A", type: "Cours" },
    Mercredi: null,
    Jeudi: { subject: "Mathématiques", professor: "Dr. Benali", class: "L1 B", type: "Cours" },
    Vendredi: null,
  },
  "11:30-13:00": {
    Lundi: { subject: "Physique", professor: "Dr. Mansouri", class: "L1 C", type: "Cours" },
    Mardi: null,
    Mercredi: { subject: "Informatique", professor: "Dr. Khelifi", class: "L3 A", type: "Cours" },
    Jeudi: null,
    Vendredi: { subject: "Anglais", professor: "Ms. Smith", class: "L2 B", type: "Cours" },
  },
  "14:00-15:30": {
    Lundi: null,
    Mardi: { subject: "Chimie", professor: "Dr. Amara", class: "L2 A", type: "Cours" },
    Mercredi: null,
    Jeudi: { subject: "Physique", professor: "Dr. Mansouri", class: "L3 B", type: "Cours" },
    Vendredi: null,
  },
  "15:45-17:15": {
    Lundi: null,
    Mardi: null,
    Mercredi: null,
    Jeudi: null,
    Vendredi: null,
  },
}

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]
const timeSlots = Object.keys(roomTimetable)

const getSubjectColor = (type: string) => {
  switch (type) {
    case "Cours":
      return "bg-blue-100 border-blue-300 text-blue-800"
    case "TD":
      return "bg-green-100 border-green-300 text-green-800"
    case "TP":
      return "bg-purple-100 border-purple-300 text-purple-800"
    default:
      return "bg-gray-100 border-gray-300 text-gray-800"
  }
}

const getRoomIcon = (type: string) => {
  switch (type) {
    case "Amphithéâtre":
      return <Users className="h-5 w-5" />
    case "TP":
      return <Monitor className="h-5 w-5" />
    default:
      return <MapPin className="h-5 w-5" />
  }
}

export default async function RoomTimetablePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const room = roomData[id] || roomData["amphi-a"]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/salles-libres">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Emploi du Temps - {room.name}</h1>
              <p className="text-gray-600">{room.location}</p>
            </div>
          </div>
          <Button className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Voir sur le plan
          </Button>
        </div>

        {/* Room Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              {getRoomIcon(room.type)}
              <span className="ml-2">Informations de la Salle</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nom</p>
                <p className="font-semibold">{room.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-semibold">{room.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Capacité</p>
                <p className="font-semibold">{room.capacity} places</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Département</p>
                <p className="font-semibold">{room.department}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Équipements</p>
              <div className="flex flex-wrap gap-2">
                {room.equipment.map((item: string) => (
                  <span key={item} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timetable */}
        <Card>
          <CardHeader>
            <CardTitle>Occupation - Semaine du 15-19 Janvier 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-3 bg-gray-100 text-left font-semibold">
                      <Clock className="h-4 w-4 inline mr-2" />
                      Horaires
                    </th>
                    {days.map((day) => (
                      <th
                        key={day}
                        className="border border-gray-300 p-3 bg-gray-100 text-center font-semibold min-w-[200px]"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((timeSlot) => (
                    <tr key={timeSlot}>
                      <td className="border border-gray-300 p-3 bg-gray-50 font-medium text-sm">{timeSlot}</td>
                      {days.map((day) => {
                        const course =
                          roomTimetable[timeSlot as keyof typeof roomTimetable][
                            day as keyof (typeof roomTimetable)[keyof typeof roomTimetable]
                          ]
                        return (
                          <td key={day} className="border border-gray-300 p-2">
                            {course ? (
                              <div className={`p-3 rounded-lg border-2 ${getSubjectColor(course.type)}`}>
                                <div className="font-semibold text-sm mb-1">{course.subject}</div>
                                <div className="text-xs space-y-1">
                                  <div className="flex items-center">
                                    <User className="h-3 w-3 mr-1" />
                                    {course.professor}
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {course.class}
                                  </div>
                                  <div className="font-medium">{course.type}</div>
                                </div>
                              </div>
                            ) : (
                              <div className="h-20 flex items-center justify-center text-gray-400 text-sm">Libre</div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">65%</div>
              <div className="text-sm text-gray-600">Taux d'occupation</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">13</div>
              <div className="text-sm text-gray-600">Heures utilisées/semaine</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">7</div>
              <div className="text-sm text-gray-600">Heures libres/semaine</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
