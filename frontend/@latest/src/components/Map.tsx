import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import axios from "axios";

type Vaga = {
  _id: string;
  latitude: number;
  longitude: number;
};

const containerStyle = { width: "100%", height: "80vh" };

export default function MapComponent(): React.ReactElement {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY as string,
  });

  useEffect(() => {
    const base = (import.meta.env.VITE_BACKEND_URL as string) ?? "http://127.0.0.1:8000";
    const url = `${base.replace(/\/$/, "")}/vagas`;
    axios
      .get<Vaga[]>(url)
      .then((res: { data: Vaga[] }) => setVagas(res.data))
      .catch((err: unknown) => console.error("Failed fetching vagas:", err));
  }, []);

  if (!isLoaded) return <p>Carregando mapa...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: -23.5505, lng: -46.6333 }}
      zoom={13}
    >
      {vagas.map((v) => (
        <Marker key={v._id} position={{ lat: v.latitude, lng: v.longitude }} />
      ))}
    </GoogleMap>
  );
}
