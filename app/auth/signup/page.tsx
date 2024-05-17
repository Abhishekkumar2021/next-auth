"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Loader } from "lucide-react"

const formSchema = z.object({
  username: z.string().min(6, {
    message: "Username must be at least 6 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    try {
      setLoading(true)
      // Send the form data to the server.
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      console.log(data)
      if(data.success) {
        toast({
          title: "Success",
          description: data.message,
        })
        router.push("/auth/login")
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  // 3. Render the form.
  return (
    <section className="w-full flex h-screen p-2 items-center justify-center">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center gap-8 border-2 border-secondary p-10 rounded-lg ">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormDescription>
                We&apos;ll never share your email with anyone else.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
        <Separator />
        <Link href="/auth/login">
          <Button variant="link">Already have an account? Log in</Button>
        </Link>

        {
          loading ? (
            <Button variant="default" type="submit" disabled className="flex items-center justify-center gap-2">
              <Loader className="animate-spin" /> Please wait...
            </Button>
          ) : (
            <Button variant="default" type="submit">
              Sign up
            </Button>
          )
        }
      </form>
    </Form>
    </section>
  )
}
