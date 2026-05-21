import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Building2, Eye, EyeOff, Loader2, Mail, User } from "lucide-react";
import { AuthShell, FloatingField, inputCls } from "@/components/auth/AuthShell";
import { passwordStrength, signupSchema, type SignupInput } from "@/lib/auth/schemas";
import { useAuth } from "@/lib/auth/store";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — AetherCampus" },
      { name: "description", content: "Provision your institution on AetherCampus." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const signup = useAuth((s) => s.signup);
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", institution: "", password: "", confirm: "", accept: false },
    mode: "onBlur",
  });

  const pw = watch("password") || "";
  const strength = passwordStrength(pw);

  async function onSubmit(values: SignupInput) {
    try {
      const user = await signup({ name: values.name, email: values.email, password: values.password, institution: values.institution });
      toast.success(`Account created. Welcome, ${user.name.split(" ")[0]}.`);
      navigate({ to: "/dashboard" });
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <AuthShell
      eyebrow="Provision institution"
      title={<>Create your <span className="text-gradient">AetherCampus</span> account</>}
      subtitle="Bring AI-native operations to your university in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-foreground hover:text-cyan transition-colors font-medium">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FloatingField label="Full name" error={errors.name?.message}>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input className={`${inputCls} pl-10`} placeholder="Helena Voss" {...register("name")} />
            </div>
          </FloatingField>
          <FloatingField label="Institution" error={errors.institution?.message}>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input className={`${inputCls} pl-10`} placeholder="Aether University" {...register("institution")} />
            </div>
          </FloatingField>
        </div>

        <FloatingField label="Email" error={errors.email?.message}>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="email" className={`${inputCls} pl-10`} placeholder="you@university.edu" {...register("email")} />
          </div>
        </FloatingField>

        <FloatingField label="Password" error={errors.password?.message}>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              className={`${inputCls} pr-11`}
              placeholder="At least 8 characters"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              aria-label="Toggle password"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {pw.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < strength.score
                        ? strength.score >= 3
                          ? "bg-cyan"
                          : strength.score === 2
                            ? "bg-accent"
                            : "bg-destructive"
                        : "bg-white/[0.06]"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-1.5 text-[11px] text-muted-foreground">{strength.label}</div>
            </div>
          )}
        </FloatingField>

        <FloatingField label="Confirm password" error={errors.confirm?.message}>
          <input
            type={showPw ? "text" : "password"}
            className={inputCls}
            placeholder="Repeat your password"
            {...register("confirm")}
          />
        </FloatingField>

        <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer">
          <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-white/[0.04] accent-primary" {...register("accept")} />
          <span>
            I agree to the <a href="#" className="text-foreground hover:text-cyan">Terms</a> and{" "}
            <a href="#" className="text-foreground hover:text-cyan">Privacy Policy</a>, and consent to FERPA-compliant data handling.
          </span>
        </label>
        {errors.accept && <div className="text-[11px] text-destructive">{errors.accept.message}</div>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Provisioning your campus…
            </>
          ) : (
            <>
              Create account <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
