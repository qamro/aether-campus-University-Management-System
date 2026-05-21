import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { AuthShell, FloatingField, inputCls } from "@/components/auth/AuthShell";
import { loginSchema, type LoginInput } from "@/lib/auth/schemas";
import { useAuth } from "@/lib/auth/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AetherCampus" },
      { name: "description", content: "Sign in to your AetherCampus console." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);
  const [showPw, setShowPw] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  async function onSubmit(values: LoginInput) {
    try {
      const user = await login(values.email, values.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}.`);
      navigate({ to: "/dashboard" });
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <AuthShell
      eyebrow="Console access"
      title={<>Sign in to <span className="text-gradient">AetherCampus</span></>}
      subtitle="Continue orchestrating your campus with Aether Intelligence."
      footer={
        <>
          New to AetherCampus?{" "}
          <Link to="/signup" className="text-foreground hover:text-cyan transition-colors font-medium">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FloatingField label="Email" error={errors.email?.message}>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              autoComplete="email"
              placeholder="helena@university.edu"
              className={`${inputCls} pl-10`}
              {...register("email")}
            />
          </div>
        </FloatingField>

        <FloatingField label="Password" error={errors.password?.message}>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`${inputCls} pr-11`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              aria-label="Toggle password visibility"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FloatingField>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
            <input type="checkbox" className="rounded border-white/20 bg-white/[0.04] accent-primary" />
            Remember me
          </label>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Forgot password?</a>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Authenticating…
            </>
          ) : (
            <>
              Sign in <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-muted-foreground text-center">
          By signing in you agree to our terms. Hint: any email + 8+ char password works.
        </p>
      </form>
    </AuthShell>
  );
}
