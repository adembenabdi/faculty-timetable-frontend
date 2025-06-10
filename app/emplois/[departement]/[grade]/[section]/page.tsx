import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Download, Clock, MapPin, User } from "lucide-react"

// Mock timetable data
const timetableData = {
  "08:00-09:30": {
    Lundi: { subject: "Mathématiques", room: "Amphi A", professor: "Dr. Benali", type: "Cours" },
    Mardi: { subject: "Physique", room: "Salle 101", professor: "Dr. Mansouri", type: "TD" },
    Mercredi: null,
    Jeudi: { subject: "Informatique", room: "Lab Info", professor: "Dr. Khelifi", type: "TP" },
    Vendredi: { subject: "Anglais", room: "Salle 205", professor: "Ms. Smith", type: "TD" },
  },
  "09:45-11:15": {
    Lundi: { subject: "Physique", room: "Amphi B", professor: "Dr. Mansouri", type: "Cours" },
    Mardi: { subject: "Mathématiques", room: "Salle 102", professor: "Dr. Benali", type: "TD" },
    Mercredi: { subject: "Informatique", room: "Lab Info", professor: "Dr. Khelifi", type: "TP" },
    Jeudi: null,
    Vendredi: { subject: "Chimie", room: "Lab Chimie", professor: "Dr. Amara", type: "TP" },
  },
  "11:30-13:00": {
    Lundi: null,
    Mardi: { subject: "Informatique", room: "Amphi C", professor: "Dr. Khelifi", type: "Cours" },
    Mercredi: { subject: "Mathématiques", room: "Salle 103", professor: "Dr. Benali", type: "TD" },
    Jeudi: { subject: "Physique", room: "Lab Physique", professor: "Dr. Mansouri", type: "TP" },
    Vendredi: null,
  },
  "14:00-15:30": {
    Lundi: { subject: "Chimie", room: "Amphi A", professor: "Dr. Amara", type: "Cours" },
    Mardi: null,
    Mercredi: { subject: "Anglais", room: "Salle 201", professor: "Ms. Smith", type: "TD" },
    Jeudi: { subject: "Mathématiques", room: "Salle 104", professor: "Dr. Benali", type: "TD" },
    Vendredi: { subject: "Informatique", room: "Lab Info", professor: "Dr. Khelifi", type: "TP" },
  },
  "15:45-17:15": {
    Lundi: { subject: "Physique", room: "Lab Physique", professor: "Dr. Mansouri", type: "TP" },
    Mardi: { subject: "Chimie", room: "Lab Chimie", professor: "Dr. Amara", type: "TP" },
    Mercredi: null,
    Jeudi: { subject: "Informatique", room: "Amphi C", professor: "Dr. Khelifi", type: "Cours" },
    Vendredi: null,
  },
}

const days = ["dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "samedi"]
const timeSlots = Object.keys(timetableData)

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

export default async function TimetablePage({
  params,
}: {
  params: Promise<{ departement: string; grade: string; section: string }>
}) {
  const { departement, grade, section } = await params

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href={`/departement/${departement}`}>
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Emploi du Temps</h1>
              <p className="text-gray-600">
                {departement.charAt(0).toUpperCase() + departement.slice(1)} - {grade.toUpperCase()} Section{" "}
                {section.toUpperCase()}
              </p>
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
            <CardTitle>emploi du temps</CardTitle>
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
                          timetableData[timeSlot as keyof typeof timetableData][
                            day as keyof (typeof timetableData)[keyof typeof timetableData]
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
                                    {course.professor}
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
