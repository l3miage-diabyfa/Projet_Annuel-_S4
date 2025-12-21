import { getClass } from '@/lib/api';
import ClassForm from '@/components/ClassForm';

export default async function EditClassPage({ params }: { params: { id: string } }) {
  const classData = await getClass(params.id);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>
        Edit Class
      </h1>
      <ClassForm initialData={classData} isEdit={true} />
    </div>
  );
}