import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"

const grades = [
  { level: "L1", name: "Licence 1ère année", sections: ["A", "B"] },
  { level: "L2", name: "Licence 2ème année", sections: ["A", "B", "C"] },
  { level: "L3", name: "Licence 3ème année", sections: ["A", "B"] },
  { level: "M1", name: "Master 1ère année", sections: ["A"] },
  { level: "M2", name: "Master 2ème année", sections: ["A"] },
]

const departmentNames: { [key: string]: string } = {
  architecture: "Architecture",
  mathematiques: "Mathématiques",
  informatique: "Informatique",
  "sciences-matiere": "Sciences de la Matière (SM)",
  "sciences-nature-vie": "Sciences de la Nature et de la Vie (SNV)",
}

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ nom: string }>
}) {
  const { nom } = await params
  const departmentName = departmentNames[nom] || nom

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Département {departmentName}</h1>
        </div>

        {/* Grades Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grades.map((grade) => (
            <Card key={grade.level} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  {grade.level}
                </CardTitle>
                <p className="text-sm text-gray-600">{grade.name}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">Sections:</p>
                  <div className="flex flex-wrap gap-2">
                    {grade.sections.map((section) => (
                      <Link
                        key={section}
                        href={`/emplois/${nom}/${grade.level.toLowerCase()}/${section.toLowerCase()}`}
                      >
                        <Button variant="outline" size="sm" className="hover:bg-blue-50">
                          Section {section}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
