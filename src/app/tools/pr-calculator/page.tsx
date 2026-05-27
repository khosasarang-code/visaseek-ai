"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";

export default function PRCalculatorPage() {
  const [form, setForm] = useState({
    age: "",
    education: "",
    experience: "",
    language: "",
    hasJobOffer: false,
    hasCanadianEducation: false,
    hasSibling: false,
    maritalStatus: "single",
    spouseEducation: "",
    spouseLanguage: "",
    spouseExperience: "",
  });
  const [score, setScore] = useState<number | null>(null);

  const calculateCRS = () => {
    let total = 0;
    const hasSpouse = form.maritalStatus === "married";

    // Age points
    const age = parseInt(form.age);
    if (hasSpouse) {
      if (age >= 18 && age <= 35) total += 100;
      else if (age === 36) total += 95;
      else if (age === 37) total += 90;
      else if (age === 38) total += 85;
      else if (age === 39) total += 80;
      else if (age === 40) total += 75;
      else if (age === 41) total += 70;
      else if (age === 42) total += 65;
      else if (age === 43) total += 60;
      else if (age === 44) total += 55;
      else if (age === 45) total += 50;
    } else {
      if (age >= 18 && age <= 35) total += 110;
      else if (age === 36) total += 105;
      else if (age === 37) total += 99;
      else if (age === 38) total += 94;
      else if (age === 39) total += 88;
      else if (age === 40) total += 83;
      else if (age === 41) total += 77;
      else if (age === 42) total += 72;
      else if (age === 43) total += 66;
      else if (age === 44) total += 61;
      else if (age === 45) total += 55;
    }

    // Education points
    if (hasSpouse) {
      if (form.education === "phd") total += 140;
      else if (form.education === "masters") total += 126;
      else if (form.education === "bachelors") total += 112;
      else if (form.education === "diploma") total += 91;
      else if (form.education === "highschool") total += 28;
    } else {
      if (form.education === "phd") total += 150;
      else if (form.education === "masters") total += 135;
      else if (form.education === "bachelors") total += 120;
      else if (form.education === "diploma") total += 98;
      else if (form.education === "highschool") total += 30;
    }

    // Work experience points
    if (hasSpouse) {
      if (form.experience === "1") total += 35;
      else if (form.experience === "2") total += 46;
      else if (form.experience === "3") total += 56;
      else if (form.experience === "4") total += 63;
      else if (form.experience === "5+") total += 70;
    } else {
      if (form.experience === "1") total += 40;
      else if (form.experience === "2") total += 53;
      else if (form.experience === "3") total += 64;
      else if (form.experience === "4") total += 72;
      else if (form.experience === "5+") total += 80;
    }

    // Language points
    if (hasSpouse) {
      if (form.language === "9+") total += 128;
      else if (form.language === "8") total += 116;
      else if (form.language === "7") total += 102;
      else if (form.language === "6") total += 88;
    } else {
      if (form.language === "9+") total += 136;
      else if (form.language === "8") total += 124;
      else if (form.language === "7") total += 110;
      else if (form.language === "6") total += 96;
    }

    // Spouse points
    if (hasSpouse) {
      if (form.spouseEducation === "phd") total += 10;
      else if (form.spouseEducation === "masters") total += 10;
      else if (form.spouseEducation === "bachelors") total += 9;
      else if (form.spouseEducation === "diploma") total += 7;

      if (form.spouseLanguage === "9+") total += 20;
      else if (form.spouseLanguage === "8") total += 18;
      else if (form.spouseLanguage === "7") total += 16;
      else if (form.spouseLanguage === "6") total += 14;

      if (form.spouseExperience === "1") total += 5;
      else if (form.spouseExperience === "2") total += 7;
      else if (form.spouseExperience === "3") total += 8;
      else if (form.spouseExperience === "4") total += 9;
      else if (form.spouseExperience === "5+") total += 10;
    }

    // Bonus points
    if (form.hasJobOffer) total += 50;
    if (form.hasCanadianEducation) total += 30;
    if (form.hasSibling) total += 15;

    setScore(total);
  };

  const getResult = () => {
    if (score === null) return null;
    if (score >= 470) return { color: "green", text: "Excellent! You have a very high chance of getting an ITA!", emoji: "🎉" };
    if (score >= 440) return { color: "blue", text: "Good score! You may qualify soon. Improve your language score!", emoji: "👍" };
    if (score >= 400) return { color: "orange", text: "Average score. Consider Provincial Nominee Program (PNP)!", emoji: "📋" };
    return { color: "red", text: "Low score. Focus on improving language and work experience!", emoji: "💪" };
  };

  const result = getResult();

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">🇨🇦 Express Entry CRS Calculator</h1>
          <p className="mt-2 text-gray-500">Calculate your Comprehensive Ranking System score instantly</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">

          {/* Marital Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
            <select
              value={form.maritalStatus}
              onChange={e => setForm({...form, maritalStatus: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="single">Single / Divorced / Separated</option>
              <option value="married">Married / Common-law Partner</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Age</label>
            <input
              type="number"
              placeholder="Enter your age"
              value={form.age}
              onChange={e => setForm({...form, age: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Highest Education</label>
            <select
              value={form.education}
              onChange={e => setForm({...form, education: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Select education level</option>
              <option value="phd">PhD / Doctorate</option>
              <option value="masters">Master's Degree</option>
              <option value="bachelors">Bachelor's Degree</option>
              <option value="diploma">Diploma / Certificate</option>
              <option value="highschool">High School</option>
            </select>
          </div>

          {/* Work Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Work Experience (years)</label>
            <select
              value={form.experience}
              onChange={e => setForm({...form, experience: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Select experience</option>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="4">4 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IELTS / Language Score (CLB)</label>
            <select
              value={form.language}
              onChange={e => setForm({...form, language: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Select language level</option>
              <option value="9+">CLB 9+ (IELTS 7.5+)</option>
              <option value="8">CLB 8 (IELTS 6.5-7.0)</option>
              <option value="7">CLB 7 (IELTS 6.0)</option>
              <option value="6">CLB 6 (IELTS 5.5)</option>
            </select>
          </div>

          {/* Spouse Section */}
          {form.maritalStatus === "married" && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-4">
              <p className="text-sm font-medium text-blue-800">👫 Spouse / Partner Information</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Education</label>
                <select
                  value={form.spouseEducation}
                  onChange={e => setForm({...form, spouseEducation: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">Select spouse education</option>
                  <option value="phd">PhD / Doctorate</option>
                  <option value="masters">Master's Degree</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="diploma">Diploma / Certificate</option>
                  <option value="highschool">High School</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Language Score (CLB)</label>
                <select
                  value={form.spouseLanguage}
                  onChange={e => setForm({...form, spouseLanguage: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">Select spouse language level</option>
                  <option value="9+">CLB 9+ (IELTS 7.5+)</option>
                  <option value="8">CLB 8 (IELTS 6.5-7.0)</option>
                  <option value="7">CLB 7 (IELTS 6.0)</option>
                  <option value="6">CLB 6 (IELTS 5.5)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Canadian Work Experience</label>
                <select
                  value={form.spouseExperience}
                  onChange={e => setForm({...form, spouseExperience: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">Select spouse experience</option>
                  <option value="0">No Canadian experience</option>
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="4">4 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>
            </div>
          )}

          {/* Bonus */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Bonus Points</p>
            {[
              { key: "hasJobOffer", label: "I have a valid Canadian job offer (+50 pts)" },
              { key: "hasCanadianEducation", label: "I studied in Canada (+30 pts)" },
              { key: "hasSibling", label: "I have a sibling in Canada (+15 pts)" },
            ].map(item => (
              <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[item.key as keyof typeof form] as boolean}
                  onChange={e => setForm({...form, [item.key]: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">{item.label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={calculateCRS}
            className="w-full rounded-lg bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Calculate My CRS Score →
          </button>

          {score !== null && result && (
            <div className={`rounded-xl p-6 text-center border-2 ${
              result.color === "green" ? "border-green-500 bg-green-50" :
              result.color === "blue" ? "border-blue-500 bg-blue-50" :
              result.color === "orange" ? "border-orange-500 bg-orange-50" :
              "border-red-500 bg-red-50"
            }`}>
              <div className="text-4xl mb-2">{result.emoji}</div>
              <div className="text-5xl font-bold text-gray-900 mb-2">{score}</div>
              <div className="text-sm font-medium text-gray-700 mb-2">Your Estimated CRS Score</div>
              <p className="text-sm text-gray-600">{result.text}</p>
              <p className="mt-3 text-xs text-gray-400">
                ⚠️ This is an estimate only. Verify with official IRCC tools at ircc.canada.ca
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
