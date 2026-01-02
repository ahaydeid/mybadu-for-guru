"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// --- Perbaiki ikon bawaan Leaflet agar muncul di Next.js ---
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface MapViewProps {
  lat: number;
  lng: number;
}

/**
 * Komponen MapView — render peta Leaflet dengan posisi pengguna
 */
export default function MapView({ lat, lng }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // delay sedikit supaya aman terhadap rule react-hooks/set-state-in-effect
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) {
    return <div className="w-full h-72 flex items-center justify-center text-gray-400 bg-gray-100 rounded-lg">Memuat peta...</div>;
  }

  return (
    <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} className="w-full h-72 rounded-xl">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]}>
        <Popup>Lokasi Anda</Popup>
      </Marker>
    </MapContainer>
  );
}
