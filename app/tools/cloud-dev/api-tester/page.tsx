"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Copy, Play, RotateCcw, Plus, Trash2, Settings, Clock, Repeat } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QueryParam {
  key: string
  value: string
}

interface PathParam {
  key: string
  value: string
}

interface AuthConfig {
  type: "none" | "bearer" | "apikey" | "basic"
  token?: string
  apiKey?: string
  username?: string
  password?: string
}

export default function ApiTesterPage() {
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState("GET")
  const [url, setUrl] = useState("")
  const [headers, setHeaders] = useState("")
  const [body, setBody] = useState("")
  const [bodyType, setBodyType] = useState("json")
  const [queryParams, setQueryParams] = useState<QueryParam[]>([{ key: "", value: "" }])
  const [pathParams, setPathParams] = useState<PathParam[]>([{ key: "", value: "" }])
  const [authConfig, setAuthConfig] = useState<AuthConfig>({ type: "none" })
  const [expectedStatus, setExpectedStatus] = useState("")
  const [expectedResponse, setExpectedResponse] = useState("")
  const [timeout, setTimeout] = useState("30")
  const [repetitions, setRepetitions] = useState("1")
  const [testDescription, setTestDescription] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [testResults, setTestResults] = useState<any[]>([])
  const { toast } = useToast()

  const buildUrl = () => {
    let finalUrl = url
    
    // Replace path parameters
    pathParams.forEach(param => {
      if (param.key && param.value) {
        finalUrl = finalUrl.replace(`:${param.key}`, param.value)
      }
    })
    
    // Add query parameters
    const validQueryParams = queryParams.filter(param => param.key && param.value)
    if (validQueryParams.length > 0) {
      const queryString = validQueryParams
        .map(param => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
        .join('&')
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + queryString
    }
    
    return finalUrl
  }

  const buildHeaders = () => {
    const headersObj: Record<string, string> = {}
    
    // Add custom headers
    if (headers) {
      try {
        const customHeaders = JSON.parse(headers)
        Object.assign(headersObj, customHeaders)
      } catch (e) {
        // If JSON parsing fails, treat as raw headers
        headers.split('\n').forEach(line => {
          const [key, ...valueParts] = line.split(':')
          if (key && valueParts.length > 0) {
            headersObj[key.trim()] = valueParts.join(':').trim()
          }
        })
      }
    }
    
    // Add authentication headers
    switch (authConfig.type) {
      case "bearer":
        if (authConfig.token) {
          headersObj["Authorization"] = `Bearer ${authConfig.token}`
        }
        break
      case "apikey":
        if (authConfig.apiKey) {
          headersObj["X-API-Key"] = authConfig.apiKey
        }
        break
      case "basic":
        if (authConfig.username && authConfig.password) {
          const credentials = btoa(`${authConfig.username}:${authConfig.password}`)
          headersObj["Authorization"] = `Basic ${credentials}`
        }
        break
    }
    
    // Set content type based on body type
    if (method !== "GET" && body) {
      switch (bodyType) {
        case "json":
          headersObj["Content-Type"] = "application/json"
          break
        case "xml":
          headersObj["Content-Type"] = "application/xml"
          break
        case "form":
          headersObj["Content-Type"] = "application/x-www-form-urlencoded"
          break
        case "text":
          headersObj["Content-Type"] = "text/plain"
          break
      }
    }
    
    return headersObj
  }

  const handleTest = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(3)
    setTestResults([])

    const finalUrl = buildUrl()
    const headersObj = buildHeaders()
    const timeoutMs = parseInt(timeout) * 1000

    try {
      const results = []
      const repetitionsCount = parseInt(repetitions) || 1

      for (let i = 0; i < repetitionsCount; i++) {
        const startTime = Date.now()
        
        const requestOptions: RequestInit = {
          method,
          headers: headersObj,
          signal: AbortSignal.timeout(timeoutMs),
        }

        if (method !== "GET" && body) {
          if (bodyType === "form") {
            // Convert JSON to form data
            try {
              const jsonData = JSON.parse(body)
              const formData = new URLSearchParams()
              Object.entries(jsonData).forEach(([key, value]) => {
                formData.append(key, String(value))
              })
              requestOptions.body = formData
            } catch {
              requestOptions.body = body
            }
          } else {
            requestOptions.body = body
          }
        }

        const res = await fetch(finalUrl, requestOptions)
        const endTime = Date.now()
        const responseTime = endTime - startTime
        const data = await res.text()

        const result = {
          attempt: i + 1,
          status: res.status,
          responseTime,
          data,
          headers: Object.fromEntries(res.headers.entries()),
          success: expectedStatus ? res.status.toString() === expectedStatus : res.status < 400,
          timestamp: new Date().toISOString()
        }

        results.push(result)
      }

      setTestResults(results)
      setResponse(results[results.length - 1].data)
      setResponseStatus(results[results.length - 1].status)
      setResponseTime(results[results.length - 1].responseTime)

      const successCount = results.filter(r => r.success).length
      toast({
        title: "Request completed",
        description: `${successCount}/${results.length} requests successful`,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setResponse(`Error: ${errorMessage}`)
      setResponseStatus(null)
      setResponseTime(null)
      toast({
        title: "Request failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addQueryParam = () => {
    setQueryParams([...queryParams, { key: "", value: "" }])
  }

  const removeQueryParam = (index: number) => {
    setQueryParams(queryParams.filter((_, i) => i !== index))
  }

  const updateQueryParam = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...queryParams]
    updated[index][field] = value
    setQueryParams(updated)
  }

  const addPathParam = () => {
    setPathParams([...pathParams, { key: "", value: "" }])
  }

  const removePathParam = (index: number) => {
    setPathParams(pathParams.filter((_, i) => i !== index))
  }

  const updatePathParam = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...pathParams]
    updated[index][field] = value
    setPathParams(updated)
  }

  const copyResponse = () => {
    navigator.clipboard.writeText(response)
    toast({
      title: "Copied",
      description: "Response copied to clipboard",
    })
  }

  const reset = () => {
    setStep(1)
    setUrl("")
    setHeaders("")
    setBody("")
    setBodyType("json")
    setQueryParams([{ key: "", value: "" }])
    setPathParams([{ key: "", value: "" }])
    setAuthConfig({ type: "none" })
    setExpectedStatus("")
    setExpectedResponse("")
    setTimeout("30")
    setRepetitions("1")
    setTestDescription("")
    setResponse("")
    setResponseStatus(null)
    setResponseTime(null)
    setTestResults([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Tester Pro</h1>
        <p className="text-muted-foreground">Comprehensive API testing with authentication, parameters, and validation</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant={step >= 1 ? "default" : "secondary"}>1. Basic Setup</Badge>
        <Badge variant={step >= 2 ? "default" : "secondary"}>2. Advanced Config</Badge>
        <Badge variant={step >= 3 ? "default" : "secondary"}>3. Test Results</Badge>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Basic Setup</CardTitle>
              <CardDescription>Configure your API endpoint and test details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Test Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="e.g., Test user creation endpoint"
                  value={testDescription}
                  onChange={(e) => setTestDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">API Endpoint URL</Label>
                <Input
                  id="url"
                  placeholder="https://api.example.com/users or https://api.example.com/users/:id"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use :paramName for path parameters (e.g., :id, :userId)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">HTTP Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="HEAD">HEAD</SelectItem>
                    <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setStep(2)} disabled={!url}>
                Next: Advanced Configuration
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <Tabs defaultValue="params" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="params">Parameters</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="auth">Authentication</TabsTrigger>
              <TabsTrigger value="body">Request Body</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
            </TabsList>

            <TabsContent value="params" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Path Parameters</CardTitle>
                  <CardDescription>Replace dynamic segments in your URL</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pathParams.map((param, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Parameter name (e.g., id)"
                        value={param.key}
                        onChange={(e) => updatePathParam(index, 'key', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={param.value}
                        onChange={(e) => updatePathParam(index, 'value', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removePathParam(index)}
                        disabled={pathParams.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addPathParam} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Path Parameter
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Query Parameters</CardTitle>
                  <CardDescription>Add query string parameters to your request</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {queryParams.map((param, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Parameter name (e.g., page)"
                        value={param.key}
                        onChange={(e) => updateQueryParam(index, 'key', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={param.value}
                        onChange={(e) => updateQueryParam(index, 'value', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeQueryParam(index)}
                        disabled={queryParams.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addQueryParam} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Query Parameter
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="headers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Headers</CardTitle>
                  <CardDescription>Add custom headers for your request</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="headers">Headers (JSON format or key:value pairs)</Label>
                    <Textarea
                      id="headers"
                      placeholder='{"Authorization": "Bearer token", "X-API-Key": "your-key"}\n\nOr use key:value format:\nContent-Type: application/json\nAccept: application/json'
                      value={headers}
                      onChange={(e) => setHeaders(e.target.value)}
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="auth" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                  <CardDescription>Configure authentication for your API request</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Authentication Type</Label>
                    <Select value={authConfig.type} onValueChange={(value: any) => setAuthConfig({ ...authConfig, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="bearer">Bearer Token</SelectItem>
                        <SelectItem value="apikey">API Key</SelectItem>
                        <SelectItem value="basic">Basic Auth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {authConfig.type === "bearer" && (
                    <div className="space-y-2">
                      <Label htmlFor="token">Bearer Token</Label>
                      <Input
                        id="token"
                        type="password"
                        placeholder="Enter your bearer token"
                        value={authConfig.token || ""}
                        onChange={(e) => setAuthConfig({ ...authConfig, token: e.target.value })}
                      />
                    </div>
                  )}

                  {authConfig.type === "apikey" && (
                    <div className="space-y-2">
                      <Label htmlFor="apikey">API Key</Label>
                      <Input
                        id="apikey"
                        type="password"
                        placeholder="Enter your API key"
                        value={authConfig.apiKey || ""}
                        onChange={(e) => setAuthConfig({ ...authConfig, apiKey: e.target.value })}
                      />
                    </div>
                  )}

                  {authConfig.type === "basic" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          placeholder="Enter username"
                          value={authConfig.username || ""}
                          onChange={(e) => setAuthConfig({ ...authConfig, username: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter password"
                          value={authConfig.password || ""}
                          onChange={(e) => setAuthConfig({ ...authConfig, password: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="body" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Request Body</CardTitle>
                  <CardDescription>Configure the request body for POST, PUT, PATCH requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Body Type</Label>
                    <Select value={bodyType} onValueChange={setBodyType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                        <SelectItem value="form">Form Data</SelectItem>
                        <SelectItem value="text">Plain Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body">Request Body</Label>
                    <Textarea
                      id="body"
                      placeholder={
                        bodyType === "json" 
                          ? '{"name": "John", "email": "john@example.com"}'
                          : bodyType === "xml"
                          ? '<user><name>John</name><email>john@example.com</email></user>'
                          : bodyType === "form"
                          ? 'name=John&email=john@example.com'
                          : 'Plain text content'
                      }
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={8}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="validation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Test Validation</CardTitle>
                  <CardDescription>Set expectations for response validation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedStatus">Expected Status Code</Label>
                    <Input
                      id="expectedStatus"
                      placeholder="e.g., 200, 201, 404"
                      value={expectedStatus}
                      onChange={(e) => setExpectedStatus(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedResponse">Expected Response Schema (Optional)</Label>
                    <Textarea
                      id="expectedResponse"
                      placeholder='{"id": "number", "name": "string", "email": "string"}'
                      value={expectedResponse}
                      onChange={(e) => setExpectedResponse(e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Configure timeout and repetition settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeout">Timeout (seconds)</Label>
                      <Input
                        id="timeout"
                        type="number"
                        placeholder="30"
                        value={timeout}
                        onChange={(e) => setTimeout(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="repetitions">Repetitions</Label>
                      <Input
                        id="repetitions"
                        type="number"
                        placeholder="1"
                        value={repetitions}
                        onChange={(e) => setRepetitions(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <Button onClick={() => setStep(1)} variant="outline">
              Back
            </Button>
            <Button onClick={handleTest} disabled={loading}>
              {loading ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Test
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Test Results</h2>
              {testDescription && (
                <p className="text-muted-foreground">{testDescription}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copyResponse}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Response
              </Button>
              <Button size="sm" variant="outline" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                New Test
              </Button>
            </div>
          </div>

          {/* Test Summary */}
          {testResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Test Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{testResults.length}</div>
                    <div className="text-sm text-muted-foreground">Total Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {testResults.filter(r => r.success).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {testResults.filter(r => !r.success).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(testResults.reduce((acc, r) => acc + r.responseTime, 0) / testResults.length)}ms
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Individual Test Results */}
          {testResults.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Individual Test Results</CardTitle>
                <CardDescription>Results for each repetition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant={result.success ? "default" : "destructive"}>
                          Attempt {result.attempt}
                        </Badge>
                        <Badge variant={result.status < 400 ? "default" : "destructive"}>
                          {result.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {result.responseTime}ms
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Response */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  API Response
                  {responseStatus && (
                    <Badge variant={responseStatus < 400 ? "default" : "destructive"}>
                      {responseStatus}
                    </Badge>
                  )}
                  {responseTime && (
                    <Badge variant="outline">
                      <Clock className="mr-1 h-3 w-3" />
                      {responseTime}ms
                    </Badge>
                  )}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyResponse}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                {buildUrl()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="formatted" className="w-full">
                <TabsList>
                  <TabsTrigger value="formatted">Formatted</TabsTrigger>
                  <TabsTrigger value="raw">Raw</TabsTrigger>
                  <TabsTrigger value="headers">Response Headers</TabsTrigger>
                </TabsList>
                <TabsContent value="formatted">
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-auto max-h-96">
                      {response ? (() => {
                        try {
                          return JSON.stringify(JSON.parse(response), null, 2)
                        } catch {
                          return response
                        }
                      })() : "No response yet"}
                    </pre>
                  </div>
                </TabsContent>
                <TabsContent value="raw">
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-auto max-h-96">{response || "No response yet"}</pre>
                  </div>
                </TabsContent>
                <TabsContent value="headers">
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-auto max-h-96">
                      {testResults.length > 0 ? JSON.stringify(testResults[testResults.length - 1].headers, null, 2) : "No headers available"}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Validation Results */}
          {(expectedStatus || expectedResponse) && (
            <Card>
              <CardHeader>
                <CardTitle>Validation Results</CardTitle>
                <CardDescription>Checking against expected values</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {expectedStatus && (
                  <div className="flex items-center justify-between">
                    <span>Expected Status Code: {expectedStatus}</span>
                    <Badge variant={responseStatus?.toString() === expectedStatus ? "default" : "destructive"}>
                      {responseStatus?.toString() === expectedStatus ? "✓ Pass" : "✗ Fail"}
                    </Badge>
                  </div>
                )}
                {expectedResponse && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Response Schema Validation</span>
                      <Badge variant="secondary">Manual Review Required</Badge>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Expected Schema:</p>
                      <pre className="text-xs">{expectedResponse}</pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
