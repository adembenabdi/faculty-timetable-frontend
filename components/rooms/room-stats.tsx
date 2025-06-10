import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RoomStats {
  totalRooms: number;
  totalCapacity: number;
  byType: {
    classroom: number;
    laboratory: number;
    conference: number;
    other: number;
  };
  byBuilding: {
    [key: string]: number;
  };
}

interface RoomStatsProps {
  stats: RoomStats;
}

export function RoomStats({ stats }: RoomStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRooms}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCapacity}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">By Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Classrooms:</span>
              <span>{stats.byType.classroom}</span>
            </div>
            <div className="flex justify-between">
              <span>Laboratories:</span>
              <span>{stats.byType.laboratory}</span>
            </div>
            <div className="flex justify-between">
              <span>Conference Rooms:</span>
              <span>{stats.byType.conference}</span>
            </div>
            <div className="flex justify-between">
              <span>Other:</span>
              <span>{stats.byType.other}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">By Building</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Object.entries(stats.byBuilding).map(([building, count]) => (
              <div key={building} className="flex justify-between">
                <span>{building}:</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 