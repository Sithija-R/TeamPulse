import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useAuthStore } from "../../store/authStore";
import { registerSchema } from "../../schemas/auth.schema";

export const Register = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleRegister = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const tree = z.treeifyError(result.error);
      setErrors({
        name: tree.properties?.name?.errors[0],
        email: tree.properties?.email?.errors[0],
        password: tree.properties?.password?.errors[0],
        confirmPassword: tree.properties?.confirmPassword?.errors[0],
      });
      return;
    }

    setErrors({});

    try {
      await register({
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
      });

      const user = useAuthStore.getState().authUser;

      toast.add({
        title: "Account created!",
        description: `Welcome to TeamPulse${user?.name ? `, ${user.name}` : ""}.`,
        type: "success",
      });

      if (user?.role === "MANAGER" || user?.role === "ADMIN") {
        navigate("/management/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";

      toast.add({
        title: "Registration failed",
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
              <h1 className="text-xl font-bold text-[#171A18]">
                Join TeamPulse
              </h1>
              <p className="text-xs text-[#6B726D]">
                Create your team workspace account
              </p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-semibold text-[#171A18]"
              >
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                placeholder="Alex Morgan"
                autoComplete="name"
                className="h-10 rounded-xl border-[#E5E7E5] bg-[#F7F8F7] text-xs font-medium text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0"
              />
              {errors.name && (
                <p className="text-[11px] font-medium text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-[#171A18]"
              >
                Work Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                placeholder="alex@teampulse.io"
                autoComplete="email"
                className="h-10 rounded-xl border-[#E5E7E5] bg-[#F7F8F7] text-xs font-medium text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0"
              />
              {errors.email && (
                <p className="text-[11px] font-medium text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-[#171A18]"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                placeholder="••••••••"
                autoComplete="new-password"
                className="h-10 rounded-xl border-[#E5E7E5] bg-[#F7F8F7] text-xs font-medium text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0"
              />
              {errors.password && (
                <p className="text-[11px] font-medium text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-semibold text-[#171A18]"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                  }
                }}
                placeholder="••••••••"
                autoComplete="new-password"
                className="h-10 rounded-xl border-[#E5E7E5] bg-[#F7F8F7] text-xs font-medium text-[#171A18] focus-visible:border-[#171A18] focus-visible:ring-0"
              />
              {errors.confirmPassword && (
                <p className="text-[11px] font-medium text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 w-full rounded-xl bg-[#8DF688] text-xs font-bold text-[#171A18] shadow-xs transition-colors hover:bg-[#7ae875] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                "Creating Account..."
              ) : (
                <>
                  Complete Registration
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-[#6B726D]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#171A18] hover:underline"
            >
              Log In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};