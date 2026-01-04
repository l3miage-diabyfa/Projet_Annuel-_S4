'use client';

export default function SelectFormModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded">
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}