"use client";

import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessModal({ open, message, onClose }: SuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded p-6 w-[85%] max-w-xs text-center shadow-lg animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
        <h2 className="text-lg mb-1">{message}</h2>

        <button onClick={onClose} className="mt-3 bg-green-600 text-white px-4 py-2 rounded-sm w-full font-semibold">
          OK
        </button>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
