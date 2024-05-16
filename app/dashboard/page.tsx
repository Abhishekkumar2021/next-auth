"use client"

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const {toast} = useToast();
    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "GET",
            });
            const data = await response.json();
            if (data.success) {
                toast({
                    title: "Success",
                    description: data.message,
                });
                router.push("/login");
            }else{
                throw new Error(data.message);
            }
        } catch (error: any) {
            console.log(error.message);
            toast({
                title: "Error",
                description: error.message,
            });
        }
    }

    return (
        <section className="w-full flex h-screen p-2 items-center justify-center">
            <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <p className="text-lg">Welcome to your dashboard</p>
                <Button onClick={handleLogout} className="w-full">
                    Logout
                </Button>
            </div>
        </section>
    );
}