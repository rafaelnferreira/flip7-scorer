interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <section className="card game-over-card">
        <h2 id="confirm-title">{title}</h2>
        <p className="winner-message">{message}</p>
        <div className="game-over-actions">
          <button type="button" className="btn btn-primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
