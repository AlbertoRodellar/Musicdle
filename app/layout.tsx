import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Musicdle – Adivina la canción",
    description:
        "Juego tipo Musicdle: busca un artista, escucha fragmentos de sus canciones y trata de adivinarlas en el menor tiempo y con el menor número de intentos posible.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <h1 className="text-3xl font-bold mb-6">Adivina la canción</h1>
                {children}
            </body>
        </html>
    );
}
