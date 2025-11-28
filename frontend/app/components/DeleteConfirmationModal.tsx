interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
  confirmButtonText?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
  isDeleting = false,
  confirmButtonText = "Delete",
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-2xl shadow-lift max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-text mb-4">{title}</h2>

        <p className="text-muted mb-2">{message}</p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
          <p className="text-sm font-medium text-red-900">
            {itemName}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 border border-line text-text rounded-lg font-medium hover:bg-bg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
