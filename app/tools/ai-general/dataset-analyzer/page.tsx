"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Upload, Database, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DatasetAnalyzerPage() {
  const [step, setStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const analyzeDataset = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please upload a dataset file",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(2)

    // Simulate dataset analysis
    setTimeout(() => {
      const mockAnalysis = {
        overview: {
          fileName: file.name,
          fileSize: "2.3 MB",
          rows: 15420,
          columns: 12,
          dataTypes: {
            numeric: 8,
            categorical: 3,
            datetime: 1,
          },
        },
        columns: [
          { name: "user_id", type: "numeric", nulls: 0, unique: 15420 },
          { name: "age", type: "numeric", nulls: 23, unique: 67 },
          { name: "gender", type: "categorical", nulls: 5, unique: 3 },
          { name: "income", type: "numeric", nulls: 156, unique: 8934 },
          { name: "education", type: "categorical", nulls: 89, unique: 5 },
          { name: "purchase_amount", type: "numeric", nulls: 12, unique: 3421 },
          { name: "category", type: "categorical", nulls: 0, unique: 8 },
          { name: "timestamp", type: "datetime", nulls: 0, unique: 15420 },
        ],
        statistics: {
          completeness: 97.2,
          duplicates: 45,
          outliers: 234,
          correlations: [
            { var1: "age", var2: "income", correlation: 0.67 },
            { var1: "income", var2: "purchase_amount", correlation: 0.54 },
            { var1: "education", var2: "income", correlation: 0.43 },
          ],
        },
        insights: [
          "Strong positive correlation between age and income (0.67)",
          "Purchase amount increases with income level",
          "Missing values are primarily in income and education fields",
          "45 duplicate records detected and should be removed",
          "234 outliers identified in purchase_amount column",
        ],
        recommendations: [
          "Remove duplicate records to improve data quality",
          "Consider imputation strategies for missing income values",
          "Investigate outliers in purchase_amount for data validity",
          "Age and income could be strong predictors for modeling",
          "Category distribution appears balanced for analysis",
        ],
        qualityScore: 87,
      }

      setAnalysis(mockAnalysis)
      setLoading(false)
      setStep(3)
    }, 4000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dataset Analyzer</h1>
        <p className="text-gray-400">Upload and analyze your datasets to discover insights and data quality metrics</p>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Dataset
              </CardTitle>
              <CardDescription>Upload a CSV, Excel, or JSON file for analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-gray-300">Drop your file here or click to browse</p>
                  <p className="text-sm text-gray-500">Supports CSV, XLSX, JSON files up to 10MB</p>
                </div>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.json"
                  onChange={handleFileUpload}
                  className="mt-4 bg-gray-800 border-gray-700 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2"
                />
              </div>
              {file && (
                <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={analyzeDataset} disabled={!file} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
            <BarChart className="h-4 w-4 mr-2" />
            Analyze Dataset
          </Button>
        </div>
      )}

      {step === 2 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Analyzing Dataset</h3>
            <p className="text-gray-400">Processing your data and generating insights...</p>
          </CardContent>
        </Card>
      )}

      {step === 3 && analysis && (
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5" />
                Dataset Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{analysis.overview.rows.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Rows</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{analysis.overview.columns}</div>
                  <div className="text-sm text-gray-400">Columns</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{analysis.overview.fileSize}</div>
                  <div className="text-sm text-gray-400">File Size</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{analysis.qualityScore}%</div>
                  <div className="text-sm text-gray-400">Quality Score</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  {analysis.overview.dataTypes.numeric} Numeric
                </Badge>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  {analysis.overview.dataTypes.categorical} Categorical
                </Badge>
                <Badge variant="outline" className="border-purple-500 text-purple-400">
                  {analysis.overview.dataTypes.datetime} DateTime
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Column Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.columns.map((column: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="font-medium text-white">{column.name}</div>
                      <Badge
                        variant="outline"
                        className={
                          column.type === "numeric"
                            ? "border-blue-500 text-blue-400"
                            : column.type === "categorical"
                              ? "border-green-500 text-green-400"
                              : "border-purple-500 text-purple-400"
                        }
                      >
                        {column.type}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>Nulls: {column.nulls}</span>
                      <span>Unique: {column.unique.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Data Quality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Completeness</span>
                    <span className="text-white">{analysis.statistics.completeness}%</span>
                  </div>
                  <Progress value={analysis.statistics.completeness} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-red-400">{analysis.statistics.duplicates}</div>
                    <div className="text-xs text-gray-400">Duplicates</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-orange-400">{analysis.statistics.outliers}</div>
                    <div className="text-xs text-gray-400">Outliers</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Correlations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.statistics.correlations.map((corr: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="text-sm text-gray-300">
                        {corr.var1} × {corr.var2}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-white">{corr.correlation}</div>
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.insights.map((insight: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-300">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.recommendations.map((recommendation: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-300">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Button
            onClick={() => {
              setStep(1)
              setAnalysis(null)
              setFile(null)
            }}
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Analyze New Dataset
          </Button>
        </div>
      )}
    </div>
  )
}
