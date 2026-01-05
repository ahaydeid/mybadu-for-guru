const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  // ========== GURU ATTENDANCE API ==========
  
  // Check-in Attendance (Absen Masuk)
  async checkInAttendance(token: string, data: {
    latitude: number;
    longitude: number;
    photo: string; // base64
    timestamp?: string;
    metode_absen?: string;
  }) {
    console.log("🔵 API checkInAttendance - Data to send:", data);
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
    console.log("🔵 API checkInAttendance - Response:", responseData);
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
  async getGuruSchedule(token: string) {
    const res = await fetch(`${API_URL}/guru-schedule`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    return res.json();
  },

  // Get Attendance Config (Latitude, Longitude, Radius)
  async getAttendanceConfig(token: string) {
    const res = await fetch(`${API_URL}/guru-attendance/config`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
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
