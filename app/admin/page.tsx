import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, MapPin, Calendar, Building, UserCheck, BarChart3, Clock, BookOpen, Settings } from "lucide-react"

const adminStats = [
  { title: "Total Professeurs", value: "45", icon: Users, color: "text-blue-600" },
  { title: "Salles Disponibles", value: "28", icon: MapPin, color: "text-green-600" },
  { title: "Emplois du Temps", value: "15", icon: Calendar, color: "text-purple-600" },
  { title: "Départements", value: "5", icon: Building, color: "text-orange-600" },
]

const quickActions = [
  {
    title: "Gérer les Salles",
    description: "Ajouter, modifier ou supprimer des salles",
    href: "/admin/salles",
    icon: MapPin,
    color: "bg-blue-500",
  },
  {
    title: "Gérer les Professeurs",
    description: "Gérer les informations des professeurs",
    href: "/admin/professeurs",
    icon: Users,
    color: "bg-green-500",
  },
  {
    title: "Emplois du Temps",
    description: "Créer et modifier les emplois du temps",
    href: "/admin/emplois",
    icon: Calendar,
    color: "bg-purple-500",
  },
  {
    title: "Salles Libres",
    description: "Voir la disponibilité des salles",
    href: "/salles-libres",
    icon: Clock,
    color: "bg-orange-500",
  },
  {
    title: "Gérer les Départements",
    description: "Configuration des départements",
    href: "/admin/departements",
    icon: Building,
    color: "bg-indigo-500",
  },
  {
    title: "Gérer les Utilisateurs",
    description: "Gestion des comptes utilisateurs",
    href: "/admin/utilisateurs",
    icon: UserCheck,
    color: "bg-pink-500",
  },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Admin</h1>
            <p className="text-gray-600">Système de Gestion des Emplois du Temps</p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">Retour à l'accueil</Button>
            </Link>
            <Link href="/admin/parametres">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </Link>
            <Button variant="outline">Déconnexion</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat) => {
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
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const IconComponent = action.icon
                return (
                  <Link key={action.title} href={action.href}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div
                            className={`${action.color} p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform`}
                          >
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Emploi du temps L2 Informatique mis à jour</p>
                  <p className="text-sm text-gray-600">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <MapPin className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium">Nouvelle salle Lab Physique 2 ajoutée</p>
                  <p className="text-sm text-gray-600">Il y a 5 heures</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <Users className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium">Professeur Dr. Benali - horaires modifiés</p>
                  <p className="text-sm text-gray-600">Hier</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
