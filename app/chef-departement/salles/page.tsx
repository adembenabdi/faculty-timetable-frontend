'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RoomDialog, RoomList, RoomStats } from '@/components/rooms';
import { roomApi, Room, RoomStats as RoomStatsType } from '@/lib/api';
import { toast } from 'sonner';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [stats, setStats] = useState<RoomStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const fetchRooms = async () => {
    try {
      const { data } = await roomApi.getAll();
      setRooms(data);
    } catch (error) {
      toast.error('Failed to fetch rooms');
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await roomApi.getStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to fetch room statistics');
    }
  };

  const handleCreateRoom = async (data: Omit<Room, 'id'>) => {
    try {
      await roomApi.create(data);
      toast.success('Room created successfully');
      setDialogOpen(false);
      fetchRooms();
      fetchStats();
    } catch (error) {
      toast.error('Failed to create room');
    }
  };

  const handleUpdateRoom = async (id: string, data: Omit<Room, 'id'>) => {
    try {
      await roomApi.update(id, data);
      toast.success('Room updated successfully');
      setDialogOpen(false);
      setSelectedRoom(null);
      fetchRooms();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update room');
    }
  };

  const handleDeleteRoom = async (id: string) => {
    try {
      await roomApi.delete(id);
      toast.success('Room deleted successfully');
      fetchRooms();
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete room');
    }
  };

  const handleDialogSubmit = (id: string | undefined, data: Omit<Room, 'id'>) => {
    if (id) {
      handleUpdateRoom(id, data);
    } else {
      handleCreateRoom(data);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRooms(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <Button onClick={() => setDialogOpen(true)}>Add Room</Button>
      </div>

      {stats && <RoomStats stats={stats} />}

      <Card>
        <RoomList
          rooms={rooms}
          onEdit={(room) => {
            setSelectedRoom(room);
            setDialogOpen(true);
          }}
          onDelete={handleDeleteRoom}
        />
      </Card>

      <RoomDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleDialogSubmit}
        room={selectedRoom}
        onClose={() => {
          setSelectedRoom(null);
          setDialogOpen(false);
        }}
      />
    </div>
  );
} 