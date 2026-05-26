import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">✈️ VisaSeek AI</h1>
          <p className="mt-2 text-sm text-gray-500">Welcome back</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
