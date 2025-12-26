import React from "react";
import { FiX, FiArrowUpRight } from "react-icons/fi";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function BaseModal({
  isOpen,
  onClose,
  children,
  title,
}: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/20 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-10">{children}</div>
      </div>
    </div>
  );
}

interface ClassFormData {
  name: string;
  students: string;
  emails: string;
  description: string;
}

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClassFormData) => void;
  isLimitReached?: boolean; // If true, shows limit modal instead? Or handled by parent?
  // Actually, standard add modal
}

export function AddClassModal({
  isOpen,
  onClose,
  onSubmit,
}: AddClassModalProps) {
  const [formData, setFormData] = React.useState<ClassFormData>({
    name: "",
    students: "",
    emails: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Ajouter une classe
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de la classe
          </label>
          <input
            type="text"
            placeholder="Entrez le nom de la classe"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-yellow focus:ring-1 focus:ring-primary-yellow outline-none transition-all placeholder:text-gray-300"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre d'étudiants
          </label>
          <input
            type="text"
            placeholder="Entrez le nombre d'étudiants"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-yellow focus:ring-1 focus:ring-primary-yellow outline-none transition-all placeholder:text-gray-300"
            value={formData.students}
            onChange={(e) =>
              setFormData({ ...formData, students: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse mail des étudiants
          </label>
          <textarea
            placeholder="Entrez les adresses mails étudiants séparées par un point virgule (;)"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-yellow focus:ring-1 focus:ring-primary-yellow outline-none transition-all min-h-[100px] resize-none placeholder:text-gray-300"
            value={formData.emails}
            onChange={(e) =>
              setFormData({ ...formData, emails: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (facultatif)
          </label>
          <input
            type="text"
            placeholder="Entrez une description (spé, rythme...)"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-yellow focus:ring-1 focus:ring-primary-yellow outline-none transition-all placeholder:text-gray-300"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <button
          type="button"
          className="w-full sm:w-auto bg-primary-yellow hover:bg-yellow-400 text-gray-900 font-medium px-8 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mt-8"
        >
          Créer la classe <FiArrowUpRight className="w-5 h-5" />
        </button>
      </form>
    </BaseModal>
  );
}

interface EditClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClassFormData) => void;
  initialData: ClassFormData;
}

export function EditClassModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EditClassModalProps) {
  const [formData, setFormData] = React.useState<ClassFormData>(initialData);

  // Update effect if initialData changes while open
  React.useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Modifier la classe
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de la classe
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-yellow focus:ring-1 focus:ring-primary-yellow outline-none transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre d'étudiants
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-yellow focus:ring-1 focus:ring-primary-yellow outline-none transition-all"
            value={formData.students}
            onChange={(e) =>
              setFormData({ ...formData, students: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse mail des étudiants
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-yellow focus:ring-1 focus:ring-primary-yellow outline-none transition-all min-h-[120px] resize-none"
            value={formData.emails}
            onChange={(e) =>
              setFormData({ ...formData, emails: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (facultatif)
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-yellow focus:ring-1 focus:ring-primary-yellow outline-none transition-all"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-primary-yellow hover:bg-yellow-400 text-gray-900 font-medium px-8 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mt-8"
        >
          Modifier la classe <FiArrowUpRight className="w-5 h-5" />
        </button>
      </form>
    </BaseModal>
  );
}

interface ArchiveClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ArchiveClassModal({
  isOpen,
  onClose,
  onConfirm,
}: ArchiveClassModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Archiver cette classe ?
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Cette classe ne sera plus modifiable, ni restaurable, mais restera
        consultable à tout moment dans vos classes archivées.
      </p>

      <div className="flex flex-row items-center gap-4">
        <button
          onClick={onConfirm}
          className="bg-primary-yellow hover:bg-yellow-400 text-gray-900 font-medium px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          Archiver <FiArrowUpRight className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900 font-medium px-4 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          Annuler <FiArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </BaseModal>
  );
}

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean; // Controls which version to show
}

export function LimitReachedModal({
  isOpen,
  onClose,
  isAdmin = true,
}: LimitReachedModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      {isAdmin ? (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Limite de classes atteinte
          </h2>
          <div className="text-gray-600 space-y-4 mb-8">
            <p>
              Vous avez atteint le nombre maximum de classes inclus dans votre
              offre actuelle.
            </p>
            <p>
              Pour créer de nouvelles classes et continuer à utiliser Izzzi sans
              limite, vous pouvez passer à un plan supérieur.
            </p>
          </div>

          <div className="flex flex-row items-center gap-4">
            <button
              onClick={() => {
                // Handle plan upgrade redirect
                console.log("Redirect to upgrade");
              }}
              className="bg-primary-yellow hover:bg-yellow-400 text-gray-900 font-medium px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              Passer au plan supérieur <FiArrowUpRight className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 font-medium px-4 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              Annuler <FiArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Impossible d'ajouter une nouvelle classe
          </h2>
          <div className="text-gray-600 space-y-4 mb-8">
            <p>
              Le nombre maximum de classes autorisées a été atteint pour votre
              établissement.
            </p>
            <p>
              Pour ajouter une nouvelle classe, nous vous invitons à contacter
              l'administrateur de votre compte.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-medium px-0 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            Fermer <FiArrowUpRight className="w-4 h-4" />
          </button>
        </>
      )}
    </BaseModal>
  );
}
