import LogoutButton from "@/components/LogoutButton";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Patron habitual en Next.js: server component obtiene los datos y delega la interactividad a pequeños client components
// Este componente se renderiza en el servidor, no puede tener onClick ni hooks
// Pero puede importat Client Components como el LogoutButton
export default async function UserPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    console.log("user:", user);
    console.log("profile:", profile);

    return (
        <div className="flex items-center justify-center bg-background">
            <div className="w-full max-w-sm space-y-6 p-8 rounded-2xl border border-border bg-card shadow-lg">
                <div className="space-y-1 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">
                        🎵 Tu perfil
                    </h1>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium">{user.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Nickname</span>
                        <span className="font-medium">
                            {profile?.nickname ?? "—"}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Miembro desde
                        </span>
                        <span className="font-medium">
                            {new Date(user.created_at).toLocaleDateString(
                                "es-ES",
                            )}
                        </span>
                    </div>
                </div>
                <LogoutButton />
            </div>
        </div>
    );
}
