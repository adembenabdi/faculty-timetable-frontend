'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  MapPin,
  Users,
  Monitor,
  Eye,
  Clock,
  Building,
  RotateCcw,
  Loader2,
} from 'lucide-react';

interface Room {
  id: string;
  name: string;
  code: string;
  type: string;
  capacity: number;
  building: string;
  floor: number;
  equipment: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const departments = [
  "Commun",
  "Architecture",
  "Mathématiques",
  "Informatique",
  "Sciences de la Matière",
  "Sciences de la Nature et de la Vie",
];

const roomTypes = [
  { value: "amphi", label: "Amphithéâtre" },
  { value: "td", label: "TD" },
  { value: "tp", label: "TP" },
  { value: "lab", label: "Laboratoire" },
  { value: "bureau", label: "Bureau" },
];

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const timeSlots = ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00"];

export default function ChefDepartementSallesPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pending states for filters
  const [pendingFreeSearchTerm, setPendingFreeSearchTerm] = useState("");
  const [pendingSelectedDay, setPendingSelectedDay] = useState(days[0]);
  const [pendingSelectedTimeSlots, setPendingSelectedTimeSlots] = useState<string[]>([timeSlots[0]]);
  const [pendingSelectedDepartment, setPendingSelectedDepartment] = useState("Tous");
  const [pendingSelectedType, setPendingSelectedType] = useState("Tous");
  const [pendingMinCapacity, setPendingMinCapacity] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Actual filter states (used for filtering results)
  const [freeSearchTerm, setFreeSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([timeSlots[0]]);
  const [selectedDepartment, setSelectedDepartment] = useState("Tous");
  const [selectedType, setSelectedType] = useState("Tous");
  const [minCapacity, setMinCapacity] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/salles");
        if (!res.ok) throw new Error("Failed to fetch salles");
        const data = await res.json();
        setRooms(data);
      } catch (error) {
        console.error("❌ Failed to load salles:", error);
        setError("Échec du chargement des salles");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const getRoomIcon = (type: string) => {
    switch (type) {
      case "amphi":
        return <Users className="h-4 w-4" />;
      case "tp":
      case "lab":
        return <Monitor className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getRoomTypeLabel = (type: string) => {
    const roomType = roomTypes.find(rt => rt.value === type);
    return roomType ? roomType.label : type;
  };

  const getLocationDisplay = (room: Room) => {
    return `${room.building} - ${room.floor === 0 ? 'RDC' : `Étage ${room.floor}`}`;
  };

  function isRoomFree(room: Room, day: string, timeSlots: string[]): boolean {
    // This is a simplified check - in a real app, you'd check against actual bookings
    return true;
  }

  const freeRooms = rooms.filter((room: Room) => {
    const isFree = isRoomFree(room, selectedDay, selectedTimeSlots);
    const matchesSearch = room.name.toLowerCase().includes(freeSearchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(freeSearchTerm.toLowerCase());
    const matchesDepartment = true; // Always true until departments are available on Room
    const matchesType = selectedType === "Tous" || getRoomTypeLabel(room.type) === selectedType;
    const matchesCapacity = !minCapacity || room.capacity >= parseInt(minCapacity);
    return isFree && matchesSearch && matchesDepartment && matchesType && matchesCapacity;
  });

  const resetFilters = () => {
    setPendingFreeSearchTerm("");
    setPendingSelectedDay(days[0]);
    setPendingSelectedTimeSlots([timeSlots[0]]);
    setPendingSelectedDepartment("Tous");
    setPendingSelectedType("Tous");
    setPendingMinCapacity("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement des salles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
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
              <h1 className="text-3xl font-bold text-gray-900">Salles Libres</h1>
              <p className="text-gray-600">Trouver des salles disponibles selon vos critères</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <span>Filtres Avancés</span>
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              <RotateCcw className="h-4 w-4 mr-2" />
              <span>Réinitialiser</span>
            </Button>
          </div>
        </div>

        {/* Basic Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom ou localisation..."
                  value={pendingFreeSearchTerm}
                  onChange={(e) => setPendingFreeSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div>
                <Label>Jour</Label>
                <Select value={pendingSelectedDay} onValueChange={setPendingSelectedDay}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Créneaux</Label>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((slot) => (
                    <label key={slot} className="flex items-center space-x-1">
                      <Checkbox
                        checked={pendingSelectedTimeSlots.includes(slot)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPendingSelectedTimeSlots([...pendingSelectedTimeSlots, slot]);
                          } else {
                            setPendingSelectedTimeSlots(pendingSelectedTimeSlots.filter((s) => s !== slot));
                          }
                        }}
                        id={`slot-${slot}`}
                      />
                      <span className="text-sm">{slot}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button onClick={() => {
                setFreeSearchTerm(pendingFreeSearchTerm);
                setSelectedDay(pendingSelectedDay);
                setSelectedTimeSlots(pendingSelectedTimeSlots);
                setSelectedDepartment(pendingSelectedDepartment);
                setSelectedType(pendingSelectedType);
                setMinCapacity(pendingMinCapacity);
              }}>
                Filtrer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Département</Label>
                  <Select value={pendingSelectedDepartment} onValueChange={setPendingSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Tous", ...departments].map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type de Salle</Label>
                  <Select value={pendingSelectedType} onValueChange={setPendingSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Tous", ...roomTypes.map(rt => rt.label)].map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Capacité Minimum</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 30"
                    value={pendingMinCapacity}
                    onChange={(e) => setPendingMinCapacity(e.target.value)}
                  />
                </div>
                <div>
                  <Button variant="outline" onClick={resetFilters} className="w-full">
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Salles Libres ({freeRooms.length})
              </h2>
              <p className="text-gray-600">
                Pour le {selectedDay} de {selectedTimeSlots.join(", ")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total des salles</p>
              <p className="text-2xl font-bold text-blue-600">{rooms.length}</p>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacité</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {freeRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {getRoomIcon(room.type)}
                        <span className="ml-2">{room.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getRoomTypeLabel(room.type)}</TableCell>
                    <TableCell>{room.capacity} places</TableCell>
                    <TableCell>{getLocationDisplay(room)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link href={`/salles/${room.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {freeRooms.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Aucune salle libre trouvée</p>
                <p className="text-sm">
                  Essayez de modifier vos critères de recherche ou de changer le créneau horaire.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 