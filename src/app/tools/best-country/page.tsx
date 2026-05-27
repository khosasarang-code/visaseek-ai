"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";

export default function BestCountryPage() {
  const [form, setForm] = useState({
    education: "",
    experience: "",
    budget: "",
    language: "",
    job: "",
    family: "",
    priority: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const findBestCountry = async () => {
    if (!form.education || !form.budget || !form.job) {
      alert("Please fill in all required fields!");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Based on my profile, recommend the TOP 3 best countries for me to immigrate to:

Education Level: ${form.education}
Work Experience: ${form.experience}
Budget for Immigration: ${form.budget}
English Language Level: ${form.language}
Job/Profession: ${form.job}
Family Status: ${form.family}
My Priority: ${form.priority}

Please provide:
1. TOP 3 recommended countries with reasons
2. For each country show:
   - Why it's good for my profile
   - Easiest visa pathway
   - Estimated processing time
   - Estimated cost
   - Difficulty level (Easy/Medium/Hard)
3. Which country is THE BEST choice for me and why

Format with clear sections and emojis. Be specific and helpful.`,
            },
          ],
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let text = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value);
          setResult(text);
        }
      }
    } catch (error) {
      alert("Error finding countries. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">🌍 Best Country Finder</h1>
          <p className="mt-2 text-gray-500">
            Find the easiest country to immigrate to based on your profile
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Highest Education *
            </label>
            <select
              value={form.education}
              onChange={e => setForm({...form, education: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Select education</option>
              <option value="PhD">PhD / Doctorate</option>
              <option value="Masters">Master's Degree</option>
              <option value="Bachelors">Bachelor's Degree</option>
              <option value="Diploma">Diploma / Certificate</option>
              <option value="High School">High School</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Experience
            </label>
            <select
              value={form.experience}
              onChange={e => setForm({...form, experience: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Select experience</option>
              <option value="No experience">No experience</option>
              <option value="Less than 1 year">Less than 1 year</option>
              <option value="1-2 years">1-2 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Profession / Job *
            </label>
            <input
              type="text"
              placeholder="e.g. Software Engineer, Nurse, Accountant, Teacher..."
              value={form.job}
              onChange={e => setForm({...form, job: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Immigration Budget *
            </label>
            <select
              value={form.budget}
              onChange={e => setForm({...form, budget: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Select budget</option>
              <option value="Under $5,000">Under $5,000</option>
              <option value="$5,000 - $15,000">$5,000 - $15,000</option>
              <option value="$15,000 - $30,000">$15,000 - $30,000</option>
              <option value="$30,000 - $50,000">$30,000 - $50,000</option>
              <option value="$50,000+">$50,000+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              English Language Level
            </label>
            <select
              value={form.language}
              onChange={e => setForm({...form, language: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Select level</option>
              <option value="Native/Fluent">Native / Fluent</option>
              <option value="Advanced">Advanced (IELTS 7+)</option>
              <option value="Intermediate">Intermediate (IELTS 5.5-6.5)</option>
              <option value="Basic">Basic (IELTS below 5.5)</option>
              <option value="No English">No English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Family Status
            </label>
            <select
              value={form.family}
              onChange={e => setForm({...form, family: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Select status</option>
              <option value="Single">Single</option>
              <option value="Married, no children">Married, no children</option>
              <option value="Married with children">Married with children</option>
              <option value="Have family in destination country">Have family abroad</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What is most important to you?
            </label>
            <select
              value={form.priority}
              onChange={e => setForm({...form, priority: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Select priority</option>
              <option value="Fastest PR/citizenship">Fastest PR / Citizenship</option>
              <option value="Lowest cost">Lowest cost</option>
              <option value="Best job opportunities">Best job opportunities</option>
              <option value="Best education for children">Best education for children</option>
              <option value="Safety and quality of life">Safety and quality of life</option>
              <option value="Easiest visa process">Easiest visa process</option>
            </select>
          </div>

          <button
            onClick={findBestCountry}
            disabled={loading}
            className="w-full rounded-lg bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Finding best countries for you..." : "Find My Best Countries →"}
          </button>

          {result && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                🌍 Your Personalized Results
              </h3>
              <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
              <p className="mt-4 text-xs text-gray-400">
                ⚠️ Always verify with official government sources or a licensed immigration consultant.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
