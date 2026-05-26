import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">✈️ VisaSeek AI</h1>
          <p className="mt-1 text-sm text-gray-500">Create your free account</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
