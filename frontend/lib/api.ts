const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Student {
  id: string;
  name: string;
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
  teacherId: string;
  teacher: Teacher;
  enrollments: Enrollment[];
  createdAt: string;
  updatedAt: string;
}

// GET all classes
export async function getClasses(): Promise<Class[]> {
  const response = await fetch(`${API_URL}/classes`, {
    cache: 'no-store', // Always get fresh data
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch classes');
  }
  
  return response.json();
}

// GET one class
export async function getClass(id: string): Promise<Class> {
  const response = await fetch(`${API_URL}/classes/${id}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch class');
  }
  
  return response.json();
}

// POST create class
export async function createClass(data: {
  name: string;
  description?: string;
  teacherId: string;
}): Promise<Class> {
  const response = await fetch(`${API_URL}/classes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create class');
  }
  
  return response.json();
}

// PATCH update class
export async function updateClass(
  id: string,
  data: {
    name?: string;
    description?: string;
  }
): Promise<Class> {
  const response = await fetch(`${API_URL}/classes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update class');
  }
  
  return response.json();
}

// DELETE class
export async function deleteClass(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/classes/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete class');
  }
}