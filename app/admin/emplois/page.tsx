"use client"

import { useState } from "react"
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
import Link from "next/link"
import { ArrowLeft, Plus, Search, Edit, Trash2, Calendar, Download, Eye } from "lucide-react"

const mockTimetables = [
  {
    id: "1",
    name: "L1 Informatique A",
    department: "Informatique",
    level: "L1",
    section: "A",
    group: "G1",
    year: "2023-2024",
    lastModified: "2024-01-15",
    totalHours: 24,
  },
  {
    id: "2",
    name: "L1 Informatique A",
    department: "Informatique",
    level: "L1",
    section: "A",
    group: "G2",
    year: "2023-2024",
    lastModified: "2024-01-15",
    totalHours: 22,
  },
  {
    id: "3",
    name: "L2 Mathématiques B",
    department: "Mathématiques",
    level: "L2",
    section: "B",
    group: "G1",
    year: "2023-2024",
    lastModified: "2024-01-14",
    totalHours: 22,
  },
  {
    id: "4",
    name: "M1 Architecture A",
    department: "Architecture",
    level: "M1",
    section: "A",
    group: "G1",
    year: "2023-2024",
    lastModified: "2024-01-13",
    totalHours: 20,
  },
  {
    id: "5",
    name: "L3 Sciences de la Matière A",
    department: "Sciences de la Matière",
    level: "L3",
    section: "A",
    group: "G1",
    year: "2023-2024",
    lastModified: "2024-01-12",
    totalHours: 26,
  },
]

const departments = [
  "Architecture",
  "Mathématiques",
  "Informatique",
  "Sciences de la Matière",
  "Sciences de la Nature et de la Vie",
]

const levels = ["L1", "L2", "L3", "M1", "M2"]
const sections = ["A", "B", "C"]
const groups = ["G1", "G2", "G3", "G4"]

// Required hours for each level
const requiredHours = {
  "L1": 24,
  "L2": 26,
  "L3": 28,
  "M1": 20,
  "M2": 18,
}

// Function to check if hours are sufficient
const getHoursStatus = (level: string, currentHours: number) => {
  const required = requiredHours[level as keyof typeof requiredHours] || 0
  if (currentHours >= required) {
    return {
      status: "sufficient",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: "✓"
    }
  } else {
    return {
      status: "insufficient",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      icon: "⚠"
    }
  }
}

export default function AdminTimetablesPage() {
  const [timetables, setTimetables] = useState(mockTimetables)
  const [searchTerm, setSearchTerm] = useState("")
  const [pendingSearchTerm, setPendingSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTimetable, setNewTimetable] = useState({
    name: "",
    department: "",
    level: "",
    section: "",
    group: "",
    year: "2023-2024",
  })

  const filteredTimetables = timetables.filter(
    (timetable) =>
      timetable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timetable.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timetable.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timetable.group.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddTimetable = () => {
    const timetable = {
      id: (timetables.length + 1).toString(),
      ...newTimetable,
      name: `${newTimetable.level} ${newTimetable.department} ${newTimetable.section}`,
      lastModified: new Date().toISOString().split("T")[0],
      totalHours: 0,
    }
    setTimetables([...timetables, timetable])
    setNewTimetable({ name: "", department: "", level: "", section: "", group: "", year: "2023-2024" })
    setIsAddDialogOpen(false)
  }

  const handleDeleteTimetable = (timetableId: string) => {
    setTimetables(timetables.filter((t) => t.id !== timetableId))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Emplois du Temps</h1>
              <p className="text-gray-600">Créer et gérer les emplois du temps par groupe</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter Tout
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Emploi du Temps
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Créer un Nouvel Emploi du Temps</DialogTitle>
                  <DialogDescription>Définissez les paramètres de base du nouvel emploi du temps par groupe.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Département
                    </Label>
                    <Select
                      value={newTimetable.department}
                      onValueChange={(value) => setNewTimetable({ ...newTimetable, department: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner le département" />
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="level" className="text-right">
                      Niveau
                    </Label>
                    <Select
                      value={newTimetable.level}
                      onValueChange={(value) => setNewTimetable({ ...newTimetable, level: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner le niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level} (Requis: {requiredHours[level as keyof typeof requiredHours]}h)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="section" className="text-right">
                      Section
                    </Label>
                    <Select
                      value={newTimetable.section}
                      onValueChange={(value) => setNewTimetable({ ...newTimetable, section: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner la section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem key={section} value={section}>
                            Section {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="group" className="text-right">
                      Groupe
                    </Label>
                    <Select
                      value={newTimetable.group}
                      onValueChange={(value) => setNewTimetable({ ...newTimetable, group: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner le groupe" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="year" className="text-right">
                      Année
                    </Label>
                    <Input
                      id="year"
                      value={newTimetable.year}
                      onChange={(e) => setNewTimetable({ ...newTimetable, year: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddTimetable}>
                    Créer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, département, niveau ou groupe..."
                  value={pendingSearchTerm}
                  onChange={(e) => setPendingSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setSearchTerm(pendingSearchTerm)} variant="default">
                Filtrer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timetables Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Emplois du Temps ({filteredTimetables.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Niveau/Section</TableHead>
                  <TableHead>Groupe</TableHead>
                  <TableHead>Heures/Semaine</TableHead>
                  <TableHead>Statut Heures</TableHead>
                  <TableHead>Dernière Modification</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTimetables.map((timetable) => {
                  const hoursStatus = getHoursStatus(timetable.level, timetable.totalHours)
                  const required = requiredHours[timetable.level as keyof typeof requiredHours] || 0
                  
                  return (
                    <TableRow key={timetable.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {timetable.name}
                        </div>
                      </TableCell>
                      <TableCell>{timetable.department}</TableCell>
                      <TableCell>
                        {timetable.level} - Section {timetable.section}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {timetable.group}
                        </Badge>
                      </TableCell>
                      <TableCell>{timetable.totalHours}h</TableCell>
                      <TableCell>
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${hoursStatus.bgColor} ${hoursStatus.borderColor}`}>
                          <span className={`text-sm font-medium ${hoursStatus.color}`}>
                            {hoursStatus.icon}
                          </span>
                          <span className={`text-sm ${hoursStatus.color}`}>
                            {timetable.totalHours}/{required}h
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{timetable.lastModified}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/emplois/${timetable.department.toLowerCase()}/${timetable.level.toLowerCase()}/${timetable.section.toLowerCase()}/${timetable.group.toLowerCase()}`}
                          >
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/emplois/${timetable.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTimetable(timetable.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredTimetables.length}</div>
              <div className="text-sm text-gray-600">Total Emplois du Temps</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredTimetables.filter((t) => {
                  const required = requiredHours[t.level as keyof typeof requiredHours] || 0
                  return t.totalHours >= required
                }).length}
              </div>
              <div className="text-sm text-gray-600">Heures Suffisantes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredTimetables.filter((t) => {
                  const required = requiredHours[t.level as keyof typeof requiredHours] || 0
                  return t.totalHours < required
                }).length}
              </div>
              <div className="text-sm text-gray-600">Heures Insuffisantes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(filteredTimetables.map(t => `${t.department}-${t.level}-${t.section}`)).size}
              </div>
              <div className="text-sm text-gray-600">Sections</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
