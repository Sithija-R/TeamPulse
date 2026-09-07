import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useAuthStore } from "@/store/authStore";
import { loginSchema } from "@/schemas/auth.schema";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => { 
    e.preventDefault();

    console.log("password:", password);
console.log("password length:", password.length);
console.log(
  z.string().min(8, "Password must be at least 8 characters").safeParse("12345")
);

    const result = loginSchema.safeParse({ email, password });
    console.log("zod ", result)

    if (!result.success) {
      const tree = z.treeifyError(result.error);
  
      setErrors({
        email: tree.properties?.email?.errors[0],
        password: tree.properties?.password?.errors[0],
      });
  
      return;
    }
    console.log("run")
    setErrors({});

    try {
      await login({ email: result.data.email, password: result.data.password });

      const user = useAuthStore.getState().authUser;

      toast.add({
        title: "Welcome back!",
        description: `Signed in successfully${user?.name ? `, ${user.name}` : ""}.`,
        type: "success",
      });

      if (user?.role === "MANAGER" || user?.role === "ADMIN") {
        navigate("/management/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed. Please try again.";

      toast.add({
        title: "Login failed",
        description: message,
        type: "error",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F8F7] p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[#E5E7E5] bg-white p-8 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8DF688] text-[#171A18]">
              <Zap className="h-6 w-6 fill-current stroke-none" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#171A18]">TeamPulse</h1>
              <p className="text-xs text-[#6B726D]">Weekly Reporting & Team Operations</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-[#171A18]">Work Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="alex.morgan@teampulse.io"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className="h-10 rounded-xl border-[#E5E7E5] bg-[#F7F8F7] text-xs font-medium text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0"
              />
              {errors.email && <p className="text-[11px] font-medium text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-[#171A18]">Password</Label>
                <button type="button" className="cursor-pointer text-[11px] text-[#6B726D] hover:underline">Forgot password?</button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className="h-10 rounded-xl border-[#E5E7E5] bg-[#F7F8F7] text-xs font-medium text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0"
              />
              {errors.password && <p className="text-[11px] font-medium text-red-500">{errors.password}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="h-10 w-full cursor-pointer rounded-xl bg-[#8DF688] text-xs font-bold text-[#171A18] shadow-xs transition-colors hover:bg-[#7ae875] disabled:cursor-not-allowed disabled:opacity-70">
              {isLoading ? "Signing In..." : <>Sign In to Workspace<ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-[#6B726D]">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-[#171A18] hover:underline">Create an Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}