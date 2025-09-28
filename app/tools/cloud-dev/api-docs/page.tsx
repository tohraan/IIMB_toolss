"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Copy, 
  FileText, 
  RotateCcw, 
  Download, 
  Upload, 
  Link, 
  Globe, 
  Settings, 
  BookOpen, 
  Shield, 
  Eye,
  MessageSquare,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  FileUp,
  Languages,
  Calendar,
  User,
  Clock,
  Database
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DocumentationSource {
  type: 'upload' | 'paste' | 'url'
  content: string
  fileName?: string
  url?: string
}

interface SummarySettings {
  type: 'tldr' | 'key-points' | 'paragraph' | 'bullet-list'
  length: 'concise' | 'medium' | 'detailed'
  focusSections: string[]
  language: string
  formatting: 'plain' | 'markdown' | 'developer-reference'
  includeMetadata: boolean
  includeSourceInfo: boolean
  includeTimestamp: boolean
  customNotes: string
}

interface ExportSettings {
  format: 'pdf' | 'markdown' | 'html'
  includeTOC: boolean
  passwordProtected: boolean
  watermark: string
  includeSourceLinks: boolean
}

interface ApiSummary {
  overview: string
  endpoints: Array<{
    method: string
    path: string
    description: string
    parameters: Array<{ name: string; type: string; required: boolean; description: string }>
    responses: Array<{ code: number; description: string; example?: any }>
  }>
  authentication: {
    type: string
    details: string
    examples: string[]
  }
  errorCodes: Array<{ code: number; description: string; commonCauses: string[] }>
  rateLimiting: string
  examples: Array<{ title: string; code: string; language: string }>
  metadata: {
    source: string
    version?: string
    generatedAt: string
    summaryType: string
    language: string
  }
}

