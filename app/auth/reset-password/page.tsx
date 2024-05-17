"use client";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader } from "lucide-react";

const formSchema = z.object({
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function ResetPasswordPage() {
  // Grab token from search params
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (values.newPassword !== values.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          password: values.newPassword,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        });
        router.push("/auth/login");
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-center gap-8 border-2 border-secondary p-10 rounded-lg"
        >
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="flex relative">
                    {showPassword ? (
                      <Input
                        placeholder="Enter your password"
                        {...field}
                        type="text"
                      />
                    ) : (
                      <Input
                        placeholder="Enter your password"
                        {...field}
                        type="password"
                      />
                    )}

                    <Button
                      variant="link"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0"
                      type="button"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  Password must be at least 8 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="flex relative">
                    {showConfirmPassword ? (
                      <Input
                        placeholder="Confirm your password"
                        {...field}
                        type="text"
                      />
                    ) : (
                      <Input
                        placeholder="Confirm your password"
                        {...field}
                        type="password"
                      />
                    )}

                    <Button
                      variant="link"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-0"
                      type="button"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  Password must be at least 8 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {loading ? (
            <Button
              variant="default"
              disabled
              className="flex items-center justify-center gap-2"
            >
              <Loader className="animate-spin" />
              Resetting password...
            </Button>
          ) : (
            <Button type="submit" variant="default">
              Reset Password
            </Button>
          )}
        </form>
      </Form>
    </section>
  );
}
