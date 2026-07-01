"use client";

import { useMemo, useState } from "react";

const WHATSAPP_NUMBER = "6285691555890";

const initialForm = {
  name: "",
  packageName: "Paket Cetak Prototype",
  material: "PLA",
  quantity: "1",
  deadline: "",
  notes: "",
};

export default function OrderForm() {
  const [form, setForm] = useState(initialForm);

  const message = useMemo(() => {
    return [
      "Halo 3Dridens, saya mau pesan jasa 3D printing.",
      `Nama: ${form.name || "-"}`,
      `Kebutuhan: ${form.packageName}`,
      `Material: ${form.material}`,
      `Jumlah: ${form.quantity || "-"}`,
      `Deadline: ${form.deadline || "-"}`,
      `Catatan: ${form.notes || "-"}`,
    ].join("\n");
  }, [form]);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <form className="order-form" action={whatsappUrl} target="_blank">
      <div className="form-grid">
        <label>
          <span>Nama</span>
          <input
            name="name"
            onChange={updateField}
            placeholder="Nama kamu"
            type="text"
            value={form.name}
          />
        </label>
        <label>
          <span>Kebutuhan</span>
          <select
            name="packageName"
            onChange={updateField}
            value={form.packageName}
          >
            <option>Paket Cetak Prototype</option>
            <option>Paket Mini Production</option>
            <option>Paket Finishing Display</option>
            <option>Konsultasi material dan desain</option>
          </select>
        </label>
        <label>
          <span>Material</span>
          <select name="material" onChange={updateField} value={form.material}>
            <option>PLA</option>
            <option>PETG</option>
            <option>ABS</option>
            <option>TPU</option>
            <option>Belum tahu, minta rekomendasi</option>
          </select>
        </label>
        <label>
          <span>Jumlah</span>
          <input
            min="1"
            name="quantity"
            onChange={updateField}
            type="number"
            value={form.quantity}
          />
        </label>
        <label>
          <span>Deadline</span>
          <input
            name="deadline"
            onChange={updateField}
            placeholder="Contoh: 10 Juli"
            type="text"
            value={form.deadline}
          />
        </label>
      </div>
      <label>
        <span>Catatan project</span>
        <textarea
          name="notes"
          onChange={updateField}
          placeholder="Ukuran, warna, fungsi part, link file STL/STEP, atau referensi finishing."
          rows="5"
          value={form.notes}
        />
      </label>
      <div className="form-actions">
        <a className="ghost-button" href={whatsappUrl} target="_blank">
          Preview WhatsApp
        </a>
        <button type="submit">Kirim Order ke WhatsApp</button>
      </div>
    </form>
  );
}
