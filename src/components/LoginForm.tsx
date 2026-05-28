"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SocialLoginButtons from "@/components/SocialLoginButtons";
import { setAuthUser } from "@/lib/auth-storage";

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = (form.get("email") as string)?.trim();
    if (!email) return;
    setAuthUser({ email, plan: "free" });
    localStorage.removeItem("visaseek-daily-usage");
    router.push("/");
  };

  return (
    <>
      <SocialLoginButtons />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-500">OR</span>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Log in
        </button>
      </form>

      <div className="mt-4 text-center">
        <a href="#" className="text-sm text-gray-600 hover:underline">
          Forgot password?
        </a>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-gray-900 hover:underline"
        >
          Sign up for free
        </Link>
      </p>

      <p className="mt-8 text-center text-xs text-gray-400">
        By continuing, you agree to our Terms and Privacy Policy
      </p>
    </>
  );
}
