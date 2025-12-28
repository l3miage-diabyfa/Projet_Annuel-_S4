import { getTokenCookie } from '@/utils/cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// ===== TYPES =====
export interface Teacher {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

export interface Student {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

export interface Enrollment {
  id: string;
  classId: string;
  studentId: string;
  createdAt: string;
  student: Student;
}

export interface Class {
  id: string;
  name: string;
  description: string | null;
  academicYear: string;
  gradeLevel: string;
  isActive: boolean;
  teacherId: string;
  teacher: Teacher;
  enrollments: Enrollment[];
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  instructorName: string | null;
  instructorEmail: string | null;
  firstLessonDate: string | null;
  lastLessonDate: string | null;
  classId: string;
  createdAt: string;
  updatedAt: string;
}

// ===== HELPER: Decode JWT to get user info =====
export function getUserFromToken(): { userId: string; email: string; role: string } | null {
  const token = getTokenCookie();
  if (!token) return null;

  try {
    // JWT format: header.payload.signature
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    
    return {
      userId: decoded.sub, // "sub" is the user ID in your JWT
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
}

// ===== HELPER FUNCTIONS =====
function getAuthHeaders(): HeadersInit {
  const token = getTokenCookie();
  if (!token) {
    throw new Error('Non authentifié. Veuillez vous connecter.');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      message: `HTTP ${response.status}: ${response.statusText}` 
    }));
    throw new Error(error.message || 'Une erreur est survenue');
  }
  return response.json();
}

// ===== CLASSES API =====
export async function getClasses(params?: {
  teacherId?: string;
  isActive?: boolean;
}): Promise<Class[]> {
  const queryParams = new URLSearchParams();
  if (params?.teacherId) queryParams.append('teacherId', params.teacherId);
  if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
  
  const url = `${API_URL}/classes${queryParams.toString() ? `?${queryParams}` : ''}`;
  
  const response = await fetch(url, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  
  return handleResponse<Class[]>(response);
}

export async function getClass(id: string): Promise<Class> {
  const response = await fetch(`${API_URL}/classes/${id}`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  
  return handleResponse<Class>(response);
}

export async function createClass(data: {
  name: string;
  description?: string;
  academicYear: string;
  gradeLevel: string;
  teacherId: string;
  studentEmails?: string;
}): Promise<Class> {
  const response = await fetch(`${API_URL}/classes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  return handleResponse<Class>(response);
}

export async function updateClass(
  id: string,
  data: {
    name?: string;
    description?: string;
  }
): Promise<Class> {
  const response = await fetch(`${API_URL}/classes/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  return handleResponse<Class>(response);
}

export async function deleteClass(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/classes/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to delete class' }));
    throw new Error(error.message);
  }
}

export async function archiveClass(id: string): Promise<Class> {
  const response = await fetch(`${API_URL}/classes/${id}/archive`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  
  return handleResponse<Class>(response);
}

export async function unarchiveClass(id: string): Promise<Class> {
  const response = await fetch(`${API_URL}/classes/${id}/unarchive`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  
  return handleResponse<Class>(response);
}

// ===== SUBJECTS API =====
export async function getSubjectsByClass(classId: string): Promise<Subject[]> {
  const response = await fetch(`${API_URL}/subjects/class/${classId}`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  
  return handleResponse<Subject[]>(response);
}

export async function createSubject(data: {
  name: string;
  instructorName?: string;
  instructorEmail?: string;
  firstLessonDate?: string;
  lastLessonDate?: string;
  classId: string;
}): Promise<Subject> {
  const response = await fetch(`${API_URL}/subjects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  return handleResponse<Subject>(response);
}

export async function updateSubject(
  id: string,
  data: {
    name?: string;
    instructorName?: string;
    instructorEmail?: string;
    firstLessonDate?: string;
    lastLessonDate?: string;
  }
): Promise<Subject> {
  const response = await fetch(`${API_URL}/subjects/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  return handleResponse<Subject>(response);
}

export async function deleteSubject(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/subjects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to delete subject' }));
    throw new Error(error.message);
  }
}

export async function register(data: {
  schoolName: string;
  email: string;
  lastname: string;
  firstname: string;
  password: string;
}): Promise<{ access_token: string; user: any }> {
  const response = await fetch(`${API_URL}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  return handleResponse(response);
}