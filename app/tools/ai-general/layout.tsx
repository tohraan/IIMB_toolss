"use client"

import type { ReactNode } from "react"
import DashboardSidebar from "@/components/dashboard-sidebar"

const aiGeneralTools = [
  { name: "Research Summarizer", href: "/tools/ai-general/research-summarizer", icon: "📊" },
  { name: "Dataset Analyzer", href: "/tools/ai-general/dataset-analyzer", icon: "📈" },
  { name: "Text Classifier", href: "/tools/ai-general/text-classifier", icon: "🏷️" },
  { name: "Language Translator", href: "/tools/ai-general/language-translator", icon: "🌐" },
  { name: "Sentiment Analyzer", href: "/tools/ai-general/sentiment-analyzer", icon: "😊" },
]

export default function AIGeneralLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-black">
      <DashboardSidebar currentCategory="ai-general" tools={aiGeneralTools} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
