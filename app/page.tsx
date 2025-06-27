import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap, Building2, Calculator, Monitor, Atom, Leaf, LogIn } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const departments = [
  {
    name: "Architecture",
    slug: "architecture",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    name: "Mathématiques",
    slug: "mathematiques",
    icon: Calculator,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    name: "Informatique",
    slug: "informatique",
    icon: Monitor,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    name: "Sciences de la Matière (SM)",
    slug: "sciences-matiere",
    icon: Atom,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    name: "Sciences de la Nature et de la Vie (SNV)",
    slug: "sciences-nature-vie",
    icon: Leaf,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
]

const levels = ["L1", "L2", "L3", "M1", "M2"]
const sections = ["A", "B", "C"]
const groups = ["G1", "G2", "G3", "G4"]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Faculty Name */}
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Université Alger 1</h1>
                <p className="text-sm text-gray-600">Faculté des Sciences</p>
              </div>
            </div>

            {/* Login Button */}
            <Link href="/login">
              <Button variant="outline" className="flex items-center space-x-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <LogIn className="h-4 w-4" />
                <span>Connexion</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Système de Gestion des Emplois du Temps
          </h2>
          <p className="text-xl text-gray-600">Faculté des Sciences - Université Alger 1</p>
        </div>
        
        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {departments.map((dept) => {
            const IconComponent = dept.icon
            return (
              <Card key={dept.slug} className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`${dept.bgColor} p-6 rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-300`}>
                      <IconComponent className={`h-10 w-10 ${dept.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors mb-4">
                      Consulter les emplois du temps par groupe
                    </p>
                    
                    {/* Department Navigation Menu */}
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger className="text-sm">Voir les Emplois</NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className="grid w-[400px] gap-3 p-4">
                              <div className="grid grid-cols-2 gap-2">
                                {levels.map((level) => (
                                  <div key={level} className="space-y-2">
                                    <h4 className="font-medium text-sm text-gray-900">{level}</h4>
                                    {sections.map((section) => (
                                      <div key={section} className="space-y-1">
                                        <p className="text-xs text-gray-600">Section {section}</p>
                                        <div className="flex flex-wrap gap-1">
                                          {groups.map((group) => (
                                            <Link
                                              key={group}
                                              href={`/emplois/${dept.slug}/${level.toLowerCase()}/${section.toLowerCase()}/${group.toLowerCase()}`}
                                            >
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-2 text-xs hover:bg-blue-50 hover:text-blue-600"
                                              >
                                                {group}
                                              </Button>
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>© 2025 Université de Sciences - Système de Gestion des Emplois du Temps</p>
        </div>
      </div>
    </div>
  )
}
