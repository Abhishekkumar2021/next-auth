"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Home() {
  const {setTheme} = useTheme();
  const {toast} = useToast();
  return (
    <main className="h-screen w-full">
      <h1 className="text-4xl text-center p-4">Next.js Auth</h1>
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={() => {
          setTheme("dark");
          toast({
            title: "Theme Changed",
            description: "Dark mode enabled.",
          });
        }
        }>Dark Mode</Button>
        <Button variant="outline" onClick={() => {
          setTheme("light");
          toast({
            title: "Theme Changed",
            description: "Light mode enabled.",
            type: "foreground",
          });
        }
        }>Light Mode</Button>
        <Button variant="outline" onClick={() => {
          setTheme("system");
          toast({
            title: "Theme Changed",
            description: "System mode enabled.",
            type: "foreground",
          });
        }
        }>System Mode</Button>
      </div>
      <Link href="/auth/login">
        <Button variant="link">Login Page</Button>
      </Link>
      <Link href="/auth/signup">
        <Button variant="link">Signup Page</Button>
      </Link>
      <Link href="/user/profile">
        <Button variant="link">Profile Page</Button>
      </Link>
    </main>
  );
}
