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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Eye,
} from "lucide-react"

// Mock data for sections and groups
const mockSections = [
  {
    id: "1",
    name: "Informatique 1",
    level: "1ère Année",
    groups: [
      { id: "1", name: "Groupe A", students: 35 },
      { id: "2", name: "Groupe B", students: 32 },
      { id: "3", name: "Groupe C", students: 30 },
    ],
    hasEmploi: true,
  },
  {
    id: "2",
    name: "Informatique 2",
    level: "2ème Année",
    groups: [
      { id: "4", name: "Groupe A", students: 28 },
      { id: "5", name: "Groupe B", students: 30 },
    ],
    hasEmploi: false,
  },
]

const levels = ["1ère Année", "2ème Année", "3ème Année", "4ème Année", "5ème Année"]

export default function GradeManagementPage() {
  const [sections, setSections] = useState(mockSections)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSection, setNewSection] = useState({
    name: "",
    level: "",
    groups: [] as { name: string; students: number }[],
  })

  const filteredSections = sections.filter((section) =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.level.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddSection = () => {
    const section = {
      id: (sections.length + 1).toString(),
      name: newSection.name,
      level: newSection.level,
      groups: newSection.groups.map((group, index) => ({
        id: (sections.length * 10 + index + 1).toString(),
        ...group,
      })),
      hasEmploi: false,
    }
    setSections([...sections, section])
    setNewSection({
      name: "",
      level: "",
      groups: [],
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId))
  }

  const handleAddGroup = () => {
    setNewSection({
      ...newSection,
      groups: [...newSection.groups, { name: "", students: 0 }],
    })
  }

  const handleRemoveGroup = (index: number) => {
    setNewSection({
      ...newSection,
      groups: newSection.groups.filter((_, i) => i !== index),
    })
  }

  const handleGroupChange = (index: number, field: string, value: string | number) => {
    const updatedGroups = [...newSection.groups]
    updatedGroups[index] = {
      ...updatedGroups[index],
      [field]: value,
    }
    setNewSection({
      ...newSection,
      groups: updatedGroups,
    })
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Sections</h1>
              <p className="text-gray-600">Gérer les sections et groupes du département</p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une Section
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Ajouter une Nouvelle Section</DialogTitle>
                <DialogDescription>
                  Créez une nouvelle section et définissez ses groupes.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de la section</Label>
                    <Input
                      id="name"
                      value={newSection.name}
                      onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                      placeholder="Ex: Informatique 1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Niveau</Label>
                    <Select value={newSection.level} onValueChange={(value) => setNewSection({ ...newSection, level: value })}>
                      <SelectTrigger>
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
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Groupes</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddGroup}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un groupe
                    </Button>
                  </div>
                  {newSection.groups.map((group, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 items-end">
                      <div className="space-y-2">
                        <Label>Nom du groupe</Label>
                        <Input
                          value={group.name}
                          onChange={(e) => handleGroupChange(index, "name", e.target.value)}
                          placeholder="Ex: Groupe A"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nombre d'étudiants</Label>
                        <Input
                          type="number"
                          value={group.students}
                          onChange={(e) => handleGroupChange(index, "students", parseInt(e.target.value))}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveGroup(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddSection} disabled={!newSection.name || !newSection.level || newSection.groups.length === 0}>
                  Ajouter la Section
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom ou niveau..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Sections ({filteredSections.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Groupes</TableHead>
                  <TableHead>Emploi du temps</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        {section.name}
                      </div>
                    </TableCell>
                    <TableCell>{section.level}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {section.groups.map((group) => (
                          <div key={group.id} className="flex items-center text-sm">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{group.name}</span>
                            <Badge variant="secondary" className="ml-2">
                              {group.students} étudiants
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {section.hasEmploi ? (
                        <Link href={`/chef-departement/emplois/${section.id}`}>
                          <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            Voir l'emploi
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/chef-departement/emplois/${section.id}/create`}>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Créer l'emploi
                          </Button>
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSection(section.id)}
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
      </div>
    </div>
  )
}
