"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";

export default function SOPGeneratorPage() {
  const [form, setForm] = useState({
    country: "",
    program: "",
    university: "",
    name: "",
    background: "",
    whyCountry: "",
    whyProgram: "",
    goals: "",
  });
  const [sop, setSop] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSOP = async () => {
    if (!form.country || !form.program || !form.background) {
      alert("Please fill in all required fields!");
      return;
    }
    setLoading(true);
    setSop("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Write a professional Statement of Purpose (SOP) for a student application with these details:
              
Full Name: ${form.name || "Applicant"}
Destination Country: ${form.country}
Program/Course: ${form.program}
University (if known): ${form.university || "top university"}
Academic/Professional Background: ${form.background}
Why this Country: ${form.whyCountry || "excellent education system"}
Why this Program: ${form.whyProgram || "career advancement"}
Future Goals: ${form.goals || "professional growth"}

Write a compelling, professional SOP of 600-800 words that:
- Has a strong opening paragraph
- Explains academic background clearly
- Shows motivation for choosing this country and program
- Describes career goals
- Has a strong conclusion
- Sounds natural and personal, not robotic
- Is ready to submit to immigration/university

Format it as a proper letter.`,
            },
          ],
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value);
          setSop(result);
        }
      }
    } catch (error) {
      alert("Error generating SOP. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sop);
    alert("SOP copied to clipboard!");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">📄 SOP Generator</h1>
          <p className="mt-2 text-gray-500">Generate a professional Statement of Purpose with AI</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Full Name
              </label>
              <input
                type="text"
                placeholder="John Smith"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Country *
              </label>
              <select
                value={form.country}
                onChange={e => setForm({...form, country: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Select country</option>
                <option value="Canada">Canada</option>
                <option value="USA">USA</option>
                <option value="UK">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Ireland">Ireland</option>
                <option value="UAE">UAE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program / Course *
              </label>
              <input
                type="text"
                placeholder="e.g. Master of Computer Science"
                value={form.program}
                onChange={e => setForm({...form, program: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University Name (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. University of Toronto"
                value={form.university}
                onChange={e => setForm({...form, university: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Academic/Professional Background *
            </label>
            <textarea
              rows={3}
              placeholder="e.g. I completed my Bachelor's in Computer Science from XYZ University with 3.8 GPA. I have 2 years of experience as a software developer..."
              value={form.background}
              onChange={e => setForm({...form, background: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why this Country?
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Canada has world-class universities and excellent post-study work opportunities..."
              value={form.whyCountry}
              onChange={e => setForm({...form, whyCountry: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why this Program?
            </label>
            <textarea
              rows={2}
              placeholder="e.g. This program aligns perfectly with my career goals in AI and machine learning..."
              value={form.whyProgram}
              onChange={e => setForm({...form, whyProgram: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Future Career Goals
            </label>
            <textarea
              rows={2}
              placeholder="e.g. After completing my degree, I plan to work in Canada's tech industry and eventually apply for PR..."
              value={form.goals}
              onChange={e => setForm({...form, goals: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={generateSOP}
            disabled={loading}
            className="w-full rounded-lg bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Generating your SOP..." : "Generate My SOP →"}
          </button>

          {sop && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Your Generated SOP</h3>
                <button
                  onClick={copyToClipboard}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Copy SOP
                </button>
              </div>
              <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                {sop}
              </div>
              <p className="mt-4 text-xs text-gray-400">
                ⚠️ Review and personalize this SOP before submitting.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
