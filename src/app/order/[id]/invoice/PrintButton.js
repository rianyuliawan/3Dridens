"use client";

export default function PrintButton() {
  return (
    <button className="primary-button no-print" onClick={() => window.print()} type="button">
      Cetak / Simpan sebagai PDF
    </button>
  );
}
