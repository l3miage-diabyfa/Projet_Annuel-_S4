'use client';

import { useRouter } from 'next/navigation';
import { deleteClass, type Class } from '@/lib/api';

export default function ClassList({ classes }: { classes: Class[] }) {
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await deleteClass(id);
      alert('Class deleted successfully!');
      router.refresh(); // Refresh the page to show updated list
    } catch (error) {
      alert('Failed to delete class');
      console.error(error);
    }
  };

  if (classes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No classes yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {classes.map((classItem) => (
        <div
          key={classItem.id}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: 'white',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                {classItem.name}
              </h2>
              {classItem.description && (
                <p style={{ color: '#666', marginBottom: '12px' }}>
                  {classItem.description}
                </p>
              )}
              <p style={{ fontSize: '14px', color: '#888' }}>
                <strong>Teacher:</strong> {classItem.teacher.firstname} {classItem.teacher.lastname}
              </p>
              <p style={{ fontSize: '14px', color: '#888' }}>
                <strong>Students:</strong> {classItem.enrollments.length}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => router.push(`/classes/${classItem.id}/edit`)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(classItem.id, classItem.name)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>

          {classItem.enrollments.length > 0 && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
              <strong style={{ fontSize: '14px' }}>Enrolled Students:</strong>
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                {classItem.enrollments.map((enrollment) => (
                  <li key={enrollment.id} style={{ fontSize: '14px', color: '#666' }}>
                    {enrollment.student.firstname} {enrollment.student.lastname} ({enrollment.student.email})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}