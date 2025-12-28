import ClassForm from '@/components/ClassForm';

export default function NewClassPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>
        Create New Class
      </h1>
      <ClassForm />
    </div>
  );
}