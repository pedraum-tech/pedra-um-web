import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/src/components/Footer";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PedraUm - Conectando Mineração",
  description: "Plataforma de matchmaking para o setor de agregados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {/* O Header você coloca página por página ou aqui se quiser fixo */}

        {children} {/* Aqui entra o conteúdo da Home, Login, etc */}

        <Footer /> {/* <--- Adicione aqui. Ele vai aparecer no fundo de TODAS as telas */}
      </body>
    </html>
  );
}