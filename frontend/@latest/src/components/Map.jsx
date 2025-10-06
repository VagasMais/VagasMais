import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import axios from "axios";

const containerStyle = { width: "100%", height: "80vh" };

export default function Map() {
  const [vagas, setVagas] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/vagas").then(res => setVagas(res.data));
  }, []);

  if (!isLoaded) return <p>Carregando mapa...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: -23.5505, lng: -46.6333 }}
      zoom={13}
    >
      {vagas.map(v => (
        <Marker key={v._id} position={{ lat: v.latitude, lng: v.longitude }} />
      ))}
    </GoogleMap>
  );
}
