"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Copy, Languages, ArrowRightLeft, Volume2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LanguageTranslatorPage() {
  const [step, setStep] = useState(1)
  const [sourceText, setSourceText] = useState("")
  const [sourceLang, setSourceLang] = useState("auto")
  const [targetLang, setTargetLang] = useState("es")
  const [translation, setTranslation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const languages = [
    { code: "auto", name: "Auto-detect" },
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "th", name: "Thai" },
    { code: "vi", name: "Vietnamese" },
  ]

  const translateText = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Error",
        description: "Please provide text to translate",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(2)

    // Simulate translation
    setTimeout(() => {
      const mockTranslation = {
        originalText: sourceText,
        translatedText: "Hola, ¿cómo estás? Espero que tengas un día maravilloso lleno de alegría y éxito.",
        detectedLanguage: "English",
        targetLanguage: languages.find((l) => l.code === targetLang)?.name || "Spanish",
        confidence: 0.96,
        alternatives: [
          "Hola, ¿cómo te va? Espero que tengas un día increíble lleno de felicidad y logros.",
          "Saludos, ¿qué tal? Deseo que pases un día fantástico repleto de gozo y triunfos.",
        ],
        pronunciation:
          "OH-lah, KOH-moh ehs-TAHS? ehs-PEH-roh keh TEHN-gahs oon DEE-ah mah-rah-vee-YOH-soh YEH-noh deh ah-leh-GREE-ah ee EHK-see-toh.",
        wordCount: {
          original: 12,
          translated: 14,
        },
        languageInfo: {
          family: "Romance",
          speakers: "500M+",
          regions: ["Spain", "Latin America", "Equatorial Guinea"],
        },
      }

      setTranslation(mockTranslation)
      setLoading(false)
      setStep(3)
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Translation copied to clipboard",
    })
  }

  const swapLanguages = () => {
    if (sourceLang !== "auto") {
      setTargetLang(sourceLang)
      setSourceLang(targetLang)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Language Translator</h1>
        <p className="text-gray-400">Translate text between multiple languages with AI-powered accuracy</p>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Language Selection</CardTitle>
              <CardDescription>Choose source and target languages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-400 mb-2 block">From</label>
                  <Select value={sourceLang} onValueChange={setSourceLang}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code} className="text-white hover:bg-gray-700">
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapLanguages}
                  className="mt-6 border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                  disabled={sourceLang === "auto"}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <label className="text-sm text-gray-400 mb-2 block">To</label>
                  <Select value={targetLang} onValueChange={setTargetLang}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {languages
                        .filter((lang) => lang.code !== "auto")
                        .map((lang) => (
                          <SelectItem key={lang.code} value={lang.code} className="text-white hover:bg-gray-700">
                            {lang.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Text to Translate
              </CardTitle>
              <CardDescription>Enter the text you want to translate</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter text to translate..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="min-h-[150px] bg-gray-800 border-gray-700 text-white"
              />
              <div className="mt-2 text-sm text-gray-400">{sourceText.length} characters</div>
            </CardContent>
          </Card>

          <Button onClick={translateText} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
            <Languages className="h-4 w-4 mr-2" />
            Translate
          </Button>
        </div>
      )}

      {step === 2 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Translating</h3>
            <p className="text-gray-400">AI is translating your text...</p>
          </CardContent>
        </Card>
      )}

      {step === 3 && translation && (
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Translation Result
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(translation.translatedText)}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  {translation.detectedLanguage} → {translation.targetLanguage}
                </Badge>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  {(translation.confidence * 100).toFixed(1)}% confidence
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Original</h4>
                  <div className="p-4 bg-gray-800 rounded-lg text-white">{translation.originalText}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Translation</h4>
                  <div className="p-4 bg-gray-800 rounded-lg text-white">{translation.translatedText}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Alternative Translations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {translation.alternatives.map((alt: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">{alt}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(alt)}
                      className="border-gray-700 text-gray-400 hover:bg-gray-700 bg-transparent"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Pronunciation Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <p className="text-gray-300 text-sm font-mono">{translation.pronunciation}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Language Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Family:</span>
                  <span className="text-white">{translation.languageInfo.family}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Speakers:</span>
                  <span className="text-white">{translation.languageInfo.speakers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Word Count:</span>
                  <span className="text-white">
                    {translation.wordCount.original} → {translation.wordCount.translated}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Primary Regions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {translation.languageInfo.regions.map((region: string, index: number) => (
                  <Badge key={index} variant="outline" className="border-purple-500 text-purple-400">
                    {region}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={() => {
              setStep(1)
              setTranslation(null)
              setSourceText("")
            }}
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Translate New Text
          </Button>
        </div>
      )}
    </div>
  )
}
