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
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Plus, Search, Edit, Trash2, User, Mail, Phone, Eye } from "lucide-react"

// Mock professors data - only for Informatique department
const mockProfessors = [
  {
    id: "1",
    name: "Dr. Omar Khelifi",
    email: "o.khelifi@univ.dz",
    phone: "+213 555 345 678",
    department: "Informatique",
    subjects: ["Programmation", "Base de Données", "Réseaux"],
    status: "Actif",
    grade: "Professeur",
    office: "Bureau 301",
  },
  {
    id: "2",
    name: "Dr. Amina Belkacem",
    email: "a.belkacem@univ.dz",
    phone: "+213 555 456 789",
    department: "Informatique",
    subjects: ["Algorithmes", "Intelligence Artificielle"],
    status: "Actif",
    grade: "Maître de Conférences",
    office: "Bureau 302",
  },
  {
    id: "3",
    name: "Dr. Karim Messaoud",
    email: "k.messaoud@univ.dz",
    phone: "+213 555 567 890",
    department: "Informatique",
    subjects: ["Systèmes d'Exploitation", "Architecture"],
    status: "Actif",
    grade: "Maître Assistant",
    office: "Bureau 303",
  },
  {
    id: "4",
    name: "Ms. Nadia Bouali",
    email: "n.bouali@univ.dz",
    phone: "+213 555 678 901",
    department: "Informatique",
    subjects: ["Développement Web", "Interface Utilisateur"],
    status: "Congé",
    grade: "Chargé de Cours",
    office: "Bureau 304",
  },
]

const grades = ["Professeur", "Maître de Conférences", "Maître Assistant", "Chargé de Cours", "Vacataire"]

export default function ChefDepartementProfessorsPage() {
  const [professors, setProfessors] = useState(mockProfessors)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProfessor, setSelectedProfessor] = useState<any>(null)
  const [newProfessor, setNewProfessor] = useState({
    name: "",
    email: "",
    phone: "",
    subjects: "",
    grade: "",
    office: "",
  })

  const filteredProfessors = professors.filter(
    (prof) =>
      prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProfessor = () => {
    const professor = {
      id: (professors.length + 1).toString(),
      ...newProfessor,
      department: "Informatique", // Fixed to current department
      subjects: newProfessor.subjects.split(",").map((item) => item.trim()),
      status: "Actif",
    }
    setProfessors([...professors, professor])
    setNewProfessor({ name: "", email: "", phone: "", subjects: "", grade: "", office: "" })
    setIsAddDialogOpen(false)
  }

  const handleEditProfessor = () => {
    const updatedProfessors = professors.map((prof) =>
      prof.id === selectedProfessor.id
        ? {
            ...selectedProfessor,
            subjects:
              typeof selectedProfessor.subjects === "string"
                ? selectedProfessor.subjects.split(",").map((item: string) => item.trim())
                : selectedProfessor.subjects,
          }
        : prof,
    )
    setProfessors(updatedProfessors)
    setIsEditDialogOpen(false)
    setSelectedProfessor(null)
  }

  const handleDeleteProfessor = (profId: string) => {
    setProfessors(professors.filter((prof) => prof.id !== profId))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Actif":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case "Congé":
        return <Badge className="bg-yellow-100 text-yellow-800">Congé</Badge>
      case "Inactif":
        return <Badge className="bg-red-100 text-red-800">Inactif</Badge>
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Professeurs</h1>
              <p className="text-gray-600">Département d'Informatique</p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un Professeur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouveau Professeur</DialogTitle>
                <DialogDescription>Remplissez les informations du nouveau professeur du département.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nom complet
                  </Label>
                  <Input
                    id="name"
                    value={newProfessor.name}
                    onChange={(e) => setNewProfessor({ ...newProfessor, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newProfessor.email}
                    onChange={(e) => setNewProfessor({ ...newProfessor, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    value={newProfessor.phone}
                    onChange={(e) => setNewProfessor({ ...newProfessor, phone: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="grade" className="text-right">
                    Grade
                  </Label>
                  <Select
                    value={newProfessor.grade}
                    onValueChange={(value) => setNewProfessor({ ...newProfessor, grade: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner le grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="office" className="text-right">
                    Bureau
                  </Label>
                  <Input
                    id="office"
                    value={newProfessor.office}
                    onChange={(e) => setNewProfessor({ ...newProfessor, office: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subjects" className="text-right">
                    Matières
                  </Label>
                  <Textarea
                    id="subjects"
                    placeholder="Séparer par des virgules"
                    value={newProfessor.subjects}
                    onChange={(e) => setNewProfessor({ ...newProfessor, subjects: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddProfessor}>
                  Ajouter
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Professors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Professeurs du Département ({filteredProfessors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Matières</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfessors.map((professor) => (
                  <TableRow key={professor.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <div>
                          <div>{professor.name}</div>
                          <div className="text-sm text-gray-500">{professor.office}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{professor.grade}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {professor.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {professor.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {professor.subjects.slice(0, 2).map((subject) => (
                          <Badge key={subject} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {professor.subjects.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{professor.subjects.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(professor.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link href={`/professeurs/${professor.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedProfessor({
                              ...professor,
                              subjects: professor.subjects.join(", "),
                            })
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProfessor(professor.id)}
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier le Professeur</DialogTitle>
              <DialogDescription>Modifiez les informations du professeur.</DialogDescription>
            </DialogHeader>
            {selectedProfessor && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Nom complet
                  </Label>
                  <Input
                    id="edit-name"
                    value={selectedProfessor.name}
                    onChange={(e) => setSelectedProfessor({ ...selectedProfessor, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedProfessor.email}
                    onChange={(e) => setSelectedProfessor({ ...selectedProfessor, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-phone" className="text-right">
                    Téléphone
                  </Label>
                  <Input
                    id="edit-phone"
                    value={selectedProfessor.phone}
                    onChange={(e) => setSelectedProfessor({ ...selectedProfessor, phone: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-grade" className="text-right">
                    Grade
                  </Label>
                  <Select
                    value={selectedProfessor.grade}
                    onValueChange={(value) => setSelectedProfessor({ ...selectedProfessor, grade: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-office" className="text-right">
                    Bureau
                  </Label>
                  <Input
                    id="edit-office"
                    value={selectedProfessor.office}
                    onChange={(e) => setSelectedProfessor({ ...selectedProfessor, office: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-subjects" className="text-right">
                    Matières
                  </Label>
                  <Textarea
                    id="edit-subjects"
                    value={selectedProfessor.subjects}
                    onChange={(e) => setSelectedProfessor({ ...selectedProfessor, subjects: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" onClick={handleEditProfessor}>
                Sauvegarder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
