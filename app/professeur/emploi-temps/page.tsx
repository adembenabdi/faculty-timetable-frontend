import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Download, Clock, MapPin, User } from "lucide-react"

// Mock timetable for professor
const professorTimetable = {
  "08:00-09:30": {
    Lundi: { subject: "Mathématiques", room: "Amphi A", class: "L1 A", type: "Cours" },
    Mardi: null,
    Mercredi: { subject: "Algèbre", room: "Salle 102", class: "L2 B", type: "TD" },
    Jeudi: null,
    Vendredi: null,
  },
  "09:45-11:15": {
    Lundi: null,
    Mardi: { subject: "Mathématiques", room: "Salle 102", class: "L1 B", type: "TD" },
    Mercredi: null,
    Jeudi: { subject: "Géométrie", room: "Amphi B", class: "L3 A", type: "Cours" },
    Vendredi: null,
  },
  "11:30-13:00": {
    Lundi: null,
    Mardi: null,
    Mercredi: { subject: "Mathématiques", room: "Salle 103", class: "L2 A", type: "TD" },
    Jeudi: null,
    Vendredi: { subject: "Analyse", room: "Amphi A", class: "L2 A", type: "Cours" },
  },
  "14:00-15:30": {
    Lundi: null,
    Mardi: null,
    Mercredi: null,
    Jeudi: { subject: "Mathématiques", room: "Salle 104", class: "L1 C", type: "TD" },
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
const timeSlots = Object.keys(professorTimetable)

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

export default function ProfesseurTimetablePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/professeur">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Emploi du Temps</h1>
              <p className="text-gray-600">Dr. Ahmed Benali - Département de Mathématiques</p>
            </div>
          </div>
          <Button className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
        </div>

        {/* Timetable */}
        <Card>
          <CardHeader>
            <CardTitle>Emploi du Temps - Semaine du 15-19 Janvier 2024</CardTitle>
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
                          professorTimetable[timeSlot as keyof typeof professorTimetable][
                            day as keyof (typeof professorTimetable)[keyof typeof professorTimetable]
                          ]
                        return (
                          <td key={day} className="border border-gray-300 p-2">
                            {course ? (
                              <div className={`p-3 rounded-lg border-2 ${getSubjectColor(course.type)}`}>
                                <div className="font-semibold text-sm mb-1">{course.subject}</div>
                                <div className="text-xs space-y-1">
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {course.room}
                                  </div>
                                  <div className="flex items-center">
                                    <User className="h-3 w-3 mr-1" />
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

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Heures/semaine</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-sm text-gray-600">Classes enseignées</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600">Matières</div>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded mr-2"></div>
            <span className="text-sm">Cours</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded mr-2"></div>
            <span className="text-sm">TD</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded mr-2"></div>
            <span className="text-sm">TP</span>
          </div>
        </div>
      </div>
    </div>
  )
}