export default function ApiDocsPage() {
  const [step, setStep] = useState(1)
  const [docSource, setDocSource] = useState<DocumentationSource>({
    type: 'paste',
    content: ''
  })
  const [summarySettings, setSummarySettings] = useState<SummarySettings>({
    type: 'key-points',
    length: 'medium',
    focusSections: ['endpoints', 'authentication', 'error-codes'],
    language: 'en',
    formatting: 'developer-reference',
    includeMetadata: true,
    includeSourceInfo: true,
    includeTimestamp: true,
    customNotes: ''
  })
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'pdf',
    includeTOC: true,
    passwordProtected: false,
    watermark: '',
    includeSourceLinks: true
  })
  const [apiSummary, setApiSummary] = useState<ApiSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const { toast } = useToast()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setDocSource({
          type: 'upload',
          content: e.target?.result as string,
          fileName: file.name
        })
      }
      reader.readAsText(file)
    }
  }

  const updateSummarySettings = (key: keyof SummarySettings, value: any) => {
    setSummarySettings(prev => ({ ...prev, [key]: value }))
  }

  const updateExportSettings = (key: keyof ExportSettings, value: any) => {
    setExportSettings(prev => ({ ...prev, [key]: value }))
  }

  const generatePDF = async () => {
    try {
      const jsPDF = (await import('jspdf')).default

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      let yPosition = 20

      const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
        pdf.setFontSize(fontSize)
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
        
        const lines = pdf.splitTextToSize(text, pageWidth - 40)
        pdf.text(lines, 20, yPosition)
        yPosition += lines.length * fontSize * 0.4 + 5
        
        if (yPosition > pageHeight - 20) {
          pdf.addPage()
          yPosition = 20
        }
      }

      const addLine = () => {
        pdf.setLineWidth(0.5)
        pdf.line(20, yPosition, pageWidth - 20, yPosition)
        yPosition += 10
      }

      // Title
      addText('API Documentation Summary', 20, true)
      addText(`Generated on: ${new Date().toLocaleDateString()}`, 10)
      addLine()

      if (apiSummary) {
        // Overview
        addText('Overview', 16, true)
        addText(apiSummary.overview, 12)
        addLine()

        // Authentication
        addText('Authentication', 16, true)
        addText(`Type: ${apiSummary.authentication.type}`, 12, true)
        addText(apiSummary.authentication.details, 12)
        if (apiSummary.authentication.examples.length > 0) {
          addText('Examples:', 12, true)
          apiSummary.authentication.examples.forEach(example => {
            addText(`• ${example}`, 10)
          })
        }
        addLine()

        // Endpoints
        addText('API Endpoints', 16, true)
        apiSummary.endpoints.forEach(endpoint => {
          addText(`${endpoint.method} ${endpoint.path}`, 12, true)
          addText(endpoint.description, 10)
          if (endpoint.parameters.length > 0) {
            addText('Parameters:', 10, true)
            endpoint.parameters.forEach(param => {
              addText(`  • ${param.name} (${param.type})${param.required ? ' *' : ''}: ${param.description}`, 9)
            })
          }
          addText('', 10)
        })
        addLine()

        // Error Codes
        addText('Error Codes', 16, true)
        apiSummary.errorCodes.forEach(error => {
          addText(`${error.code}: ${error.description}`, 12, true)
          if (error.commonCauses.length > 0) {
            addText('Common causes:', 10, true)
            error.commonCauses.forEach(cause => {
              addText(`  • ${cause}`, 9)
            })
          }
          addText('', 10)
        })
        addLine()

        // Rate Limiting
        if (apiSummary.rateLimiting) {
          addText('Rate Limiting', 16, true)
          addText(apiSummary.rateLimiting, 12)
          addLine()
        }

        // Examples
        if (apiSummary.examples.length > 0) {
          addText('Code Examples', 16, true)
          apiSummary.examples.forEach(example => {
            addText(`${example.title} (${example.language}):`, 12, true)
            addText(example.code, 9)
            addText('', 10)
          })
        }

        // Metadata
        if (summarySettings.includeMetadata) {
          addLine()
          addText('Documentation Metadata', 16, true)
          addText(`Source: ${apiSummary.metadata.source}`, 10)
          addText(`Generated: ${apiSummary.metadata.generatedAt}`, 10)
          addText(`Summary Type: ${apiSummary.metadata.summaryType}`, 10)
          addText(`Language: ${apiSummary.metadata.language}`, 10)
        }
      }

      // Footer
      const totalPages = pdf.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10)
        pdf.text('API Documentation Summarizer Pro', 20, pageHeight - 10)
      }

      const fileName = `api-docs-summary-${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)

      toast({
        title: "PDF Generated",
        description: "API documentation summary downloaded as PDF",
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  const summarizeDocs = async () => {
    if (!docSource.content.trim()) {
      toast({
        title: "Error",
        description: "Please provide API documentation content",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(3)

    // Simulate comprehensive API analysis
    await new Promise(resolve => {
      setTimeout(() => {
        const mockSummary: ApiSummary = {
          overview: "This RESTful API provides comprehensive user management, data processing, and analytics capabilities. It follows REST principles with JSON responses and supports both synchronous and asynchronous operations.",
          endpoints: [
            {
              method: "GET",
              path: "/api/v1/users",
              description: "Retrieve a paginated list of users with optional filtering",
              parameters: [
                { name: "page", type: "integer", required: false, description: "Page number for pagination" },
                { name: "limit", type: "integer", required: false, description: "Number of items per page (max 100)" },
                { name: "search", type: "string", required: false, description: "Search term for user names or emails" },
                { name: "status", type: "string", required: false, description: "Filter by user status (active, inactive, pending)" }
              ],
              responses: [
                { code: 200, description: "Successfully retrieved users", example: { users: [], total: 0, page: 1 } },
                { code: 401, description: "Unauthorized - Invalid or missing token" },
                { code: 403, description: "Forbidden - Insufficient permissions" }
              ]
            },
            {
              method: "POST",
              path: "/api/v1/users",
              description: "Create a new user account",
              parameters: [
                { name: "name", type: "string", required: true, description: "User's full name" },
                { name: "email", type: "string", required: true, description: "User's email address" },
                { name: "password", type: "string", required: true, description: "User's password (min 8 chars)" },
                { name: "role", type: "string", required: false, description: "User role (user, admin, moderator)" }
              ],
              responses: [
                { code: 201, description: "User created successfully" },
                { code: 400, description: "Bad request - Invalid input data" },
                { code: 409, description: "Conflict - Email already exists" }
              ]
            },
            {
              method: "GET",
              path: "/api/v1/users/{id}",
              description: "Retrieve a specific user by ID",
              parameters: [
                { name: "id", type: "string", required: true, description: "User ID (UUID format)" }
              ],
              responses: [
                { code: 200, description: "User found" },
                { code: 404, description: "User not found" },
                { code: 401, description: "Unauthorized" }
              ]
            },
            {
              method: "POST",
              path: "/api/v1/data/upload",
              description: "Upload data files for processing",
              parameters: [
                { name: "file", type: "file", required: true, description: "Data file (CSV, JSON, XML)" },
                { name: "type", type: "string", required: true, description: "Data type identifier" },
                { name: "metadata", type: "object", required: false, description: "Additional file metadata" }
              ],
              responses: [
                { code: 200, description: "File uploaded and processed successfully" },
                { code: 400, description: "Invalid file format or size" },
                { code: 413, description: "File too large" }
              ]
            }
          ],
          authentication: {
            type: "Bearer Token (JWT)",
            details: "All API endpoints require authentication via JWT bearer token. Include the token in the Authorization header.",
            examples: [
              "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              "curl -H 'Authorization: Bearer YOUR_TOKEN' https://api.example.com/v1/users"
            ]
          },
          errorCodes: [
            {
              code: 400,
              description: "Bad Request",
              commonCauses: ["Invalid JSON format", "Missing required fields", "Invalid parameter values", "File format not supported"]
            },
            {
              code: 401,
              description: "Unauthorized",
              commonCauses: ["Missing Authorization header", "Invalid or expired token", "Token format incorrect"]
            },
            {
              code: 403,
              description: "Forbidden",
              commonCauses: ["Insufficient permissions", "Account suspended", "Rate limit exceeded"]
            },
            {
              code: 404,
              description: "Not Found",
              commonCauses: ["Invalid endpoint URL", "Resource doesn't exist", "User not found"]
            },
            {
              code: 429,
              description: "Too Many Requests",
              commonCauses: ["Rate limit exceeded", "Too many requests per minute", "API quota reached"]
            },
            {
              code: 500,
              description: "Internal Server Error",
              commonCauses: ["Database connection issues", "External service unavailable", "Server configuration error"]
            }
          ],
          rateLimiting: "100 requests per minute per API key, 1000 requests per hour per IP address. Rate limit headers included in responses.",
          examples: [
            {
              title: "Get Users with Pagination",
              language: "JavaScript",
              code: `const response = await fetch('/api/v1/users?page=1&limit=10&search=john', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();`
            },
            {
              title: "Create New User",
              language: "Python",
              code: `import requests

headers = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
}

