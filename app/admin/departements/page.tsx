"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Plus, Search, Edit, Trash2, Building, Users, MapPin } from "lucide-react"

const mockDepartments = [
  {
    id: "1",
    name: "Architecture",
    code: "ARCH",
    head: "Dr. Karim Boumediene",
    professors: 12,
    students: 450,
    rooms: 8,
    description: "Département d'Architecture et d'Urbanisme",
    building: "Bâtiment A",
    phone: "+213 555 111 222",
    email: "arch@univ.dz",
  },
  {
    id: "2",
    name: "Mathématiques",
    code: "MATH",
    head: "Dr. Ahmed Benali",
    professors: 15,
    students: 380,
    rooms: 6,
    description: "Département de Mathématiques et Statistiques",
    building: "Bâtiment B",
    phone: "+213 555 222 333",
    email: "math@univ.dz",
  },
  {
    id: "3",
    name: "Informatique",
    code: "INFO",
    head: "Dr. Omar Khelifi",
    professors: 18,
    students: 520,
    rooms: 10,
    description: "Département d'Informatique et Technologies",
    building: "Bâtiment C",
    phone: "+213 555 333 444",
    email: "info@univ.dz",
  },
  {
    id: "4",
    name: "Sciences de la Matière",
    code: "SM",
    head: "Dr. Leila Amara",
    professors: 14,
    students: 290,
    rooms: 7,
    description: "Département de Physique et Chimie",
    building: "Bâtiment D",
    phone: "+213 555 444 555",
    email: "sm@univ.dz",
  },
  {
    id: "5",
    name: "Sciences de la Nature et de la Vie",
    code: "SNV",
    head: "Dr. Fatima Mansouri",
    professors: 16,
    students: 410,
    rooms: 9,
    description: "Département de Biologie et Sciences Naturelles",
    building: "Bâtiment E",
    phone: "+213 555 555 666",
    email: "snv@univ.dz",
  },
]

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState(mockDepartments)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    code: "",
    head: "",
    description: "",
    building: "",
    phone: "",
    email: "",
  })

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddDepartment = () => {
    const department = {
      id: (departments.length + 1).toString(),
      ...newDepartment,
      professors: 0,
      students: 0,
      rooms: 0,
    }
    setDepartments([...departments, department])
    setNewDepartment({ name: "", code: "", head: "", description: "", building: "", phone: "", email: "" })
    setIsAddDialogOpen(false)
  }

  const handleEditDepartment = () => {
    const updatedDepartments = departments.map((dept) =>
      dept.id === selectedDepartment.id ? selectedDepartment : dept,
    )
    setDepartments(updatedDepartments)
    setIsEditDialogOpen(false)
    setSelectedDepartment(null)
  }

  const handleDeleteDepartment = (deptId: string) => {
    setDepartments(departments.filter((dept) => dept.id !== deptId))
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Départements</h1>
              <p className="text-gray-600">Gérer tous les départements de l'université</p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un Département
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouveau Département</DialogTitle>
                <DialogDescription>Remplissez les informations du nouveau département.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nom
                  </Label>
                  <Input
                    id="name"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    Code
                  </Label>
                  <Input
                    id="code"
                    value={newDepartment.code}
                    onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="head" className="text-right">
                    Chef de Département
                  </Label>
                  <Input
                    id="head"
                    value={newDepartment.head}
                    onChange={(e) => setNewDepartment({ ...newDepartment, head: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="building" className="text-right">
                    Bâtiment
                  </Label>
                  <Input
                    id="building"
                    value={newDepartment.building}
                    onChange={(e) => setNewDepartment({ ...newDepartment, building: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    value={newDepartment.phone}
                    onChange={(e) => setNewDepartment({ ...newDepartment, phone: e.target.value })}
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
                    value={newDepartment.email}
                    onChange={(e) => setNewDepartment({ ...newDepartment, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newDepartment.description}
                    onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddDepartment}>
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
                placeholder="Rechercher par nom, code ou chef de département..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDepartments.map((department) => (
            <Card key={department.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-2 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold">{department.name}</h3>
                      <Badge variant="outline" className="mt-1">
                        {department.code}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDepartment(department)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDepartment(department.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{department.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">Chef:</span>
                      <span className="ml-1">{department.head}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">Bâtiment:</span>
                      <span className="ml-1">{department.building}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{department.professors}</div>
                      <div className="text-xs text-gray-600">Professeurs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{department.students}</div>
                      <div className="text-xs text-gray-600">Étudiants</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{department.rooms}</div>
                      <div className="text-xs text-gray-600">Salles</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>📧 {department.email}</div>
                      <div>📞 {department.phone}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{departments.length}</div>
              <div className="text-sm text-gray-600">Total Départements</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {departments.reduce((acc, dept) => acc + dept.professors, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Professeurs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {departments.reduce((acc, dept) => acc + dept.students, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Étudiants</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {departments.reduce((acc, dept) => acc + dept.rooms, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Salles</div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier le Département</DialogTitle>
              <DialogDescription>Modifiez les informations du département.</DialogDescription>
            </DialogHeader>
            {selectedDepartment && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Nom
                  </Label>
                  <Input
                    id="edit-name"
                    value={selectedDepartment.name}
                    onChange={(e) => setSelectedDepartment({ ...selectedDepartment, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-code" className="text-right">
                    Code
                  </Label>
                  <Input
                    id="edit-code"
                    value={selectedDepartment.code}
                    onChange={(e) => setSelectedDepartment({ ...selectedDepartment, code: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-head" className="text-right">
                    Chef de Département
                  </Label>
                  <Input
                    id="edit-head"
                    value={selectedDepartment.head}
                    onChange={(e) => setSelectedDepartment({ ...selectedDepartment, head: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-building" className="text-right">
                    Bâtiment
                  </Label>
                  <Input
                    id="edit-building"
                    value={selectedDepartment.building}
                    onChange={(e) => setSelectedDepartment({ ...selectedDepartment, building: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-phone" className="text-right">
                    Téléphone
                  </Label>
                  <Input
                    id="edit-phone"
                    value={selectedDepartment.phone}
                    onChange={(e) => setSelectedDepartment({ ...selectedDepartment, phone: e.target.value })}
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
                    value={selectedDepartment.email}
                    onChange={(e) => setSelectedDepartment({ ...selectedDepartment, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={selectedDepartment.description}
                    onChange={(e) => setSelectedDepartment({ ...selectedDepartment, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" onClick={handleEditDepartment}>
                Sauvegarder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
