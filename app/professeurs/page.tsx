import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Search, User, Mail, Phone } from "lucide-react"

const professors = [
  {
    id: "benali",
    name: "Dr. Ahmed Benali",
    department: "Mathématiques",
    email: "a.benali@univ.dz",
    phone: "+213 555 123 456",
    subjects: ["Analyse", "Algèbre", "Géométrie"],
  },
  {
    id: "mansouri",
    name: "Dr. Fatima Mansouri",
    department: "Physique",
    email: "f.mansouri@univ.dz",
    phone: "+213 555 234 567",
    subjects: ["Mécanique", "Thermodynamique", "Optique"],
  },
  {
    id: "khelifi",
    name: "Dr. Omar Khelifi",
    department: "Informatique",
    email: "o.khelifi@univ.dz",
    phone: "+213 555 345 678",
    subjects: ["Programmation", "Base de Données", "Réseaux"],
  },
  {
    id: "amara",
    name: "Dr. Leila Amara",
    department: "Chimie",
    email: "l.amara@univ.dz",
    phone: "+213 555 456 789",
    subjects: ["Chimie Organique", "Chimie Analytique"],
  },
  {
    id: "smith",
    name: "Ms. Sarah Smith",
    department: "Langues",
    email: "s.smith@univ.dz",
    phone: "+213 555 567 890",
    subjects: ["Anglais", "Communication"],
  },
  {
    id: "boumediene",
    name: "Dr. Karim Boumediene",
    department: "Architecture",
    email: "k.boumediene@univ.dz",
    phone: "+213 555 678 901",
    subjects: ["Design", "Urbanisme", "Histoire de l'Architecture"],
  },
]

export default function ProfessorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Tous les Professeurs</h1>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Rechercher un professeur par nom ou département..." className="pl-10" />
            </div>
          </CardContent>
        </Card>

        {/* Professors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professors.map((professor) => (
            <Card key={professor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{professor.name}</h3>
                    <p className="text-sm text-gray-600 font-normal">{professor.department}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {professor.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {professor.phone}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Matières enseignées:</p>
                    <div className="flex flex-wrap gap-1">
                      {professor.subjects.map((subject) => (
                        <span key={subject} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link href={`/professeurs/${professor.id}`}>
                    <Button variant="outline" className="w-full mt-4">
                      Voir l'emploi du temps
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
