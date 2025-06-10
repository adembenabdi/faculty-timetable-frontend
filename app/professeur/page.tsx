import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users, BookOpen, Settings, User, Mail, Phone } from "lucide-react"

// Mock data for professor
const professorInfo = {
  name: "Dr. Ahmed Benali",
  department: "Mathématiques",
  email: "a.benali@univ.dz",
  phone: "+213 555 123 456",
  office: "Bureau 201",
  subjects: ["Analyse", "Algèbre", "Géométrie"],
}

const professorStats = [
  { title: "Heures/Semaine", value: "12", icon: Clock, color: "text-blue-600" },
  { title: "Classes Enseignées", value: "5", icon: Users, color: "text-green-600" },
  { title: "Matières", value: "3", icon: BookOpen, color: "text-purple-600" },
  { title: "Salles Utilisées", value: "4", icon: MapPin, color: "text-orange-600" },
]

const quickActions = [
  {
    title: "Mon Emploi du Temps",
    description: "Voir mon emploi du temps de la semaine",
    href: "/professeur/emploi-temps",
    icon: Calendar,
    color: "bg-blue-500",
  },
  {
    title: "Mes Classes",
    description: "Voir toutes mes classes et étudiants",
    href: "/professeur/classes",
    icon: Users,
    color: "bg-green-500",
  },
  {
    title: "Salles Libres",
    description: "Trouver des salles disponibles",
    href: "/salles-libres",
    icon: MapPin,
    color: "bg-purple-500",
  },
  {
    title: "Mon Profil",
    description: "Gérer mes informations personnelles",
    href: "/professeur/profil",
    icon: User,
    color: "bg-orange-500",
  },
]

const upcomingClasses = [
  {
    time: "08:00-09:30",
    subject: "Mathématiques",
    class: "L1 A",
    room: "Amphi A",
    type: "Cours",
  },
  {
    time: "11:30-13:00",
    subject: "Algèbre",
    class: "L2 B",
    room: "Salle 102",
    type: "TD",
  },
  {
    time: "14:00-15:30",
    subject: "Géométrie",
    class: "L3 A",
    room: "Salle 103",
    type: "TD",
  },
]

export default function ProfesseurDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Professeur</h1>
            <p className="text-gray-600">
              {professorInfo.name} - {professorInfo.department}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">Retour à l'accueil</Button>
            </Link>
            <Link href="/professeur/profil">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Mon Profil
              </Button>
            </Link>
            <Button variant="outline">Déconnexion</Button>
          </div>
        </div>

        {/* Professor Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Mes Informations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nom</p>
                <p className="font-semibold">{professorInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Département</p>
                <p className="font-semibold">{professorInfo.department}</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-sm">{professorInfo.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="font-semibold text-sm">{professorInfo.phone}</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Matières enseignées</p>
              <div className="flex flex-wrap gap-2">
                {professorInfo.subjects.map((subject) => (
                  <span key={subject} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {professorStats.map((stat) => {
            const IconComponent = stat.icon
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const IconComponent = action.icon
                return (
                  <Link key={action.title} href={action.href}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center">
                          <div
                            className={`${action.color} p-3 rounded-lg mb-3 group-hover:scale-110 transition-transform`}
                          >
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Mes Cours Aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((classItem, index) => (
                <div key={index} className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 w-20">
                    <div className="text-sm font-medium text-blue-800">{classItem.time}</div>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{classItem.subject}</h4>
                        <p className="text-sm text-gray-600">
                          {classItem.class} - {classItem.type}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {classItem.room}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/professeur/emploi-temps">
                <Button variant="outline">Voir l'emploi du temps complet</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
