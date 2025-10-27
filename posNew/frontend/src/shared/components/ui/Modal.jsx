import React, { useEffect } from 'react';
import Button from './Button';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary'
}) => {
    // Close modal on ESC key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="modal-backdrop fixed inset-0 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="modal-box relative z-10 w-full max-w-2xl my-8 shadow-xl max-h-[90vh] flex flex-col">
                {/* Header */}
                {title && (
                    <div className="px-6 py-4 border-b border-base-300 flex-shrink-0">
                        <h3 className="text-lg font-semibold text-base-content">{title}</h3>
                    </div>
                )}

                {/* Content - Scrollable */}
                <div className="px-6 py-4 overflow-y-auto flex-1">
                    {children}
                </div>

                {/* Footer */}
                {onConfirm && (
                    <div className="px-6 py-4 border-t border-base-300 flex justify-end gap-3 flex-shrink-0">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            variant={variant}
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
