import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/src/components/Footer";
import { AuthProvider } from "@/src/contexts/AuthContext";

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

        {/* 2. O Provider abraça TUDO o que vai aparecer na tela */}
        <AuthProvider>

          {children} {/* Aqui entra o conteúdo da Home, Login, etc */}
          <Footer /> {/* O Footer protegido junto com a aplicação */}

        </AuthProvider>

      </body>
    </html>
  );
}