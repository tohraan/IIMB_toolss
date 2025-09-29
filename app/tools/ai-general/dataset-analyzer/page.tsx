"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Database, TrendingUp, Table, Gauge, Files } from "lucide-react"
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
          { name: "user_id", type: "numeric", nulls: 0, unique: 15420, min: 1, max: 15420, mean: 7710.5, std: 4451.7 },
          { name: "age", type: "numeric", nulls: 23, unique: 67, min: 18, max: 85, mean: 42.3, std: 14.5 },
          { name: "gender", type: "categorical", nulls: 5, unique: 3, top: "Female", freq: 7800 },
          { name: "income", type: "numeric", nulls: 156, unique: 8934, min: 20000, max: 150000, mean: 75000, std: 25000 },
          { name: "education", type: "categorical", nulls: 89, unique: 5, top: "Bachelor's", freq: 6200 },
          { name: "purchase_amount", type: "numeric", nulls: 12, unique: 3421, min: 10, max: 5000, mean: 250, std: 400 },
          { name: "category", type: "categorical", nulls: 0, unique: 8, top: "Electronics", freq: 3000 },
          { name: "timestamp", type: "datetime", nulls: 0, unique: 15420, min: "2023-01-01", max: "2024-12-31" },
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
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1 flex-col gap-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dataset Analyzer</h1>
            <p className="text-muted-foreground">Upload and analyze your datasets to discover insights and data quality metrics.</p>
          </div>
        </div>

        <div className="grid gap-8">
          {step === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Upload Dataset
                  </CardTitle>
                  <CardDescription>Upload a CSV, Excel, or JSON file for analysis (max 10MB).</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="relative rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/50">
                      <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="mb-1 text-sm text-muted-foreground">Drag and drop your file here, or</p>
                      <label htmlFor="file-upload" className="cursor-pointer text-sm font-medium text-primary hover:underline">
                        browse to upload
                        <Input id="file-upload" type="file" accept=".csv,.xlsx,.json" onChange={handleFileUpload} className="sr-only" />
                      </label>
                    </div>
                    {file && (
                      <div className="flex items-center justify-between rounded-md bg-secondary/50 p-3 text-sm">
                        <span className="font-medium">{file.name}</span>
                        <span className="text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button onClick={analyzeDataset} disabled={!file || loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-bounce" />
                    Analyzing Dataset...
                  </>
                ) : (
                  <>
                    <Files className="mr-2 h-4 w-4" />
                    Analyze Dataset
                  </>
                )}
              </Button>
            </div>
          )}

          {step === 2 && (
            <Card className="flex h-[300px] items-center justify-center">
              <CardContent className="text-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Analyzing Dataset</h3>
                <p className="text-muted-foreground">Processing your data and generating insights...</p>
              </CardContent>
            </Card>
          )}

          {step === 3 && analysis && (
            <div className="space-y-6">
              <Tabs defaultValue="overview">
                <ScrollArea orientation="horizontal" className="pb-2">
                  <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="columns">Column Analysis</TabsTrigger>
                    <TabsTrigger value="quality">Data Quality</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  </TabsList>
                </ScrollArea>

                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        Dataset Overview
                      </CardTitle>
                      <CardDescription>High-level summary of your dataset: {analysis.overview.fileName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="rounded-md border p-4 text-center">
                          <div className="text-2xl font-bold text-primary">{analysis.overview.rows.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Rows</div>
                        </div>
                        <div className="rounded-md border p-4 text-center">
                          <div className="text-2xl font-bold text-primary">{analysis.overview.columns}</div>
                          <div className="text-sm text-muted-foreground">Columns</div>
                        </div>
                        <div className="rounded-md border p-4 text-center">
                          <div className="text-2xl font-bold text-primary">{analysis.overview.fileSize}</div>
                          <div className="text-sm text-muted-foreground">File Size</div>
                        </div>
                        <div className="rounded-md border p-4 text-center">
                          <div className="text-2xl font-bold text-primary">{analysis.qualityScore}%</div>
                          <div className="text-sm text-muted-foreground">Quality Score</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Data Types</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-blue-500" /> {analysis.overview.dataTypes.numeric} Numeric
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-green-500" /> {analysis.overview.dataTypes.categorical} Categorical
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-purple-500" /> {analysis.overview.dataTypes.datetime} DateTime
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="columns" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Column Analysis</CardTitle>
                      <CardDescription>Detailed breakdown of each column in your dataset.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px] w-full rounded-md border">
                        <div className="relative w-full overflow-auto">
                          <Table>
                            <TableHeader className="sticky top-0 bg-card/80 backdrop-blur-sm">
                              <TableRow>
                                <TableHead className="w-[150px]">Column Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Nulls</TableHead>
                                <TableHead>Unique</TableHead>
                                <TableHead>Min</TableHead>
                                <TableHead>Max</TableHead>
                                <TableHead>Mean</TableHead>
                                <TableHead>Std Dev</TableHead>
                                <TableHead>Top Value</TableHead>
                                <TableHead>Frequency</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {analysis.columns.map((column: any, index: number) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">{column.name}</TableCell>
                                  <TableCell>
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
                                  </TableCell>
                                  <TableCell>{column.nulls}</TableCell>
                                  <TableCell>{column.unique?.toLocaleString()}</TableCell>
                                  <TableCell>{column.min ?? "-"}</TableCell>
                                  <TableCell>{column.max ?? "-"}</TableCell>
                                  <TableCell>{column.mean?.toFixed(2) ?? "-"}</TableCell>
                                  <TableCell>{column.std?.toFixed(2) ?? "-"}</TableCell>
                                  <TableCell>{column.top ?? "-"}</TableCell>
                                  <TableCell>{column.freq?.toLocaleString() ?? "-"}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="quality" className="mt-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Gauge className="h-5 w-5 text-primary" />
                          Data Quality Metrics
                        </CardTitle>
                        <CardDescription>Key metrics indicating the overall quality of your dataset.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <div className="mb-1 flex justify-between text-sm">
                            <span className="font-medium">Completeness</span>
                            <span className="text-muted-foreground">{analysis.statistics.completeness}%</span>
                          </div>
                          <Progress value={analysis.statistics.completeness} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="rounded-md border p-4">
                            <div className="text-2xl font-bold text-destructive">{analysis.statistics.duplicates}</div>
                            <div className="text-sm text-muted-foreground">Duplicates</div>
                          </div>
                          <div className="rounded-md border p-4">
                            <div className="text-2xl font-bold text-orange-400">{analysis.statistics.outliers}</div>
                            <div className="text-sm text-muted-foreground">Outliers</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Feature Correlations
                        </CardTitle>
                        <CardDescription>Identify relationships between different variables.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analysis.statistics.correlations.map((corr: any, index: number) => (
                            <div key={index} className="flex items-center justify-between rounded-md border p-3">
                              <div className="text-sm font-medium">
                                {corr.var1} <span className="text-muted-foreground">×</span> {corr.var2}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm text-muted-foreground">{(corr.correlation * 100).toFixed(0)}%</div>
                                <div className="h-2 w-20 rounded-full bg-muted">
                                  <div
                                    className="h-2 rounded-full bg-primary"
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
                </TabsContent>

                <TabsContent value="insights" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Files className="h-5 w-5 text-primary" />
                        Key Insights
                      </CardTitle>
                      <CardDescription>Important discoveries and patterns from your dataset.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.insights.map((insight: string, index: number) => (
                          <li key={index} className="flex items-start gap-3 rounded-md border p-3 text-sm text-muted-foreground">
                            <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary mt-2" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="recommendations" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Recommendations
                      </CardTitle>
                      <CardDescription>Actionable steps to improve data quality or leverage findings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start gap-3 rounded-md border p-3 text-sm text-muted-foreground">
                            <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500 mt-2" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Button
                onClick={() => {
                  setStep(1)
                  setAnalysis(null)
                  setFile(null)
                }}
                variant="outline"
                className="w-full"
              >
                Analyze New Dataset
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
