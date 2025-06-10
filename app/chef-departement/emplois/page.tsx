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
import { ArrowLeft, Plus, Search, Edit, Trash2, Calendar, Download, Eye, Copy } from "lucide-react"

// Mock timetables data - only for Informatique department
const mockTimetables = [
  {
    id: "1",
    name: "L1 Informatique A",
    department: "Informatique",
    level: "L1",
    section: "A",
    semester: "S1",
    year: "2023-2024",
    status: "Publié",
    lastModified: "2024-01-15",
    totalHours: 24,
  },
  {
    id: "2",
    name: "L1 Informatique B",
    department: "Informatique",
    level: "L1",
    section: "B",
    semester: "S1",
    year: "2023-2024",
    status: "Brouillon",
    lastModified: "2024-01-14",
    totalHours: 22,
  },
  {
    id: "3",
    name: "L2 Informatique A",
    department: "Informatique",
    level: "L2",
    section: "A",
    semester: "S1",
    year: "2023-2024",
    status: "Publié",
    lastModified: "2024-01-13",
    totalHours: 26,
  },
  {
    id: "4",
    name: "L3 Informatique A",
    department: "Informatique",
    level: "L3",
    section: "A",
    semester: "S1",
    year: "2023-2024",
    status: "En révision",
    lastModified: "2024-01-12",
    totalHours: 20,
  },
  {
    id: "5",
    name: "M1 Informatique A",
    department: "Informatique",
    level: "M1",
    section: "A",
    semester: "S1",
    year: "2023-2024",
    status: "Publié",
    lastModified: "2024-01-11",
    totalHours: 18,
  },
]

const levels = ["L1", "L2", "L3", "M1", "M2"]
const sections = ["A", "B", "C"]
const semesters = ["S1", "S2"]

export default function ChefDepartementTimetablesPage() {
  const [timetables, setTimetables] = useState(mockTimetables)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTimetable, setNewTimetable] = useState({
    level: "",
    section: "",
    semester: "",
    year: "2023-2024",
  })

  const filteredTimetables = timetables.filter(
    (timetable) =>
      timetable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timetable.level.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddTimetable = () => {
    const timetable = {
      id: (timetables.length + 1).toString(),
      name: `${newTimetable.level} Informatique ${newTimetable.section}`,
      department: "Informatique", // Fixed to current department
      ...newTimetable,
      status: "Brouillon",
      lastModified: new Date().toISOString().split("T")[0],
      totalHours: 0,
    }
    setTimetables([...timetables, timetable])
    setNewTimetable({ level: "", section: "", semester: "", year: "2023-2024" })
    setIsAddDialogOpen(false)
  }

  const handleDeleteTimetable = (timetableId: string) => {
    setTimetables(timetables.filter((t) => t.id !== timetableId))
  }

  const handleDuplicateTimetable = (timetable: any) => {
    const duplicated = {
      ...timetable,
      id: (timetables.length + 1).toString(),
      name: `${timetable.name} (Copie)`,
      status: "Brouillon",
      lastModified: new Date().toISOString().split("T")[0],
    }
    setTimetables([...timetables, duplicated])
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Publié":
        return <Badge className="bg-green-100 text-green-800">Publié</Badge>
      case "Brouillon":
        return <Badge className="bg-gray-100 text-gray-800">Brouillon</Badge>
      case "En révision":
        return <Badge className="bg-yellow-100 text-yellow-800">En révision</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/chef-departement">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Emplois du Temps</h1>
              <p className="text-gray-600">Département d'Informatique</p>
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
                  <DialogDescription>
                    Définissez les paramètres de base pour le département d'Informatique.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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
                            {level}
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
                    <Label htmlFor="semester" className="text-right">
                      Semestre
                    </Label>
                    <Select
                      value={newTimetable.semester}
                      onValueChange={(value) => setNewTimetable({ ...newTimetable, semester: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner le semestre" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((semester) => (
                          <SelectItem key={semester} value={semester}>
                            {semester}
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

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom ou niveau..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Timetables Table */}
        <Card>
          <CardHeader>
            <CardTitle>Emplois du Temps du Département ({filteredTimetables.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Niveau/Section</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Heures/Semaine</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière Modification</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTimetables.map((timetable) => (
                  <TableRow key={timetable.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {timetable.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {timetable.level} - Section {timetable.section}
                    </TableCell>
                    <TableCell>
                      {timetable.semester} {timetable.year}
                    </TableCell>
                    <TableCell>{timetable.totalHours}h</TableCell>
                    <TableCell>{getStatusBadge(timetable.status)}</TableCell>
                    <TableCell>{timetable.lastModified}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/emplois/informatique/${timetable.level.toLowerCase()}/${timetable.section.toLowerCase()}`}
                        >
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/chef-departement/emplois/${timetable.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => handleDuplicateTimetable(timetable)}>
                          <Copy className="h-4 w-4" />
                        </Button>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredTimetables.length}</div>
              <div className="text-sm text-gray-600">Emplois du Temps</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredTimetables.filter((t) => t.status === "Publié").length}
              </div>
              <div className="text-sm text-gray-600">Publiés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredTimetables.filter((t) => t.status === "Brouillon").length}
              </div>
              <div className="text-sm text-gray-600">Brouillons</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(filteredTimetables.reduce((acc, t) => acc + t.totalHours, 0) / filteredTimetables.length) ||
                  0}
              </div>
              <div className="text-sm text-gray-600">Heures Moyennes</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
