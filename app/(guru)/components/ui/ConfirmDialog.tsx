import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";

type Props = {
    open: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    variant?: "primary" | "danger" | "warning";
    onConfirm: () => void;
    onClose: () => void;
};

export default function ConfirmDialog({
    open,
    title = "Konfirmasi",
    message,
    confirmText = "Ya, Lanjutkan",
    cancelText = "Batal",
    loading = false,
    variant = "primary", // Default to Primary (Blue/Sky)
    onConfirm,
    onClose,
}: Props) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative w-full max-w-md rounded-2xl bg-white px-6 pb-6 pt-14 shadow-xl"
                        initial={{ scale: 0.9, y: 30, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 22,
                        }}
                    >
                        {/* ICON FLOAT */}
                        <motion.div
                            className={`absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full text-white shadow-lg ${
                                variant === "danger" ? "bg-red-500" : 
                                variant === "warning" ? "bg-amber-500" : "bg-sky-500"
                            }`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                y: [0, -6, 0],
                            }}
                            transition={{
                                y: {
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "easeInOut",
                                },
                                scale: { duration: 0.3 },
                            }}
                        >
                            <HelpCircle className="h-7 w-7" />
                        </motion.div>

                        <h2 className="text-center text-lg font-semibold text-gray-800">
                            {title}
                        </h2>

                        <p className="mt-2 text-center text-sm text-gray-600">
                            {message}
                        </p>

                        <div className="mt-6 flex justify-center gap-3">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                            >
                                {cancelText}
                            </button>

                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className={`rounded-lg cursor-pointer px-4 py-2 text-sm text-white disabled:opacity-60 transition-colors ${
                                    variant === "danger"
                                        ? "bg-rose-600 hover:bg-rose-700"
                                        : variant === "warning"
                                        ? "bg-amber-600 hover:bg-amber-700"
                                        : "bg-sky-600 hover:bg-sky-700"
                                }`}
                            >
                                {loading ? "Memproses..." : confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