data = {
    'name': 'John Doe',
    'email': 'john@example.com',
    'password': 'securepassword123',
    'role': 'user'
}

response = requests.post('/api/v1/users', headers=headers, json=data)`
            },
            {
              title: "Upload Data File",
              language: "cURL",
              code: `curl -X POST '/api/v1/data/upload' \\
  -H 'Authorization: Bearer YOUR_TOKEN' \\
  -F 'file=@data.csv' \\
  -F 'type=csv' \\
  -F 'metadata={"description": "User data import"}'`
            }
          ],
          metadata: {
            source: docSource.fileName || 'Pasted Content',
            version: '1.0.0',
            generatedAt: new Date().toISOString(),
            summaryType: summarySettings.type,
            language: summarySettings.language
          }
        }

        setApiSummary(mockSummary)
        setLoading(false)
        toast({
          title: "Documentation Summarized",
          description: "API documentation has been analyzed and summarized",
        })
        resolve(undefined)
      }, 4000)
    })
  }

  const submitFeedback = () => {
    if (feedback.trim()) {
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We'll use it to improve the tool.",
      })
      setFeedback('')
    }
  }

  const reset = () => {
    setStep(1)
    setDocSource({ type: 'paste', content: '' })
    setSummarySettings({
      type: 'key-points',
      length: 'medium',
      focusSections: ['endpoints', 'authentication', 'error-codes'],
      language: 'en',
      formatting: 'developer-reference',
      includeMetadata: true,
      includeSourceInfo: true,
      includeTimestamp: true,
      customNotes: ''
    })
    setExportSettings({
      format: 'pdf',
      includeTOC: true,
      passwordProtected: false,
      watermark: '',
      includeSourceLinks: true
    })
    setApiSummary(null)
    setFeedback('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Documentation Summarizer Pro</h1>
        <p className="text-muted-foreground">Transform complex API documentation into clear, actionable summaries with advanced export options</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant={step >= 1 ? "default" : "secondary"}>1. Source</Badge>
        <Badge variant={step >= 2 ? "default" : "secondary"}>2. Settings</Badge>
        <Badge variant={step >= 3 ? "default" : "secondary"}>3. Summary</Badge>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Step 1: Documentation Source
            </CardTitle>
            <CardDescription>Choose how to provide your API documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="paste" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="paste">Paste Text</TabsTrigger>
                <TabsTrigger value="upload">Upload File</TabsTrigger>
                <TabsTrigger value="url">URL Link</TabsTrigger>
              </TabsList>

              <TabsContent value="paste" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-docs">API Documentation</Label>
                  <Textarea
                    id="api-docs"
                    placeholder="Paste your API documentation here... (OpenAPI spec, README, or any API docs)"
                    value={docSource.content}
                    onChange={(e) => setDocSource(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload Documentation File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload API documentation file
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PDF, Markdown, DOC, or text files
                        </span>
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.md,.doc,.docx,.txt,.json,.yaml,.yml"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                  {docSource.fileName && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Uploaded: {docSource.fileName}</span>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-url">API Documentation URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-url"
                      placeholder="https://api.example.com/docs or Swagger/OpenAPI URL"
                      value={docSource.url || ''}
                      onChange={(e) => setDocSource(prev => ({ ...prev, url: e.target.value }))}
                    />
                    <Button variant="outline" onClick={() => {
                      if (docSource.url) {
                        setDocSource(prev => ({ ...prev, content: `URL: ${prev.url}` }))
                        toast({
                          title: "URL Added",
                          description: "URL has been added to the source",
                        })
                      }
                    }}>
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supports Swagger/OpenAPI specs, GitHub docs, and other API documentation URLs
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <Button onClick={() => setStep(2)} disabled={!docSource.content.trim()}>
              Next: Configure Settings
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Step 2: Summary Configuration
            </CardTitle>
            <CardDescription>Customize your summary format, focus areas, and export options</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="focus">Focus</TabsTrigger>
                <TabsTrigger value="format">Format</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Summary Type</Label>
                      <Select value={summarySettings.type} onValueChange={(value: any) => updateSummarySettings('type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tldr">TL;DR - Quick overview</SelectItem>
                          <SelectItem value="key-points">Key Points - Bullet format</SelectItem>
                          <SelectItem value="paragraph">Paragraph - Detailed narrative</SelectItem>
                          <SelectItem value="bullet-list">Bullet List - Structured format</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Summary Length</Label>
                      <Select value={summarySettings.length} onValueChange={(value: any) => updateSummarySettings('length', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="concise">Concise - Essential info only</SelectItem>
                          <SelectItem value="medium">Medium - Balanced detail</SelectItem>
                          <SelectItem value="detailed">Detailed - Comprehensive coverage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Output Language</Label>
                      <Select value={summarySettings.language} onValueChange={(value: any) => updateSummarySettings('language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Formatting Style</Label>
                      <Select value={summarySettings.formatting} onValueChange={(value: any) => updateSummarySettings('formatting', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="plain">Plain Text</SelectItem>
                          <SelectItem value="markdown">Markdown</SelectItem>
                          <SelectItem value="developer-reference">Developer Reference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="focus" className="space-y-4">
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Focus Sections</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { id: 'endpoints', label: 'API Endpoints', icon: <Link className="h-4 w-4" /> },
                      { id: 'authentication', label: 'Authentication', icon: <Shield className="h-4 w-4" /> },
                      { id: 'error-codes', label: 'Error Codes', icon: <AlertTriangle className="h-4 w-4" /> },
                      { id: 'examples', label: 'Code Examples', icon: <FileText className="h-4 w-4" /> },
                      { id: 'rate-limiting', label: 'Rate Limiting', icon: <Clock className="h-4 w-4" /> },
                      { id: 'data-models', label: 'Data Models', icon: <Database className="h-4 w-4" /> }
                    ].map(section => (
                      <div key={section.id} className="flex items-center space-x-2">
                        <Switch
                          id={section.id}
                          checked={summarySettings.focusSections.includes(section.id)}
                          onCheckedChange={(checked) => {
                            const newSections = checked
                              ? [...summarySettings.focusSections, section.id]
                              : summarySettings.focusSections.filter(s => s !== section.id)
                            updateSummarySettings('focusSections', newSections)
                          }}
                        />
                        <Label htmlFor={section.id} className="text-sm flex items-center gap-1">
                          {section.icon}
                          {section.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="format" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Custom Notes</Label>
                    <Textarea
                      placeholder="Add any custom notes or context for the summary..."
                      value={summarySettings.customNotes}
                      onChange={(e) => updateSummarySettings('customNotes', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-metadata"
                        checked={summarySettings.includeMetadata}
                        onCheckedChange={(checked) => updateSummarySettings('includeMetadata', checked)}
                      />
                      <Label htmlFor="include-metadata">Include Metadata</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-source-info"
                        checked={summarySettings.includeSourceInfo}
                        onCheckedChange={(checked) => updateSummarySettings('includeSourceInfo', checked)}
                      />
                      <Label htmlFor="include-source-info">Include Source Information</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-timestamp"
                        checked={summarySettings.includeTimestamp}
                        onCheckedChange={(checked) => updateSummarySettings('includeTimestamp', checked)}
                      />
                      <Label htmlFor="include-timestamp">Include Generation Timestamp</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="export" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Export Format</Label>
                      <Select value={exportSettings.format} onValueChange={(value: any) => updateExportSettings('format', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Document</SelectItem>
                          <SelectItem value="markdown">Markdown File</SelectItem>
                          <SelectItem value="html">HTML Document</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Watermark Text</Label>
                      <Input
                        placeholder="Optional watermark text"
                        value={exportSettings.watermark}
                        onChange={(e) => updateExportSettings('watermark', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-toc"
                        checked={exportSettings.includeTOC}
                        onCheckedChange={(checked) => updateExportSettings('includeTOC', checked)}
                      />
                      <Label htmlFor="include-toc">Include Table of Contents</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="password-protected"
                        checked={exportSettings.passwordProtected}
                        onCheckedChange={(checked) => updateExportSettings('passwordProtected', checked)}
                      />
                      <Label htmlFor="password-protected">Password Protect PDF</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-source-links"
                        checked={exportSettings.includeSourceLinks}
                        onCheckedChange={(checked) => updateExportSettings('includeSourceLinks', checked)}
                      />
                      <Label htmlFor="include-source-links">Include Source Links</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 mt-6">
              <Button onClick={() => setStep(1)} variant="outline">
                Back
              </Button>
              <Button onClick={summarizeDocs} disabled={loading}>
                {loading ? (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Documentation...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Summary
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && apiSummary && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">API Documentation Summary</h2>
              <p className="text-muted-foreground">
                {apiSummary.endpoints.length} endpoints • {summarySettings.type} • {summarySettings.language.toUpperCase()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={generatePDF}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(apiSummary, null, 2))
                  toast({ title: "Copied", description: "Summary copied to clipboard" })
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Summary
              </Button>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                New Summary
              </Button>
            </div>
          </div>

          <Card id="overview">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{apiSummary.overview}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
