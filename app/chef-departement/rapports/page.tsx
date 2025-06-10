"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  FileDown,
  Filter,
  Printer,
  Calendar,
  Users,
  MapPin,
  Clock,
  BookOpen,
  ChevronLeft,
} from "lucide-react"
import Link from "next/link"

// Mock data for reports
const roomUtilizationData = [
  { room: "Salle 101", utilization: 85, hours: 34, capacity: 40, type: "Cours" },
  { room: "Lab Info 1", utilization: 92, hours: 36, capacity: 25, type: "TP" },
  { room: "Amphi A", utilization: 65, hours: 26, capacity: 120, type: "Cours" },
  { room: "Salle 203", utilization: 78, hours: 31, capacity: 35, type: "TD" },
  { room: "Lab Info 2", utilization: 90, hours: 36, capacity: 25, type: "TP" },
  { room: "Salle 105", utilization: 72, hours: 29, capacity: 30, type: "TD" },
]

const professorWorkloadData = [
  { name: "Dr. Amina Belkacem", hours: 18, courses: 4, students: 145, status: "Complet" },
  { name: "Dr. Mohamed Rahmani", hours: 16, courses: 3, students: 120, status: "Complet" },
  { name: "Dr. Karim Benali", hours: 12, courses: 3, students: 95, status: "Partiel" },
  { name: "Dr. Leila Mansouri", hours: 20, courses: 5, students: 180, status: "Surcharge" },
  { name: "Dr. Ahmed Boudiaf", hours: 14, courses: 3, students: 110, status: "Complet" },
  { name: "Dr. Samira Hadj", hours: 10, courses: 2, students: 75, status: "Partiel" },
]

const classScheduleData = [
  { class: "L2 Info A", courses: 8, hours: 24, professors: 6, students: 45 },
  { class: "L3 Info B", courses: 7, hours: 22, professors: 5, students: 38 },
  { class: "M1 STIC", courses: 6, hours: 18, professors: 4, students: 25 },
  { class: "L1 Info C", courses: 9, hours: 26, professors: 7, students: 50 },
  { class: "M2 IA", courses: 5, hours: 15, professors: 4, students: 18 },
]

const departmentStatistics = {
  totalProfessors: 18,
  totalRooms: 10,
  totalClasses: 12,
  totalStudents: 520,
  averageUtilization: 82,
  averageWorkload: 16,
  coursesPerWeek: 65,
}

