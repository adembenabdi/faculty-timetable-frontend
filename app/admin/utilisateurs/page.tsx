"use client"

import { useState, useEffect } from "react"
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
import { ArrowLeft, Plus, Search, Edit, Trash2, UserCheck, Mail, Shield, Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  department_id: string | null
  department?: {
    name: string
  }
  created_at: string
  last_login?: string
  is_active: boolean
}

interface Department {
  id: string
  name: string
}

const roles = [
  { value: "professor", label: "Professeur" },
  { value: "department_head", label: "Chef de Département" },
  { value: "admin", label: "Administrateur" },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    departmentId: "",
    password: "",
  })

  // Enhanced fetch with error handling
  const fetchData = async (url: string, errorMessage: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Check if response is HTML
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        if (text.startsWith('<!DOCTYPE html>')) {
          throw new Error('Server returned HTML instead of JSON. Check API endpoint.');
        }
      }
      
      if (response.status === 401) {
        throw new Error('Authentication failed');
      }
      
      if (!response.ok) {
        // Try to get error message from JSON if possible
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        } catch (jsonError) {
          throw new Error(`Request failed with status ${response.status}`);
        }
      }
      
      return await response.json();
    } catch (error) {
      console.error(`${errorMessage}:`, error);
      toast.error(error instanceof Error ? error.message : errorMessage);
      throw error;
    }
  }

  const fetchUsers = async () => {
    try {
      const data = await fetchData('/api/users', 'Erreur lors du chargement des utilisateurs');
      setUsers(data);
    } catch (error) {
      // Error already handled in fetchData
    }
  }

  const fetchDepartments = async () => {
    try {
      const data = await fetchData('/api/departments', 'Erreur lors du chargement des départements');
      setDepartments(data);
    } catch (error) {
      // Error already handled in fetchData
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchUsers(), fetchDepartments()]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.role || !newUser.departmentId || !newUser.password) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Authentication token not found')
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          departmentId: newUser.departmentId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création de l\'utilisateur')
      }

      toast.success('Utilisateur créé avec succès')
      setNewUser({ firstName: "", lastName: "", email: "", role: "", departmentId: "", password: "" })
      setIsAddDialogOpen(false)
      await fetchUsers()
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création de l\'utilisateur')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditUser = async () => {
    if (!selectedUser) return

    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Authentication token not found')
      
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: selectedUser.first_name,
          lastName: selectedUser.last_name,
          email: selectedUser.email,
          role: selectedUser.role,
          departmentId: selectedUser.department_id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la mise à jour')
      }

      toast.success('Utilisateur mis à jour avec succès')
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      await fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return

    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Authentication token not found')
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression')
      }

      toast.success('Utilisateur supprimé avec succès')
      await fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression')
    }
  }

  const handleToggleStatus = async (userId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Authentication token not found')
      
      const response = await fetch(`/api/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors du changement de statut')
      }

      toast.success('Statut mis à jour avec succès')
      await fetchUsers()
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors du changement de statut')
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800">Actif</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Inactif</Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800">Administrateur</Badge>
      case "department_head":
        return <Badge className="bg-blue-100 text-blue-800">Chef de Département</Badge>
      case "professor":
        return <Badge className="bg-gray-100 text-gray-800">Professeur</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-600" />
      case "department_head":
        return <UserCheck className="h-4 w-4 text-blue-600" />
      default:
        return <UserCheck className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement des utilisateurs...</span>
        </div>
      </div>
    )
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
              <p className="text-gray-600">Gérer tous les comptes utilisateurs du système</p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un Utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouvel Utilisateur</DialogTitle>
                <DialogDescription>Créez un nouveau compte utilisateur pour le système.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="firstName" className="text-right">
                    Prénom
                  </Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lastName" className="text-right">
                    Nom
                  </Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
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
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Rôle
                  </Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner le rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Département
                  </Label>
                  <Select
                    value={newUser.departmentId}
                    onValueChange={(value) => setNewUser({ ...newUser, departmentId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner le département" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddUser} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Création...
                    </>
                  ) : (
                    'Créer le Compte'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, email, rôle ou département..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Utilisateurs ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière Connexion</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {getRoleIcon(user.role)}
                        <div className="ml-3">
                          <div className="font-semibold">{`${user.first_name} ${user.last_name}`}</div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.department?.name || 'Aucun département'}</TableCell>
                    <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                    <TableCell>{user.last_login ? formatDate(user.last_login) : 'Jamais'}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(user.id)}
                          title={user.is_active ? "Désactiver" : "Activer"}
                        >
                          {user.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-gray-600">Total Utilisateurs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter((u) => u.is_active).length}
              </div>
              <div className="text-sm text-gray-600">Utilisateurs Actifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">
                {users.filter((u) => u.role === "admin").length}
              </div>
              <div className="text-sm text-gray-600">Administrateurs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {users.filter((u) => u.role === "professor").length}
              </div>
              <div className="text-sm text-gray-600">Professeurs</div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier l'Utilisateur</DialogTitle>
              <DialogDescription>Modifiez les informations de l'utilisateur.</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-firstName" className="text-right">
                    Prénom
                  </Label>
                  <Input
                    id="edit-firstName"
                    value={selectedUser.first_name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, first_name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-lastName" className="text-right">
                    Nom
                  </Label>
                  <Input
                    id="edit-lastName"
                    value={selectedUser.last_name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, last_name: e.target.value })}
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
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">
                    Rôle
                  </Label>
                  <Select
                    value={selectedUser.role}
                    onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-department" className="text-right">
                    Département
                  </Label>
                  <Select
                    value={selectedUser.department_id ?? undefined}
                    onValueChange={(value) => setSelectedUser({ ...selectedUser, department_id: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" onClick={handleEditUser} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  'Sauvegarder'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}