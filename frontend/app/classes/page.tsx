import Link from 'next/link';
import { getClasses } from '@/lib/api';

export default async function ClassesPage() {
  const classes = await getClasses();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Classes</h1>
            <p className="text-gray-600">Gérez vos cours et étudiants</p>
          </div>
          <Link 
            href="/classes/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
          >
            + Nouvelle Classe
          </Link>
        </div>

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <p className="text-gray-500 text-lg mb-4">Aucune classe pour le moment</p>
            <Link 
              href="/classes/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Créer votre première classe
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <div key={cls.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                <h2 className="text-2xl font-bold mb-2">{cls.name}</h2>
                {cls.description && (
                  <p className="text-gray-600 mb-4">{cls.description}</p>
                )}
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <p>👨‍🏫 {cls.teacher.name}</p>
                  <p>👥 {cls.enrollments.length} étudiant(s)</p>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Link
                    href={`/classes/${cls.id}/edit`}
                    className="flex-1 text-center bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition"
                  >
                    Modifier
                  </Link>
                  <button
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Link */}
        <Link 
          href="/"
          className="inline-block mt-8 text-blue-600 hover:underline"
        >
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}