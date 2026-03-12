"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    async function handleSubmit() {
        setLoading(true);
        setError("");

        if (isSignUp) {
            // Crear cuenta
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }

            // Insertar perfil con nickname
            if (data.user) {
                console.log('data.user:', data.user)
                const { error: profileError } = await supabase
                    .from("profiles")
                    .insert({
                        id: data.user.id,
                        nickname,
                    });
                console.log("profile error:", profileError);
                console.log("profile data.user:", data.user);
            }
        } else {
            // Iniciar sesión
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }
        }

        router.push("/user");
        router.refresh();
        setLoading(false);
    }

    return (
        <div className="flex items-center justify-center bg-background">
            <div className="w-full max-w-sm space-y-6 p-8 rounded-2xl border border-border bg-card shadow-lg">
                {/* Header */}
                <div className="space-y-1 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">
                        🎵 Musicdle
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isSignUp
                            ? "Crea tu cuenta para guardar tus scores"
                            : "Bienvenido de vuelta"}
                    </p>
                </div>

                {/* Inputs */}
                <div className="space-y-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />

                    {isSignUp && (
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="Nickname"
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    )}
                </div>

                {/* Error */}
                {error && (
                    <p className="text-sm text-destructive text-center">
                        {error}
                    </p>
                )}

                {/* Botón principal */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading
                        ? "Cargando..."
                        : isSignUp
                          ? "Crear cuenta"
                          : "Entrar"}
                </button>

                {/* Toggle signup/login */}
                <p className="text-center text-sm text-muted-foreground">
                    {isSignUp ? "¿Ya tienes cuenta? " : "¿Sin cuenta? "}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-primary underline-offset-4 hover:underline"
                    >
                        {isSignUp ? "Inicia sesión" : "Regístrate"}
                    </button>
                </p>
            </div>
        </div>
    );
}
