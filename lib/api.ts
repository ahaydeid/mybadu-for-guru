const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'https://suites.albadar.cloud/api/v1';
  return url;
};

const API_URL = getApiUrl();

export const api = {
  // Login
  async login(username: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  // Get Profile
  async getProfile(token: string) {
    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    return res.json();
  },

  // Logout
  async logout(token: string) {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    return res.json();
  },

  // Refresh Token
  async refreshToken(token: string) {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    return res.json();
  },

  // Get Announcements
  async getAnnouncements(token: string) {
    const res = await fetch(`${API_URL}/pengumuman`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    return res.json();
  },

  // Get Kaldik (Academic Calendar)
  async getKaldik(token: string) {
    const res = await fetch(`${API_URL}/kaldik`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    return res.json();
  },

  // ========== GURU ATTENDANCE API ==========
  
  // Check-in Attendance (Absen Masuk)
  async checkInAttendance(token: string, data: {
    latitude: number;
    longitude: number;
    photo: string; // base64
    timestamp?: string;
    metode_absen?: string;
  }) {
    console.log("API checkInAttendance - Data to send:", data);
    const res = await fetch(`${API_URL}/guru-attendance/check-in`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const responseData = await res.json();
    console.log("API checkInAttendance - Response:", responseData);
    return responseData;
  },

  // Check-out Attendance (Absen Pulang)
  async checkOutAttendance(token: string, data: {
    timestamp?: string;
  }) {
    const res = await fetch(`${API_URL}/guru-attendance/check-out`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Get Today Attendance Status
  async getTodayAttendance(token: string) {
    const res = await fetch(`${API_URL}/guru-attendance/today`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    return res.json();
  },

  // Get Guru Schedule (Semester Aktif)
  // Pass weekly=true to get full week schedule, otherwise returns today's schedule only
  async getGuruSchedule(token: string, weekly: boolean = false) {
    const url = weekly 
      ? `${API_URL}/guru-schedule?week=true`
      : `${API_URL}/guru-schedule`;
    
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    return res.json();
  },

  async getAttendanceLog(token: string, startDate: string, endDate: string) {
    const res = await fetch(
      `${API_URL}/guru-attendance/log?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      }
    );
    return res.json();
  },

  // Get Guru Schedule Detail
  async getGuruScheduleDetail(token: string, scheduleId: string) {
    const res = await fetch(`${API_URL}/guru-schedule/${scheduleId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    return res.json();
  },

  // Finish Class (Selesaikan Kelas)
  async finishClass(token: string, scheduleId: string, catatan: string) {
    const res = await fetch(`${API_URL}/guru-schedule/${scheduleId}/finish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ catatan, confirm: true }),
    });
    return res.json();
  },

  // Get Student Attendance List
  async getStudentAttendance(token: string, jadwalId: string) {
    const res = await fetch(`${API_URL}/student-attendance/${jadwalId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    return res.json();
  },

  // Save Student Attendance
  async saveStudentAttendance(token: string, jadwalId: string, attendance: Array<{student_id: number, status: string}>) {
    const res = await fetch(`${API_URL}/student-attendance/${jadwalId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ attendance }),
    });
    return res.json();
  },

  // Get Attendance Config (Latitude, Longitude, Radius)
  async getAttendanceConfig(token: string) {
    const url = `${API_URL}/guru-attendance/config`;
    console.log("DEBUG - Fetching config from:", url);
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    console.log("DEBUG - Config response status:", res.status);
    return res.json();
  },

  // Update Password
  async updatePassword(token: string, data: any) {
    const res = await fetch(`${API_URL}/profile/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Update Profile
  async updateProfile(token: string, formData: FormData) {
    const res = await fetch(`${API_URL}/profile/update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        // Content-Type header is not needed for FormData, fetch adds it automatically with boundary
      },
      body: formData,
    });
    return res.json();
  },
};
export const getImageUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  // Ambil host dari API_URL (menghapus /api/v1 di akhir)
  const host = API_URL?.replace('/api/v1', '');
  return `${host}/storage/${path}`;
};
