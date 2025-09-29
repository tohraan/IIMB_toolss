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
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1 flex-col gap-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold">Language Translator</h1>
            <p className="text-muted-foreground text-body">Translate text between multiple languages with AI-powered accuracy.</p>
          </div>
        </div>

        <div className="grid gap-8">
          {step === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-primary" />
                    Language Selection
                  </CardTitle>
                  <CardDescription>Choose your source and target languages for translation.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center">
                    <div className="space-y-2">
                      <label className="block text-body font-medium">From</label>
                      <Select value={sourceLang} onValueChange={setSourceLang}>
                        <SelectTrigger className="text-body">
                          <SelectValue placeholder="Auto-detect" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-center pt-6 md:pt-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={swapLanguages}
                        className="h-10 w-10"
                        disabled={sourceLang === "auto"}
                      >
                        <ArrowRightLeft className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-body font-medium">To</label>
                      <Select value={targetLang} onValueChange={setTargetLang}>
                        <SelectTrigger className="text-body">
                          <SelectValue placeholder="Select target language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages
                            .filter((lang) => lang.code !== "auto")
                            .map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-primary" />
                    Text to Translate
                  </CardTitle>
                  <CardDescription>Enter the text you want to translate below.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter text to translate..."
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    className="min-h-[180px]"
                  />
                  <div className="mt-2 text-sm text-muted-foreground">{sourceText.length} characters</div>
                </CardContent>
              </Card>

              <Button onClick={translateText} className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Languages className="mr-2 h-4 w-4 animate-bounce" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages className="mr-2 h-4 w-4" />
                    Translate Text
                  </>
                )}
              </Button>
            </div>
          )}

          {step === 2 && (
            <Card className="flex h-[350px] items-center justify-center">
              <CardContent className="text-center space-y-4">
                <div className="h-16 w-16 animate-spin border-4 border-primary border-t-transparent mx-auto" />
                <h3 className="text-h3 font-semibold">Translating Text</h3>
                <p className="text-muted-foreground text-body">AI is translating your text into the target language...</p>
              </CardContent>
            </Card>
          )}

          {step === 3 && translation && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-primary" />
                    Translation Result
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(translation.translatedText)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Listen
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="secondary" className="text-sm">
                      {translation.detectedLanguage} <ArrowRightLeft className="mx-1 h-3 w-3" /> {translation.targetLanguage}
                    </Badge>
                    <Badge variant="secondary" className="text-sm">
                      {(translation.confidence * 100).toFixed(1)}% confidence
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="text-body font-medium">Original Text</h4>
                      <div className="border bg-muted/20 p-4 text-muted-foreground text-body break-words">
                        {translation.originalText}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-body font-medium">Translated Text</h4>
                      <div className="border bg-muted/20 p-4 text-muted-foreground text-body break-words">
                        {translation.translatedText}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {translation.alternatives?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-h3">Alternative Translations</CardTitle>
                    <CardDescription>Other possible translations for your text.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {translation.alternatives.map((alt: string, index: number) => (
                        <div key={index} className="flex items-center justify-between border p-3">
                          <span className="text-muted-foreground text-body break-words mr-4">{alt}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(alt)}
                            className="shrink-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-h3">Pronunciation Guide</CardTitle>
                    <CardDescription>Phonetic guide for the translated text.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border bg-muted/20 p-3">
                      <p className="text-sm font-mono text-muted-foreground break-words">{translation.pronunciation}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-h3">Language Information</CardTitle>
                    <CardDescription>Details about the target language.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-body">Family:</span>
                      <span className="font-medium text-body">{translation.languageInfo.family}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-body">Speakers:</span>
                      <span className="font-medium text-body">{translation.languageInfo.speakers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-body">Word Count:</span>
                      <span className="font-medium text-body">
                        {translation.wordCount.original} &rarr; {translation.wordCount.translated}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {translation.languageInfo.regions?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-h3">Primary Regions</CardTitle>
                    <CardDescription>Regions where the target language is predominantly spoken.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {translation.languageInfo.regions.map((region: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={() => {
                  setStep(1)
                  setTranslation(null)
                  setSourceText("")
                }}
                variant="outline"
                className="w-full"
              >
                Translate New Text
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
