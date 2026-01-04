'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClass, updateClass, type Class } from '@/lib/api';

interface ClassFormProps {
  initialData?: Class;
  isEdit?: boolean;
}

export default function ClassForm({ initialData, isEdit = false }: ClassFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [teacherId, setTeacherId] = useState(initialData?.teacherId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && initialData) {
        // Update existing class
        await updateClass(initialData.id, { name, description });
        alert('Class updated successfully!');
      } else {
        // Create new class
        if (!teacherId) {
          alert('Please enter a teacher ID');
          setLoading(false);
          return;
        }
        await createClass({ name, description, teacherId });
        alert('Class created successfully!');
      }
      
      router.push('/classes');
      router.refresh();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEdit ? 'update' : 'create'} class`;
      setError(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#991b1b',
          fontSize: '14px',
        }}>
          <strong>Erreur :</strong> {error}
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Class Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '16px',
          }}
          placeholder="e.g., Mathematics 101"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '16px',
          }}
          placeholder="Enter class description..."
        />
      </div>

      {!isEdit && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Teacher ID *
          </label>
          <input
            type="text"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '16px',
            }}
            placeholder="378e5c7d-8235-4b61-b5e4-76cfeca11a3e"
          />
          <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
            Use: 378e5c7d-8235-4b61-b5e4-76cfeca11a3e (John Doe)
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Saving...' : isEdit ? 'Update Class' : 'Create Class'}
        </button>
        
        <button
          type="button"
          onClick={() => router.push('/classes')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}