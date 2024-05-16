"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader, Send, Verified } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Verify() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  const otpRef = useRef<HTMLInputElement>(null);

  const sendVerificationEmail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/send-verification-email", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Email sent",
          description: data.message,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // Send a request to the server to send the verification email
    sendVerificationEmail();
  }, [sendVerificationEmail]);

    // Verify OTP
    const verifyEmail = async (e: any) => {
      e.preventDefault();
      setDisabled(true);
  
      try {
        const otp = otpRef.current?.value;
  
        if (!otp) {
          throw new Error("OTP is required");
        }
  
        if(otp.length !== 6) {
          throw new Error("OTP should be of 6 characters");
        }
  
        const res = await fetch("/api/auth/check-verification-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp }),
        });
  
        const data = await res.json();
  
        if (data.success) {
          toast({
            title: "Email verified",
            description: data.message,
          });
  
          router.push("/dashboard");
        } else {
          throw new Error(data.message);
        }
      } catch (error: any) {
        toast({
          title: "Failed to verify email",
          description: error.message,
        });
        setError(error.message);
      } finally {
        setDisabled(false);
      }
    };

  if (loading) {
    return (
      <section className="flex items-center justify-center h-screen">
        <p className="text-lg flex items-center gap-2">
          {" "}
          <Loader size={64} className="animate-spin" /> Sending verification
          email...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex items-center justify-center h-screen flex-col gap-4">
        <p className="text-4xl text-red-500">
          Error occurred: {error}
        </p>
        <Link href="/">
          <Button variant="outline" className="mt-4">
            Go back to home
          </Button>
        </Link>
      </section>
    );
  }



  return (
    <section className="flex flex-col items-center justify-center h-screen p-8">
      <form className="flex flex-col gap-4 sm:w-full md:w-2/3  lg:w-1/2 xl:w-1/3 border-2 border-muted rounded-lg p-8" onSubmit={verifyEmail}>
        <h1 className="text-2xl font-semibold mb-4">Verify your email</h1>
        <p className="mb-4">
          A verification email has been sent to your email address. Please check
          your inbox and get your OTP
        </p>
        <p className="mb-4">
          If you haven&apos;t received the email, you can click on the button
          below to resend the email.
        </p>
        <Button
          onClick={() => sendVerificationEmail()}
          variant="default"
          type="button"
          className="flex items-center gap-2"
        >
          {" "}
          <Send size={16} /> Resend email
        </Button>
        <Input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          className="mt-4"
          ref={otpRef}
          required
          minLength={6}
          maxLength={6}
        />
        {disabled ? (
          <Button
            variant="default"
            type="submit"
            disabled
            className="flex items-center gap-2"
          >
            <Loader size={16} className="animate-spin" /> Verifying email...
          </Button>
        ) : (
          <Button
            variant="default"
            type="submit"
            className="flex items-center gap-2"
          >
            <Verified size={16} /> Verify email
          </Button>
        )}
      </form>
    </section>
  );
}
