"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ForgotPasswordPage(){
    const {toast} = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const emailRef = useRef<HTMLInputElement>(null);
    async function sendResetPasswordEmail(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        const email = emailRef.current?.value;
        try {
            setLoading(true);
            const res = await fetch("/api/auth/send-reset-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email}),
            });
            const data = await res.json();
            if(data.success){
                toast({
                    title: "Success",
                    description: data.message,
                });
            } else {
                throw new Error(data.message);
            }
        } catch (error: any) {
            setError(error.message);
            toast({
                title: "Error",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="w-full flex h-screen p-2 items-center justify-center">
            <div className="w-full max-w-md p-4 rounded border-2 border-muted flex flex-col gap-6">
                <h1 className="text-4xl font-bold">Forgot Password</h1>
                <p className="text-lg"> Please enter your email to receive a reset password link</p>
                <form className="flex flex-col gap-4" onSubmit={sendResetPasswordEmail}>
                    <Input ref={emailRef} id="email" type="email" placeholder="Enter your email" required/>
                   {
                     loading ? (
                        <Button disabled className="w-full flex items-center justify-center gap-2">
                            <Loader className="animate-spin" size={24} /> Sending Email...
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full flex items-center justify-center gap-2">
                            <Send size={24} /> Send Reset Email
                        </Button>
                    )
                   }
                </form>
            </div>
        </section>
    )
}