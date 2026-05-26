export interface Category {
  id: string;
  icon: string;
  label: string;
  welcome: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "visas",
    icon: "🛂",
    label: "Visas",
    welcome:
      "I can help with visa information! 🛂 Which country's visa are you looking for? (Example: Canada, USA, UK, Australia, Germany, UAE...)",
  },
  {
    id: "study",
    icon: "📚",
    label: "Study Permits",
    welcome:
      "Let's explore study permit options! 📚 Which country are you planning to study in?",
  },
  {
    id: "pr",
    icon: "🏠",
    label: "PR / Green Cards",
    welcome:
      "Let's check your PR options! 🏠 Which country are you targeting for permanent residency?",
  },
  {
    id: "work",
    icon: "💼",
    label: "Work Permits",
    welcome:
      "I'll help you with work permit information! 💼 Which country are you looking to work in?",
  },
  {
    id: "asylum",
    icon: "🆘",
    label: "Asylum Information",
    welcome:
      "I can provide asylum information. 🆘 Which country are you seeking asylum in?",
  },
  {
    id: "citizenship",
    icon: "🌍",
    label: "Citizenship Pathways",
    welcome:
      "Let's explore citizenship options! 🌍 Which country's citizenship are you interested in?",
  },
  {
    id: "documents",
    icon: "📄",
    label: "Document Preparation",
    welcome:
      "I can help you prepare your documents! 📄 Which country and visa type are you applying for?",
  },
  {
    id: "interview",
    icon: "🎤",
    label: "Interview Preparation",
    welcome:
      "Let's prepare for your immigration interview! 🎤 Which country and visa type is your interview for?",
  },
  {
    id: "translation",
    icon: "🌐",
    label: "Translation Help",
    welcome:
      "I can help with translation guidance! 🌐 What documents do you need help with and for which country?",
  },
  {
    id: "timelines",
    icon: "⏱️",
    label: "Timelines & Eligibility",
    welcome:
      "Let's check timelines and eligibility! ⏱️ Which country and visa type would you like to check?",
  },
  {
    id: "refusal",
    icon: "🚫",
    label: "Refusal Analysis",
    welcome: `I can help analyze your visa refusal! 🚫

To give you the best guidance, please tell me:
1. Which country refused your visa?
2. What type of visa did you apply for?
3. Do you have the refusal letter? (you can paste the reason here)

I will help you understand why it was refused and what to do next.`,
  },
];

export const SUGGESTIONS = [
  "Help me with a Visa",
  "Check my PR eligibility",
  "I need Work Permit help",
  "Study Abroad guidance",
];
