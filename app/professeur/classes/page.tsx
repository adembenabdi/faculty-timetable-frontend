import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Users, Clock, MapPin, BookOpen } from "lucide-react"

// Mock classes data for professor
const professorClasses = [
  {
    id: "1",
    name: "L1 Mathématiques A",
    subject: "Mathématiques",
    level: "L1",
    section: "A",
    students: 45,
    schedule: [
      { day: "Lundi", time: "08:00-09:30", room: "Amphi A", type: "Cours" },
      { day: "Mercredi", time: "11:30-13:00", room: "Salle 103", type: "TD" },
    ],
  },
  {
    id: "2",
    name: "L1 Mathématiques B",
    subject: "Mathématiques",
    level: "L1",
    section: "B",
    students: 42,
    schedule: [{ day: "Mardi", time: "09:45-11:15", room: "Salle 102", type: "TD" }],
  },
  {
    id: "3",
    name: "L2 Algèbre B",
    subject: "Algèbre",
    level: "L2",
    section: "B",
    students: 38,
    schedule: [{ day: "Mercredi", time: "08:00-09:30", room: "Salle 102", type: "TD" }],
  },
  {
    id: "4",
    name: "L2 Analyse A",
    subject: "Analyse",
    level: "L2",
    section: "A",
    students: 40,
    schedule: [{ day: "Vendredi", time: "11:30-13:00", room: "Amphi A", type: "Cours" }],
  },
  {
    id: "5",
    name: "L3 Géométrie A",
    subject: "Géométrie",
    level: "L3",
    section: "A",
    students: 35,
    schedule: [
      { day: "Jeudi", time: "09:45-11:15", room: "Amphi B", type: "Cours" },
      { day: "Jeudi", time: "14:00-15:30", room: "Salle 104", type: "TD" },
    ],
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case "Cours":
      return "bg-blue-100 text-blue-800"
    case "TD":
      return "bg-green-100 text-green-800"
    case "TP":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ProfesseurClassesPage() {
  const totalStudents = professorClasses.reduce((sum, cls) => sum + cls.students, 0)
  const totalHours = professorClasses.reduce((sum, cls) => sum + cls.schedule.length * 1.5, 0)

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
              <h1 className="text-3xl font-bold text-gray-900">Mes Classes</h1>
              <p className="text-gray-600">Dr. Ahmed Benali - Département de Mathématiques</p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{professorClasses.length}</div>
              <div className="text-sm text-gray-600">Classes enseignées</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{totalStudents}</div>
              <div className="text-sm text-gray-600">Total étudiants</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">{totalHours}h</div>
              <div className="text-sm text-gray-600">Heures/semaine</div>
            </CardContent>
          </Card>
        </div>

        {/* Classes List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {professorClasses.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold">{classItem.name}</h3>
                      <p className="text-sm text-gray-600 font-normal">{classItem.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {classItem.students}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Horaires:</p>
                    <div className="space-y-2">
                      {classItem.schedule.map((schedule, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium">{schedule.day}</span>
                            <span className="text-sm">{schedule.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-3 w-3 mr-1" />
                              {schedule.room}
                            </div>
                            <Badge className={getTypeColor(schedule.type)} variant="secondary">
                              {schedule.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <strong>Niveau:</strong> {classItem.level} - Section {classItem.section}
                      </div>
                      <Link
                        href={`/emplois/mathematiques/${classItem.level.toLowerCase()}/${classItem.section.toLowerCase()}`}
                      >
                        <Button variant="outline" size="sm">
                          Voir l'emploi du temps
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subject Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Répartition par Matière</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <div className="text-sm text-gray-600">Classes Mathématiques</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">1</div>
                <div className="text-sm text-gray-600">Classe Algèbre</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">2</div>
                <div className="text-sm text-gray-600">Classes Analyse/Géométrie</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
