'use client';

export default function SubjectRow({ subject }: any) {
  return (
    <div className="p-4 border rounded">
      <h3>{subject?.name || 'Subject'}</h3>
    </div>
  );
}