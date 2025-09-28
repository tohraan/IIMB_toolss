"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Palette, Shuffle, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ColorPalettePage() {
  const [step, setStep] = useState(1)
  const [baseColor, setBaseColor] = useState("#3B82F6")
  const [paletteType, setPaletteType] = useState("complementary")
  const [palette, setPalette] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generatePalette = async () => {
    setLoading(true)
    setStep(2)

    // Simulate AI color palette generation
    setTimeout(() => {
      const mockPalette = {
        primary: baseColor,
        colors: [
          { name: "Primary", hex: baseColor, rgb: "rgb(59, 130, 246)" },
          { name: "Secondary", hex: "#F59E0B", rgb: "rgb(245, 158, 11)" },
          { name: "Accent", hex: "#10B981", rgb: "rgb(16, 185, 129)" },
          { name: "Neutral Light", hex: "#F3F4F6", rgb: "rgb(243, 244, 246)" },
          { name: "Neutral Dark", hex: "#374151", rgb: "rgb(55, 65, 81)" },
        ],
        variations: {
          light: ["#EBF8FF", "#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA"],
          dark: ["#1E3A8A", "#1E40AF", "#2563EB", "#3B82F6", "#60A5FA"],
        },
        usage: {
          primary: "Main brand color, buttons, links",
          secondary: "Highlights, call-to-action elements",
          accent: "Success states, positive feedback",
          neutralLight: "Backgrounds, subtle elements",
          neutralDark: "Text, borders, shadows",
        },
        accessibility: {
          wcagAA: true,
          contrastRatio: 4.5,
          colorBlindFriendly: true,
        },
      }

      setPalette(mockPalette)
      setLoading(false)
      setStep(3)
    }, 2000)
  }

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex)
    toast({
      title: "Copied!",
      description: `Color ${hex} copied to clipboard`,
    })
  }

  const exportPalette = () => {
    const css = `/* Generated Color Palette */
:root {
  --primary: ${palette.colors[0].hex};
  --secondary: ${palette.colors[1].hex};
  --accent: ${palette.colors[2].hex};
  --neutral-light: ${palette.colors[3].hex};
  --neutral-dark: ${palette.colors[4].hex};
}`

    const blob = new Blob([css], { type: "text/css" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "color-palette.css"
    a.click()
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Color Palette Generator</h1>
        <p className="text-gray-400">Generate harmonious color palettes for your design projects</p>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Base Color
              </CardTitle>
              <CardDescription>Choose your primary color to generate a palette</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-20 h-12 p-1 bg-gray-800 border-gray-700"
                />
                <Input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="#3B82F6"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Palette Type</CardTitle>
              <CardDescription>Select the type of color harmony</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["complementary", "triadic", "analogous", "monochromatic"].map((type) => (
                  <Button
                    key={type}
                    variant={paletteType === type ? "default" : "outline"}
                    onClick={() => setPaletteType(type)}
                    className={
                      paletteType === type
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "border-gray-700 text-gray-300 hover:bg-gray-800"
                    }
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button onClick={generatePalette} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
            <Shuffle className="h-4 w-4 mr-2" />
            Generate Palette
          </Button>
        </div>
      )}

      {step === 2 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Generating Palette</h3>
            <p className="text-gray-400">Creating harmonious colors based on your selection...</p>
          </CardContent>
        </Card>
      )}

      {step === 3 && palette && (
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Generated Palette
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportPalette}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSS
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {palette.colors.map((color: any, index: number) => (
                  <div key={index} className="text-center">
                    <div
                      className="w-full h-24 rounded-lg mb-3 cursor-pointer border border-gray-700 hover:border-gray-500 transition-colors"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyColor(color.hex)}
                    />
                    <div className="text-white font-medium text-sm mb-1">{color.name}</div>
                    <div className="text-gray-400 text-xs mb-1">{color.hex}</div>
                    <div className="text-gray-500 text-xs">{color.rgb}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Color Variations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Light Variations</h4>
                  <div className="flex gap-1">
                    {palette.variations.light.map((color: string, index: number) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded cursor-pointer border border-gray-700"
                        style={{ backgroundColor: color }}
                        onClick={() => copyColor(color)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Dark Variations</h4>
                  <div className="flex gap-1">
                    {palette.variations.dark.map((color: string, index: number) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded cursor-pointer border border-gray-700"
                        style={{ backgroundColor: color }}
                        onClick={() => copyColor(color)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Usage Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(palette.usage).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-3">
                    <div
                      className="w-4 h-4 rounded-full mt-0.5 border border-gray-700"
                      style={{
                        backgroundColor: palette.colors.find((c: any) => c.name.toLowerCase().includes(key))?.hex,
                      }}
                    />
                    <div>
                      <div className="text-sm font-medium text-white capitalize">{key}</div>
                      <div className="text-xs text-gray-400">{value as string}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Accessibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-green-500 text-green-400">
                  WCAG AA Compliant
                </Badge>
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  4.5:1 Contrast Ratio
                </Badge>
                <Badge variant="outline" className="border-purple-500 text-purple-400">
                  Color Blind Friendly
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={() => {
              setStep(1)
              setPalette(null)
            }}
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Generate New Palette
          </Button>
        </div>
      )}
    </div>
  )
}
