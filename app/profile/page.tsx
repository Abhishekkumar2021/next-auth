"use client";
import { Loader } from "lucide-react";
import useSWR from "swr";

export default function ProfilePage() {
  const { data, error, isLoading } = useSWR("/api/users/me", async (url) => {
    const res = await fetch(url, {
      method: "GET",
    });
    return res.json();
  });

  if(isLoading) return <section className="w-full flex flex-col h-screen p-2 items-center justify-center"><Loader size={64} className="animate-spin" /></section>

  if(error) return <section className="w-full flex h-screen p-2 items-center justify-center"><p className="text-red-500 text-lg">{error.message}</p></section>
  
  const {user} = data.data;

  return (
    <section className="w-full flex h-screen p-2 items-center justify-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Profile</h1>
        <p className="text-lg">Welcome to your profile</p>
        <h2 className="text-2xl">User Details</h2>
        <div>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>
      </div>
    </section>
  );
}
