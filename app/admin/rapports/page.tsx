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

// Mock data for reports (reuse for now)
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

const facultyStatistics = {
  totalProfessors: 120,
  totalRooms: 40,
  totalClasses: 60,
  totalStudents: 3200,
  averageUtilization: 78,
  averageWorkload: 15,
  coursesPerWeek: 320,
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
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                Retour
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Rapports de la Faculté</h1>
          </div>
          <p className="text-gray-600">Faculté des Sciences - Statistiques et analyses globales</p>
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

      {/* Faculty Overview */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Aperçu de la Faculté
          </CardTitle>
          <CardDescription>Statistiques générales de la Faculté des Sciences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-blue-700">Professeurs</h3>
                <Users className="h-5 w-5 text-blue-700" />
              </div>
              <p className="text-2xl font-bold text-blue-900">{facultyStatistics.totalProfessors}</p>
              <p className="text-xs text-blue-700">Charge moyenne: {facultyStatistics.averageWorkload}h/semaine</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-green-700">Salles</h3>
                <MapPin className="h-5 w-5 text-green-700" />
              </div>
              <p className="text-2xl font-bold text-green-900">{facultyStatistics.totalRooms}</p>
              <p className="text-xs text-green-700">Utilisation moyenne: {facultyStatistics.averageUtilization}%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-purple-700">Classes</h3>
                <BookOpen className="h-5 w-5 text-purple-700" />
              </div>
              <p className="text-2xl font-bold text-purple-900">{facultyStatistics.totalClasses}</p>
              <p className="text-xs text-purple-700">Cours par semaine: {facultyStatistics.coursesPerWeek}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-orange-700">Étudiants</h3>
                <Users className="h-5 w-5 text-orange-700" />
              </div>
              <p className="text-2xl font-bold text-orange-900">{facultyStatistics.totalStudents}</p>
              <p className="text-xs text-orange-700">Total étudiants inscrits</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different reports (reuse the rest of the chef-departement UI) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="utilisation">Utilisation des Salles</TabsTrigger>
          <TabsTrigger value="professeurs">Charge des Professeurs</TabsTrigger>
          <TabsTrigger value="classes">Emploi des Classes</TabsTrigger>
        </TabsList>
        <TabsContent value="utilisation">
          {/* Room Utilization Table (reuse logic) */}
          {/* ... (copy from chef-departement) ... */}
        </TabsContent>
        <TabsContent value="professeurs">
          {/* Professor Workload Table (reuse logic) */}
          {/* ... (copy from chef-departement) ... */}
        </TabsContent>
        <TabsContent value="classes">
          {/* Class Schedule Table (reuse logic) */}
          {/* ... (copy from chef-departement) ... */}
        </TabsContent>
      </Tabs>
    </div>
  )
} 