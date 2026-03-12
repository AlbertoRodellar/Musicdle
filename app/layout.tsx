import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { UserRound } from "lucide-react";

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
                <header className="border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
                        <Link
                            href="/"
                            className="text-lg font-bold tracking-tight"
                        >
                            🎵 Musicdle
                        </Link>
                        <Link
                            href="/user"
                            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <UserRound size={20} />
                        </Link>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                    {children}
                </main>

                <Toaster richColors closeButton />
            </body>
        </html>
    );
}
