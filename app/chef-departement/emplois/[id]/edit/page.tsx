"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"
import { ArrowLeft, Save, Plus, Edit, Trash2, Clock, MapPin, User } from "lucide-react"

// Mock data for the timetable editor - department specific
const mockTimetableData = {
  "08:00-09:30": {
    Lundi: { subject: "Programmation", room: "Lab Info 1", professor: "Dr. Khelifi", type: "TP" },
    Mardi: null,
    Mercredi: { subject: "Algorithmes", room: "Salle Info 101", professor: "Dr. Belkacem", type: "TD" },
    Jeudi: null,
    Vendredi: { subject: "Base de Données", room: "Lab Info 2", professor: "Dr. Khelifi", type: "TP" },
  },
  "09:45-11:15": {
    Lundi: null,
    Mardi: { subject: "Programmation", room: "Amphi Info", professor: "Dr. Khelifi", type: "Cours" },
    Mercredi: null,
    Jeudi: { subject: "Réseaux", room: "Salle Info 102", professor: "Dr. Messaoud", type: "TD" },
    Vendredi: null,
  },
  "11:30-13:00": {
    Lundi: { subject: "Algorithmes", room: "Amphi Info", professor: "Dr. Belkacem", type: "Cours" },
    Mardi: null,
    Mercredi: { subject: "Base de Données", room: "Salle Info 101", professor: "Dr. Khelifi", type: "TD" },
    Jeudi: null,
    Vendredi: { subject: "Développement Web", room: "Lab Info 1", professor: "Ms. Bouali", type: "TP" },
  },
  "14:00-15:30": {
    Lundi: null,
    Mardi: { subject: "Systèmes d'Exploitation", room: "Amphi Info", professor: "Dr. Messaoud", type: "Cours" },
    Mercredi: null,
    Jeudi: { subject: "Intelligence Artificielle", room: "Salle Info 102", professor: "Dr. Belkacem", type: "TD" },
    Vendredi: null,
  },
  "15:45-17:15": {
    Lundi: null,
    Mardi: null,
    Mercredi: null,
    Jeudi: null,
    Vendredi: null,
  },
}

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]
const timeSlots = Object.keys(mockTimetableData)

// Department-specific data
const subjects = [
  "Programmation",
  "Algorithmes",
  "Base de Données",
  "Réseaux",
  "Intelligence Artificielle",
  "Systèmes d'Exploitation",
  "Développement Web",
]
const rooms = ["Amphi Info", "Salle Info 101", "Salle Info 102", "Lab Info 1", "Lab Info 2"]
const professors = ["Dr. Khelifi", "Dr. Belkacem", "Dr. Messaoud", "Ms. Bouali"]
const courseTypes = ["Cours", "TD", "TP"]

export default function ChefDepartementEditTimetablePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [timetableData, setTimetableData] = useState(mockTimetableData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ timeSlot: string; day: string } | null>(null)
  const [newCourse, setNewCourse] = useState({
    subject: "",
    room: "",
    professor: "",
    type: "",
  })

  const getSubjectColor = (type: string) => {
    switch (type) {
      case "Cours":
        return "bg-blue-100 border-blue-300 text-blue-800"
      case "TD":
        return "bg-green-100 border-green-300 text-green-800"
      case "TP":
        return "bg-purple-100 border-purple-300 text-purple-800"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800"
    }
  }

  const handleAddCourse = () => {
    if (selectedSlot) {
      const updatedData = { ...timetableData }
      updatedData[selectedSlot.timeSlot as keyof typeof timetableData][
        selectedSlot.day as keyof (typeof timetableData)[keyof typeof timetableData]
      ] = newCourse as any
      setTimetableData(updatedData)
      setNewCourse({ subject: "", room: "", professor: "", type: "" })
      setIsAddDialogOpen(false)
      setSelectedSlot(null)
    }
  }

  const handleRemoveCourse = (timeSlot: string, day: string) => {
    const updatedData = { ...timetableData }
    updatedData[timeSlot as keyof typeof timetableData][
      day as keyof (typeof timetableData)[keyof typeof timetableData]
    ] = null as any
    setTimetableData(updatedData)
  }

  const handleCellClick = (timeSlot: string, day: string) => {
    const course =
      timetableData[timeSlot as keyof typeof timetableData][
        day as keyof (typeof timetableData)[keyof typeof timetableData]
      ]

    if (!course) {
      setSelectedSlot({ timeSlot, day })
      setIsAddDialogOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/chef-departement/emplois">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Éditer l'Emploi du Temps</h1>
              <p className="text-gray-600">L1 Informatique A - Semestre 1 2023-2024</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Aperçu</Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">
              <strong>Instructions:</strong> Cliquez sur une case vide pour ajouter un cours. Cliquez sur l'icône de
              modification pour éditer un cours existant, ou sur l'icône de suppression pour le retirer.
            </p>
          </CardContent>
        </Card>

        {/* Timetable Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Grille d'Emploi du Temps - Département d'Informatique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-3 bg-gray-100 text-left font-semibold">
                      <Clock className="h-4 w-4 inline mr-2" />
                      Horaires
                    </th>
                    {days.map((day) => (
                      <th
                        key={day}
                        className="border border-gray-300 p-3 bg-gray-100 text-center font-semibold min-w-[200px]"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((timeSlot) => (
                    <tr key={timeSlot}>
                      <td className="border border-gray-300 p-3 bg-gray-50 font-medium text-sm">{timeSlot}</td>
                      {days.map((day) => {
                        const course =
                          timetableData[timeSlot as keyof typeof timetableData][
                            day as keyof (typeof timetableData)[keyof typeof timetableData]
                          ]
                        return (
                          <td key={day} className="border border-gray-300 p-2">
                            {course ? (
                              <div className={`p-3 rounded-lg border-2 ${getSubjectColor(course.type)} relative group`}>
                                <div className="font-semibold text-sm mb-1">{course.subject}</div>
                                <div className="text-xs space-y-1">
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {course.room}
                                  </div>
                                  <div className="flex items-center">
                                    <User className="h-3 w-3 mr-1" />
                                    {course.professor}
                                  </div>
                                  <div className="font-medium">{course.type}</div>
                                </div>
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="flex space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                                      onClick={() => {
                                        setSelectedSlot({ timeSlot, day })
                                        setNewCourse(course)
                                        setIsAddDialogOpen(true)
                                      }}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 bg-white/80 hover:bg-white text-red-600"
                                      onClick={() => handleRemoveCourse(timeSlot, day)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div
                                className="h-20 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                                onClick={() => handleCellClick(timeSlot, day)}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Ajouter
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Course Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedSlot &&
                timetableData[selectedSlot.timeSlot as keyof typeof timetableData][
                  selectedSlot.day as keyof (typeof timetableData)[keyof typeof timetableData]
                ]
                  ? "Modifier le Cours"
                  : "Ajouter un Cours"}
              </DialogTitle>
              <DialogDescription>{selectedSlot && `${selectedSlot.day} ${selectedSlot.timeSlot}`}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Matière
                </Label>
                <Select
                  value={newCourse.subject}
                  onValueChange={(value) => setNewCourse({ ...newCourse, subject: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner la matière" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room" className="text-right">
                  Salle
                </Label>
                <Select value={newCourse.room} onValueChange={(value) => setNewCourse({ ...newCourse, room: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner la salle" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="professor" className="text-right">
                  Professeur
                </Label>
                <Select
                  value={newCourse.professor}
                  onValueChange={(value) => setNewCourse({ ...newCourse, professor: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner le professeur" />
                  </SelectTrigger>
                  <SelectContent>
                    {professors.map((professor) => (
                      <SelectItem key={professor} value={professor}>
                        {professor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select value={newCourse.type} onValueChange={(value) => setNewCourse({ ...newCourse, type: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddCourse}>
                {selectedSlot &&
                timetableData[selectedSlot.timeSlot as keyof typeof timetableData][
                  selectedSlot.day as keyof (typeof timetableData)[keyof typeof timetableData]
                ]
                  ? "Modifier"
                  : "Ajouter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded mr-2"></div>
            <span className="text-sm">Cours</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded mr-2"></div>
            <span className="text-sm">TD</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded mr-2"></div>
            <span className="text-sm">TP</span>
          </div>
        </div>
      </div>
    </div>
  )
}
