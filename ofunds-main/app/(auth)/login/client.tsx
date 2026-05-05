"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowDownLeft, CreditCard, AlertCircle, Loader2 } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/schema/auth";
import { useLogin } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

export default function LoginClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    }
  });

  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data: LoginFormData) => {
    setError(null);
    login({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe || false,
    }, {
      onSuccess: () => {
        // Redirect to dashboard on successful login
        router.push("/dashboard");
      },
      onError: (err: any) => {
        setError(err.message || "Login failed. Please try again.");
      },
    });
  };

  return (
    <div className="w-full flex h-screen">
      {/* Left Column: Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 lg:p-16 h-full overflow-y-auto">
        <div className="w-full max-w-[420px] mx-auto flex flex-col h-full justify-center">
          
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-16">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
              O
            </div>
            <span className="text-xl font-bold">Ofunds</span>
          </div>

          <div className="space-y-2 mb-10">
            <h1 className="text-4xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground text-sm">
              Enter your details to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="font-bold text-xs">Email address</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="hello@example.com"
                    className="pl-11 h-12 bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 rounded-xl"
                    {...register("email")}
                  />
                </div>
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="password" className="font-bold text-xs">Password</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="pl-11 pr-11 h-12 bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 rounded-xl"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </Field>
            </FieldGroup>

            <div className="flex items-center justify-between">
              <Field orientation="horizontal" className="w-auto gap-3">
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  )}
                />
                <FieldLabel htmlFor="rememberMe" className="font-medium text-sm cursor-pointer p-0">
                  Remember me
                </FieldLabel>
              </Field>
              
              <Link href="/forgot-password" className="text-sm font-bold text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm font-medium">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/register" className="text-primary hover:underline">
              Sign up for free
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Visuals */}
      <div className="hidden lg:block lg:w-1/2 p-4 h-full">
        <div className="w-full h-full rounded-[40px] bg-gradient-to-br from-[#ff6b00] to-[#ff8c00] p-16 relative overflow-hidden flex flex-col justify-end text-white">
          
          {/* Abstract floating UI elements mimicking the design */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[180px] bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl -rotate-6 flex flex-col justify-between p-6">
             <div className="flex justify-between items-start opacity-80">
               <CreditCard className="w-8 h-8" />
               <div className="w-6 h-6 rounded-full border border-white/50 flex items-center justify-center">
                 <div className="w-3 h-3 rounded-full bg-white/50" />
               </div>
             </div>
             <div>
               <p className="text-[10px] uppercase tracking-wider opacity-70 mb-1">Available Balance</p>
               <p className="text-3xl font-bold">₦1,250.00</p>
             </div>
          </div>

          <div className="absolute top-[40%] right-[15%] w-[220px] h-[70px] bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl rotate-12 flex items-center px-4 gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8cc63f] flex items-center justify-center text-white shrink-0">
               <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Received</p>
              <p className="text-xs opacity-80">₦50,000</p>
            </div>
          </div>

          <div className="absolute top-[55%] left-[20%] w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl -rotate-12 flex items-center justify-center">
            <div className="text-2xl">✨</div>
          </div>
          
          <div className="absolute top-[45%] right-[40%] w-20 h-20 rounded-full bg-white/5 blur-xl" />

          {/* Copy text */}
          <div className="relative z-10 max-w-md">
            <h2 className="text-5xl font-bold leading-[1.1] mb-6">
              Your money,<br />your rules.
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Join the new generation of smart banking. Fast, secure, and unapologetically bold.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
