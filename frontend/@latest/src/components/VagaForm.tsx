import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

type FormState = {
  title: string;
  latitude: string;
  longitude: string;
};

export default function VagaForm(): React.ReactElement {
  const [form, setForm] = useState<FormState>({
    title: "",
    latitude: "",
    longitude: "",
  });

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const base = (import.meta.env.VITE_BACKEND_URL as string) ?? "http://127.0.0.1:8000";
    const url = `${base.replace(/\/$/, "")}/vagas`;
    try {
      await axios.post(url, {
        title: form.title,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      });
      setForm({ title: "", latitude: "", longitude: "" });
      alert("Vaga criada");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar vaga");
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Título</label>
        <input name="title" value={form.title} onChange={onChange} />
      </div>
      <div>
        <label>Latitude</label>
        <input name="latitude" value={form.latitude} onChange={onChange} />
      </div>
      <div>
        <label>Longitude</label>
        <input name="longitude" value={form.longitude} onChange={onChange} />
      </div>
      <button type="submit">Criar vaga</button>
    </form>
  );
}
