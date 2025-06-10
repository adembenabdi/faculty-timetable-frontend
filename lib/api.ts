import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: string;
  building: string;
  floor: number;
}

export interface RoomStats {
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

// Auth API
export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (currentPassword: string, newPassword: string) => 
    api.put('/auth/password', { currentPassword, newPassword }),
};

// Department API
export const departmentApi = {
  getAll: () => api.get<any[]>('/departments'),
  getById: (id: string) => api.get<any>(`/departments/${id}`),
  create: (data: any) => api.post<any>('/departments', data),
  update: (id: string, data: any) => api.put<any>(`/departments/${id}`, data),
  delete: (id: string) => api.delete(`/departments/${id}`),
  getStats: (id: string) => api.get<any>(`/departments/${id}/stats`),
};

// Grade API
export const gradeApi = {
  getAll: () => api.get<any[]>('/grades'),
  getById: (id: string) => api.get<any>(`/grades/${id}`),
  create: (data: any) => api.post<any>('/grades', data),
  update: (id: string, data: any) => api.put<any>(`/grades/${id}`, data),
  delete: (id: string) => api.delete(`/grades/${id}`),
  getStats: (id: string) => api.get<any>(`/grades/${id}/stats`),
};

// Section API
export const sectionApi = {
  getAll: () => api.get<any[]>('/sections'),
  getById: (id: string) => api.get<any>(`/sections/${id}`),
  create: (data: any) => api.post<any>('/sections', data),
  update: (id: string, data: any) => api.put<any>(`/sections/${id}`, data),
  delete: (id: string) => api.delete(`/sections/${id}`),
  getStats: (id: string) => api.get<any>(`/sections/${id}/stats`),
};

// Subject API
export const subjectApi = {
  getAll: () => api.get<any[]>('/subjects'),
  getById: (id: string) => api.get<any>(`/subjects/${id}`),
  create: (data: any) => api.post<any>('/subjects', data),
  update: (id: string, data: any) => api.put<any>(`/subjects/${id}`, data),
  delete: (id: string) => api.delete(`/subjects/${id}`),
  getStats: (id: string) => api.get<any>(`/subjects/${id}/stats`),
};

// Room API
export const roomApi = {
  getAll: () => api.get<Room[]>('/rooms'),
  getById: (id: string) => api.get<Room>(`/rooms/${id}`),
  create: (data: Omit<Room, 'id'>) => api.post<Room>('/rooms', data),
  update: (id: string, data: Omit<Room, 'id'>) => api.put<Room>(`/rooms/${id}`, data),
  delete: (id: string) => api.delete(`/rooms/${id}`),
  getStats: () => api.get<RoomStats>('/rooms/stats'),
  getAvailability: (id: string, dayOfWeek?: string) => 
    api.get(`/rooms/${id}/availability${dayOfWeek ? `?dayOfWeek=${dayOfWeek}` : ''}`),
};

// Timetable API
export const timetableApi = {
  getAll: () => api.get<any[]>('/timetable'),
  getById: (id: string) => api.get<any>(`/timetable/${id}`),
  create: (data: any) => api.post<any>('/timetable', data),
  update: (id: string, data: any) => api.put<any>(`/timetable/${id}`, data),
  delete: (id: string) => api.delete(`/timetable/${id}`),
  getByRoom: (roomId: string) => api.get<any>(`/timetable/room/${roomId}`),
  getBySection: (sectionId: string) => api.get<any>(`/timetable/section/${sectionId}`),
  getByProfessor: (professorId: string) => api.get<any>(`/timetable/professor/${professorId}`),
};

// Professor API
export const professorApi = {
  getAll: () => api.get<any[]>('/professors'),
  getById: (id: string) => api.get<any>(`/professors/${id}`),
  create: (data: any) => api.post<any>('/professors', data),
  update: (id: string, data: any) => api.put<any>(`/professors/${id}`, data),
  delete: (id: string) => api.delete(`/professors/${id}`),
  getStats: (id: string) => api.get<any>(`/professors/${id}/stats`),
  getAvailability: (id: string, dayOfWeek?: string) => 
    api.get(`/professors/${id}/availability${dayOfWeek ? `?dayOfWeek=${dayOfWeek}` : ''}`),
}; 