export default function RapportsPage() {
  const [activeTab, setActiveTab] = useState("utilisation")
  const [dateRange, setDateRange] = useState("semestre")
  const [exportFormat, setExportFormat] = useState("pdf")

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complet":
        return "bg-green-100 text-green-800"
      case "Partiel":
        return "bg-blue-100 text-blue-800"
      case "Surcharge":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Utilization color mapping
  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-600"
    if (utilization >= 75) return "text-green-600"
    if (utilization >= 60) return "text-blue-600"
    return "text-yellow-600"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/chef-departement">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                Retour
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Rapports du Département</h1>
          </div>
          <p className="text-gray-600">Département d'Informatique - Statistiques et analyses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Printer className="h-4 w-4" />
            Imprimer
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <FileDown className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtres et Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-range">Période</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger id="date-range">
                  <SelectValue placeholder="Sélectionner une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semaine">Cette semaine</SelectItem>
                  <SelectItem value="mois">Ce mois</SelectItem>
                  <SelectItem value="semestre">Ce semestre</SelectItem>
                  <SelectItem value="annee">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="export-format">Format d'exportation</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger id="export-format">
                  <SelectValue placeholder="Sélectionner un format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="search">Recherche</Label>
              <Input id="search" placeholder="Rechercher..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Overview */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Aperçu du Département
          </CardTitle>
          <CardDescription>Statistiques générales du département d'Informatique</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-blue-700">Professeurs</h3>
                <Users className="h-5 w-5 text-blue-700" />
              </div>
              <p className="text-2xl font-bold text-blue-900">{departmentStatistics.totalProfessors}</p>
              <p className="text-xs text-blue-700">Charge moyenne: {departmentStatistics.averageWorkload}h/semaine</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-green-700">Salles</h3>
                <MapPin className="h-5 w-5 text-green-700" />
              </div>
              <p className="text-2xl font-bold text-green-900">{departmentStatistics.totalRooms}</p>
              <p className="text-xs text-green-700">Utilisation moyenne: {departmentStatistics.averageUtilization}%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-purple-700">Classes</h3>
                <BookOpen className="h-5 w-5 text-purple-700" />
              </div>
              <p className="text-2xl font-bold text-purple-900">{departmentStatistics.totalClasses}</p>
              <p className="text-xs text-purple-700">Cours par semaine: {departmentStatistics.coursesPerWeek}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-orange-700">Étudiants</h3>
                <Users className="h-5 w-5 text-orange-700" />
              </div>
              <p className="text-2xl font-bold text-orange-900">{departmentStatistics.totalStudents}</p>
              <p className="text-xs text-orange-700">Répartis sur {departmentStatistics.totalClasses} classes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="utilisation" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Utilisation des Salles</span>
            <span className="sm:hidden">Salles</span>
          </TabsTrigger>
          <TabsTrigger value="charge" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Charge des Professeurs</span>
            <span className="sm:hidden">Professeurs</span>
          </TabsTrigger>
          <TabsTrigger value="emplois" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Emplois du Temps</span>
            <span className="sm:hidden">Emplois</span>
          </TabsTrigger>
        </TabsList>

        {/* Room Utilization Tab */}
        <TabsContent value="utilisation">
          <Card>
            <CardHeader>
              <CardTitle>Utilisation des Salles</CardTitle>
              <CardDescription>
                Taux d'utilisation des salles du département d'Informatique pour{" "}
                {dateRange === "semestre"
                  ? "le semestre actuel"
                  : dateRange === "annee"
                    ? "l'année académique"
                    : dateRange === "mois"
                      ? "le mois en cours"
                      : "la semaine en cours"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Salle</th>
                      <th className="py-3 px-4 text-left">Type</th>
                      <th className="py-3 px-4 text-left">Capacité</th>
                      <th className="py-3 px-4 text-left">Heures/Semaine</th>
                      <th className="py-3 px-4 text-left">Utilisation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomUtilizationData.map((room, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                        <td className="py-3 px-4 font-medium">{room.room}</td>
                        <td className="py-3 px-4">{room.type}</td>
                        <td className="py-3 px-4">{room.capacity} places</td>
                        <td className="py-3 px-4">{room.hours}h</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${getUtilizationColor(room.utilization)}`}>
                              {room.utilization}%
                            </span>
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div
                                className={`h-2 rounded-full ${
                                  room.utilization >= 90
                                    ? "bg-red-500"
                                    : room.utilization >= 75
                                      ? "bg-green-500"
                                      : room.utilization >= 60
                                        ? "bg-blue-500"
                                        : "bg-yellow-500"
                                }`}
                                style={{ width: `${room.utilization}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">Affichage de {roomUtilizationData.length} salles</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Voir plus de détails
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileDown className="h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professor Workload Tab */}
        <TabsContent value="charge">
          <Card>
            <CardHeader>
              <CardTitle>Charge des Professeurs</CardTitle>
              <CardDescription>
                Répartition de la charge d'enseignement des professeurs du département pour{" "}
                {dateRange === "semestre"
                  ? "le semestre actuel"
                  : dateRange === "annee"
                    ? "l'année académique"
                    : dateRange === "mois"
                      ? "le mois en cours"
                      : "la semaine en cours"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Professeur</th>
                      <th className="py-3 px-4 text-left">Heures/Semaine</th>
                      <th className="py-3 px-4 text-left">Cours</th>
                      <th className="py-3 px-4 text-left">Étudiants</th>
                      <th className="py-3 px-4 text-left">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {professorWorkloadData.map((professor, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                        <td className="py-3 px-4 font-medium">{professor.name}</td>
                        <td className="py-3 px-4">{professor.hours}h</td>
                        <td className="py-3 px-4">{professor.courses}</td>
                        <td className="py-3 px-4">{professor.students}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(professor.status)}>{professor.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">Affichage de {professorWorkloadData.length} professeurs</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Voir plus de détails
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileDown className="h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Class Schedule Tab */}
        <TabsContent value="emplois">
          <Card>
            <CardHeader>
              <CardTitle>Emplois du Temps par Classe</CardTitle>
              <CardDescription>
                Statistiques des emplois du temps par classe pour{" "}
                {dateRange === "semestre"
                  ? "le semestre actuel"
                  : dateRange === "annee"
                    ? "l'année académique"
                    : dateRange === "mois"
                      ? "le mois en cours"
                      : "la semaine en cours"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Classe</th>
                      <th className="py-3 px-4 text-left">Cours</th>
                      <th className="py-3 px-4 text-left">Heures/Semaine</th>
                      <th className="py-3 px-4 text-left">Professeurs</th>
                      <th className="py-3 px-4 text-left">Étudiants</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classScheduleData.map((classItem, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                        <td className="py-3 px-4 font-medium">{classItem.class}</td>
                        <td className="py-3 px-4">{classItem.courses}</td>
                        <td className="py-3 px-4">{classItem.hours}h</td>
                        <td className="py-3 px-4">{classItem.professors}</td>
                        <td className="py-3 px-4">{classItem.students}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">Affichage de {classScheduleData.length} classes</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Voir plus de détails
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileDown className="h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Disponibilité des Salles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Aperçu de la disponibilité des salles pour la semaine en cours</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-700">Salles Disponibles</p>
                  <p className="text-2xl font-bold text-green-900">4</p>
                  <p className="text-xs text-green-700">40% des salles</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-red-700">Salles Occupées</p>
                  <p className="text-2xl font-bold text-red-900">6</p>
                  <p className="text-xs text-red-700">60% des salles</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Voir le rapport complet
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Répartition des Cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Répartition des types de cours dans le département</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-blue-700">Cours</p>
                  <p className="text-xl font-bold text-blue-900">42%</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-purple-700">TD</p>
                  <p className="text-xl font-bold text-purple-900">35%</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-orange-700">TP</p>
                  <p className="text-xl font-bold text-orange-900">23%</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Voir le rapport complet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
