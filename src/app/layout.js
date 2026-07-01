import "./globals.css";

export const metadata = {
  title: "3Dridens | Jasa 3D Printing Custom",
  description:
    "Jasa 3D printing custom untuk prototype, spare part, miniatur, display, panduan material, dan finishing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
