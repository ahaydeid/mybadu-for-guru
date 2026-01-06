"use client";

import { ReactElement, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AttendanceHeader from "./AttendanceHeader";
import AttendanceList from "./AttendanceList";
import AttendanceButtons from "./AttendanceButtons";
import Toast, { ToastType } from "@/app/(guru)/components/ui/Toast";
import ConfirmDialog from "@/app/(guru)/components/ui/ConfirmDialog";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

interface Student {
  id: number;
  name: string;
  status: "" | "H" | "S" | "I" | "A";
}

export default function AttendanceContent(): ReactElement {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [kelasName, setKelasName] = useState<string>("");

  // Toast State
  const [toast, setToast] = useState<{ open: boolean; message: string; type: ToastType }>({
    open: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 3000);
  };

  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const load = async (): Promise<void> => {
      if (!token || !id) return;
      
      if (!mounted) return;
      setLoading(true);
      setFetchError(null);

      try {
        const res = await api.getStudentAttendance(token, id as string);
        
        if (!mounted) return;
        
        if (res.success && Array.isArray(res.data)) {
          setStudents(res.data);
          
          if (res.data.length > 0) {
            setKelasName(res.kelas_name || "");
          }
        } else {
          setFetchError(res.message || "Gagal memuat data siswa");
        }
      } catch (error) {
        console.error("Failed to fetch student attendance:", error);
        if (mounted) {
          setFetchError("Terjadi kesalahan saat memuat data");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [token, id]);

  /** Scroll highlight */
  useEffect(() => {
    const handleScroll = (): void => {
      if (!listRef.current) return;
      const container = listRef.current;
      const containerCenter = container.scrollTop + container.clientHeight / 2;
      let closestIndex = 0;
      let smallestDistance = Number.POSITIVE_INFINITY;

      Array.from(container.children).forEach((child, index) => {
        const childEl = child as HTMLElement;
        const rectCenter = childEl.offsetTop + childEl.offsetHeight / 2;
        const distance = Math.abs(rectCenter - containerCenter);
        if (distance < smallestDistance) {
          smallestDistance = distance;
          closestIndex = index;
        }
      });

      setCurrentIndex(closestIndex);
    };

    const container = listRef.current;
    if (container) container.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [students]);

  const scrollToStudent = (index: number): void => {
    if (!listRef.current) return;
    const el = listRef.current.children[index] as HTMLElement | undefined;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const updateStatus = (status: Student["status"]): void => {
    if (submitting) return;
    setStudents((prev) => {
      const updated = prev.map((s, i) => (i === currentIndex ? { ...s, status } : s));
      const nextIndex = currentIndex + 1 < updated.length ? currentIndex + 1 : currentIndex;
      window.setTimeout(() => scrollToStudent(nextIndex), 200);
      return updated;
    });
  };

  const handleSubmit = async (): Promise<void> => {
    if (!token || !id) return;
    
    setSubmitting(true);
    
    try {
      const attendance = students.map(s => ({
        student_id: s.id,
        status: s.status
      }));
      
      const res = await api.saveStudentAttendance(token, id as string, attendance);
      
      if (res.success) {
        showToast("Absensi berhasil disimpan", "success");
        setTimeout(() => router.back(), 1500);
      } else {
        showToast(res.message || "Gagal menyimpan absensi", "error");
      }
    } catch (error) {
      console.error("Failed to save attendance:", error);
      showToast("Terjadi kesalahan saat menyimpan absensi", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const allDone = students.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="max-w-md pb-3 bg-white w-full mx-auto">
        <AttendanceHeader total={students.length} filled={students.filter((s) => s.status !== "").length} kelasName={kelasName} />
        <AttendanceList ref={listRef} students={students} loading={loading} fetchError={fetchError} currentIndex={currentIndex} />
        <AttendanceButtons updateStatus={updateStatus} submitting={submitting} allDone={allDone} onSubmit={() => setConfirmOpen(true)} disabled={!allDone || submitting} />
      </main>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => !submitting && setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          handleSubmit();
        }}
        title="Simpan Absen?"
        message="Pastikan semua status kehadiran siswa sudah benar. Lanjutkan menyimpan?"
        loading={submitting}
      />

      <Toast open={toast.open} message={toast.message} type={toast.type} />
    </div>
  );
}
