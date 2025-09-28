"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Wand2, RotateCcw, Database, Shield, AlertTriangle, CheckCircle, XCircle, Eye, Play, Edit, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SchemaTable {
  name: string
  columns: Array<{
    name: string
    type: string
    nullable: boolean
    primaryKey: boolean
  }>
}

interface QueryResult {
  columns: string[]
  rows: any[]
  rowCount: number
  executionTime: number
}

interface OptimizationNote {
  type: 'warning' | 'info' | 'error' | 'success'
  message: string
  suggestion?: string
}

export default function SqlAssistantPage() {
  const [step, setStep] = useState(1)
  const [database, setDatabase] = useState("")
  const [naturalQuery, setNaturalQuery] = useState("")
  const [queryType, setQueryType] = useState("")
  const [schemaMetadata, setSchemaMetadata] = useState("")
  const [availableTables, setAvailableTables] = useState<SchemaTable[]>([])
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [executionPermission, setExecutionPermission] = useState(false)
  const [resultLimit, setResultLimit] = useState("100")
  const [privacyCompliance, setPrivacyCompliance] = useState(false)
  const [timeout, setTimeout] = useState("30")
  const [queryComments, setQueryComments] = useState("")
  const [sqlQuery, setSqlQuery] = useState("")
  const [optimizationNotes, setOptimizationNotes] = useState<OptimizationNote[]>([])
  const [complianceWarnings, setComplianceWarnings] = useState<string[]>([])
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null)
  const [usedTables, setUsedTables] = useState<string[]>([])
  const [usedColumns, setUsedColumns] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [executionError, setExecutionError] = useState("")
  const { toast } = useToast()

  const parseSchemaMetadata = (metadata: string) => {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(metadata)
      if (Array.isArray(parsed)) {
        setAvailableTables(parsed)
        return
      }
    } catch {
      // If JSON parsing fails, try to parse as SQL DDL
      const tables: SchemaTable[] = []
      const lines = metadata.split('\n')
      let currentTable: SchemaTable | null = null
      
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('CREATE TABLE') || trimmed.startsWith('create table')) {
          const tableName = trimmed.match(/table\s+(\w+)/i)?.[1]
          if (tableName) {
            currentTable = { name: tableName, columns: [] }
            tables.push(currentTable)
          }
        } else if (currentTable && trimmed.includes('(') && !trimmed.includes(')')) {
          const columnMatch = trimmed.match(/(\w+)\s+(\w+)(?:\s+(NOT\s+NULL|PRIMARY\s+KEY|UNIQUE))?/i)
          if (columnMatch) {
            const [, name, type, constraint] = columnMatch
            currentTable.columns.push({
              name,
              type,
              nullable: !constraint?.includes('NOT NULL'),
              primaryKey: constraint?.includes('PRIMARY KEY') || false
            })
          }
        }
      }
      
      setAvailableTables(tables)
    }
  }

  const analyzeSQLQuery = (query: string): OptimizationNote[] => {
    const notes: OptimizationNote[] = []
    const upperQuery = query.toUpperCase()
    
    // Check for missing WHERE clause on DELETE/UPDATE
    if (upperQuery.includes('DELETE FROM') && !upperQuery.includes('WHERE')) {
      notes.push({
        type: 'error',
        message: 'DELETE statement without WHERE clause',
        suggestion: 'Add a WHERE clause to prevent deleting all records'
      })
    }
    
    if (upperQuery.includes('UPDATE') && !upperQuery.includes('WHERE')) {
      notes.push({
        type: 'error',
        message: 'UPDATE statement without WHERE clause',
        suggestion: 'Add a WHERE clause to prevent updating all records'
      })
    }
    
    // Check for SELECT * without LIMIT
    if (upperQuery.includes('SELECT *') && !upperQuery.includes('LIMIT')) {
      notes.push({
        type: 'warning',
        message: 'SELECT * without LIMIT clause',
        suggestion: 'Consider adding LIMIT or selecting specific columns for better performance'
      })
    }
    
    // Check for missing indexes hints
    if (upperQuery.includes('WHERE') && !upperQuery.includes('INDEX')) {
      notes.push({
        type: 'info',
        message: 'Query uses WHERE clause',
        suggestion: 'Ensure appropriate indexes exist on filtered columns'
      })
    }
    
    // Check for JOIN without ON clause
    if (upperQuery.includes('JOIN') && !upperQuery.includes('ON')) {
      notes.push({
        type: 'error',
        message: 'JOIN without ON clause',
        suggestion: 'Add proper JOIN conditions to avoid Cartesian products'
      })
    }
    
    // Check for ORDER BY without LIMIT
    if (upperQuery.includes('ORDER BY') && !upperQuery.includes('LIMIT')) {
      notes.push({
        type: 'warning',
        message: 'ORDER BY without LIMIT',
        suggestion: 'Consider adding LIMIT to prevent sorting large result sets'
      })
    }
    
    return notes
  }

  const checkComplianceWarnings = (query: string): string[] => {
    const warnings: string[] = []
    const upperQuery = query.toUpperCase()
    
    // Check for potential PII access
    const piiColumns = ['EMAIL', 'PHONE', 'SSN', 'PASSWORD', 'CREDIT_CARD', 'BANK_ACCOUNT']
    piiColumns.forEach(column => {
      if (upperQuery.includes(column)) {
        warnings.push(`Query may access sensitive data: ${column}`)
      }
    })
    
    // Check for bulk operations
    if (upperQuery.includes('DELETE FROM') || upperQuery.includes('UPDATE')) {
      warnings.push('Query performs data modification - ensure proper permissions')
    }
    
    // Check for data export patterns
    if (upperQuery.includes('SELECT') && !upperQuery.includes('LIMIT')) {
      warnings.push('Query may return large datasets - consider data export policies')
    }
    
    return warnings
  }

  const extractUsedTablesAndColumns = (query: string) => {
    const upperQuery = query.toUpperCase()
    const tables: string[] = []
    const columns: string[] = []
    
    // Extract table names from FROM and JOIN clauses
    const tableMatches = upperQuery.match(/(?:FROM|JOIN)\s+(\w+)/g)
    if (tableMatches) {
      tableMatches.forEach(match => {
        const tableName = match.split(/\s+/).pop()
        if (tableName) tables.push(tableName)
      })
    }
    
    // Extract column names (simplified)
    const columnMatches = upperQuery.match(/\b[A-Z_]+\b/g)
    if (columnMatches) {
      columnMatches.forEach(match => {
        if (match.length > 2 && !['SELECT', 'FROM', 'WHERE', 'ORDER', 'GROUP', 'HAVING', 'LIMIT'].includes(match)) {
          columns.push(match)
        }
      })
    }
    
    setUsedTables([...new Set(tables)])
    setUsedColumns([...new Set(columns)])
  }

  const generateSQL = async () => {
    if (!naturalQuery || !database) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(3)

    // Simulate AI SQL generation with enhanced features
    await new Promise(resolve => {
      setTimeout(() => {
        const mockSQL = `-- Generated SQL for ${database}
-- Query: ${naturalQuery}
-- Generated at: ${new Date().toLocaleString()}
${queryComments ? `-- Comments: ${queryComments}` : ''}

SELECT 
  u.id,
  u.name,
  u.email,
  COUNT(o.id) as order_count,
  SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT ${resultLimit};`

        setSqlQuery(mockSQL)
        
        // Analyze the generated SQL
        const notes = analyzeSQLQuery(mockSQL)
        setOptimizationNotes(notes)
        
        // Check compliance warnings
        const warnings = checkComplianceWarnings(mockSQL)
        setComplianceWarnings(warnings)
        
        // Extract used tables and columns
        extractUsedTablesAndColumns(mockSQL)
        
        setLoading(false)
        toast({
          title: "SQL Generated",
          description: "Query generated with safety analysis",
        })
        resolve(undefined)
      }, 2000)
    })
  }

  const executeQuery = async () => {
    if (!executionPermission) {
      toast({
        title: "Execution Blocked",
        description: "Enable execution permission to run queries",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setExecutionError("")

    // Simulate query execution
    await new Promise(resolve => {
      setTimeout(() => {
        const mockResult: QueryResult = {
          columns: ['id', 'name', 'email', 'order_count', 'total_spent'],
          rows: [
            [1, 'John Doe', 'john@example.com', 5, 1250.00],
            [2, 'Jane Smith', 'jane@example.com', 3, 890.50],
            [3, 'Bob Johnson', 'bob@example.com', 7, 2100.75]
          ],
          rowCount: 3,
          executionTime: 45
        }

        setQueryResult(mockResult)
        setLoading(false)
        toast({
          title: "Query Executed",
          description: `Retrieved ${mockResult.rowCount} rows in ${mockResult.executionTime}ms`,
        })
        resolve(undefined)
      }, 1500)
    })
  }

  const copySQL = () => {
    navigator.clipboard.writeText(sqlQuery)
    toast({
      title: "Copied",
      description: "SQL query copied to clipboard",
    })
  }

  const reset = () => {
    setStep(1)
    setNaturalQuery("")
    setQueryType("")
    setSchemaMetadata("")
    setAvailableTables([])
    setSelectedTables([])
    setExecutionPermission(false)
    setResultLimit("100")
    setPrivacyCompliance(false)
    setTimeout("30")
    setQueryComments("")
    setSqlQuery("")
    setOptimizationNotes([])
    setComplianceWarnings([])
    setQueryResult(null)
    setUsedTables([])
    setUsedColumns([])
    setExecutionError("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SQL Query Assistant Pro</h1>
        <p className="text-muted-foreground">Advanced SQL generation with safety analysis, schema awareness, and compliance checking</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant={step >= 1 ? "default" : "secondary"}>1. Database & Query</Badge>
        <Badge variant={step >= 2 ? "default" : "secondary"}>2. Schema & Safety</Badge>
        <Badge variant={step >= 3 ? "default" : "secondary"}>3. Results & Analysis</Badge>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Database & Query Configuration</CardTitle>
              <CardDescription>Select your database platform and describe your query in natural language</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="database">Database Platform</Label>
                <Select value={database} onValueChange={setDatabase}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select database type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supabase">Supabase (PostgreSQL)</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                    <SelectItem value="sqlserver">SQL Server</SelectItem>
                    <SelectItem value="oracle">Oracle</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="queryType">Query Type (Optional)</Label>
                <Select value={queryType} onValueChange={setQueryType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select query intent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select">SELECT - Retrieve data</SelectItem>
                    <SelectItem value="insert">INSERT - Add new records</SelectItem>
                    <SelectItem value="update">UPDATE - Modify existing records</SelectItem>
                    <SelectItem value="delete">DELETE - Remove records</SelectItem>
                    <SelectItem value="create">CREATE - Create tables/structures</SelectItem>
                    <SelectItem value="alter">ALTER - Modify table structure</SelectItem>
                    <SelectItem value="drop">DROP - Remove tables/structures</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="naturalQuery">Natural Language Query Description</Label>
                <Textarea
                  id="naturalQuery"
                  placeholder="Find all users who made more than 5 orders in the last month, show their total spending and order count"
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Describe what data you want to retrieve or what operation you want to perform
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Query Comments/Tags (Optional)</Label>
                <Input
                  id="comments"
                  placeholder="e.g., Monthly sales report, Customer analysis"
                  value={queryComments}
                  onChange={(e) => setQueryComments(e.target.value)}
                />
              </div>

              <Button onClick={() => setStep(2)} disabled={!database || !naturalQuery}>
                Next: Schema & Safety Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <Tabs defaultValue="schema" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="schema">Schema</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="limits">Limits</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="schema" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Schema Metadata (Optional but Recommended)
                  </CardTitle>
                  <CardDescription>
                    Provide your database schema for more accurate SQL generation and to avoid hallucinated table/column names
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schemaMetadata">Schema Definition</Label>
                    <Textarea
                      id="schemaMetadata"
                      placeholder={`Paste your schema as JSON or SQL DDL:

JSON Format:
[
  {
    "name": "users",
    "columns": [
      {"name": "id", "type": "INTEGER", "nullable": false, "primaryKey": true},
      {"name": "name", "type": "VARCHAR(100)", "nullable": false, "primaryKey": false},
      {"name": "email", "type": "VARCHAR(255)", "nullable": false, "primaryKey": false}
    ]
  }
]

Or SQL DDL:
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL
);`}
                      value={schemaMetadata}
                      onChange={(e) => {
                        setSchemaMetadata(e.target.value)
                        parseSchemaMetadata(e.target.value)
                      }}
                      rows={12}
                    />
                  </div>

                  {availableTables.length > 0 && (
                    <div className="space-y-2">
                      <Label>Available Tables</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {availableTables.map((table) => (
                          <div key={table.name} className="border rounded-lg p-3">
                            <div className="font-medium">{table.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {table.columns.length} columns
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {table.columns.slice(0, 3).map(col => col.name).join(', ')}
                              {table.columns.length > 3 && '...'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="safety" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Safety & Compliance Settings
                  </CardTitle>
                  <CardDescription>
                    Configure safety measures and compliance checks for your SQL queries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Execution Permission</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow the generated query to be executed (adds safety step)
                        </p>
                      </div>
                      <Switch
                        checked={executionPermission}
                        onCheckedChange={setExecutionPermission}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Privacy/Compliance Restrictions</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable extra checks to avoid retrieving PII or sensitive data
                        </p>
                      </div>
                      <Switch
                        checked={privacyCompliance}
                        onCheckedChange={setPrivacyCompliance}
                      />
                    </div>
                  </div>

                  {privacyCompliance && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Privacy mode enabled. The system will flag queries that may access sensitive data like emails, phone numbers, or passwords.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="limits" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Query Limits & Performance</CardTitle>
                  <CardDescription>
                    Set limits to prevent accidental long-running queries and manage performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resultLimit">Result Limit</Label>
                    <Input
                      id="resultLimit"
                      type="number"
                      placeholder="100"
                      value={resultLimit}
                      onChange={(e) => setResultLimit(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum number of rows to return (prevents accidental large result sets)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeout">Query Timeout (seconds)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      placeholder="30"
                      value={timeout}
                      onChange={(e) => setTimeout(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum execution time before query is cancelled
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Options</CardTitle>
                  <CardDescription>
                    Additional configuration options for advanced users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="selectedTables">Specific Tables to Use (Optional)</Label>
                    <div className="space-y-2">
                      {availableTables.map((table) => (
                        <div key={table.name} className="flex items-center space-x-2">
                          <Checkbox
                            id={table.name}
                            checked={selectedTables.includes(table.name)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTables([...selectedTables, table.name])
                              } else {
                                setSelectedTables(selectedTables.filter(t => t !== table.name))
                              }
                            }}
                          />
                          <Label htmlFor={table.name} className="text-sm">
                            {table.name} ({table.columns.length} columns)
                          </Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Limit the query to specific tables only
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <Button onClick={() => setStep(1)} variant="outline">
              Back
            </Button>
            <Button onClick={generateSQL} disabled={loading}>
              {loading ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  Generating SQL...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate SQL
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
              <h2 className="text-2xl font-bold">SQL Query Results & Analysis</h2>
              {queryComments && (
                <p className="text-muted-foreground">{queryComments}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copySQL}>
                <Copy className="mr-2 h-4 w-4" />
                Copy SQL
              </Button>
              <Button size="sm" variant="outline" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                New Query
              </Button>
            </div>
          </div>

          {/* Generated SQL Query */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Generated SQL Query
                <Badge variant="outline">{database}</Badge>
              </CardTitle>
              <CardDescription>
                Optimized for {database} with safety analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm overflow-auto max-h-96">
                  <code>{sqlQuery}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Notes */}
          {optimizationNotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Query Analysis & Optimization Notes
                </CardTitle>
                <CardDescription>
                  Automated analysis of query efficiency and best practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {optimizationNotes.map((note, index) => (
                    <Alert key={index} variant={note.type === 'error' ? 'destructive' : 'default'}>
                      {note.type === 'error' && <XCircle className="h-4 w-4" />}
                      {note.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                      {note.type === 'info' && <Eye className="h-4 w-4" />}
                      {note.type === 'success' && <CheckCircle className="h-4 w-4" />}
                      <AlertDescription>
                        <div className="font-medium">{note.message}</div>
                        {note.suggestion && (
                          <div className="text-sm text-muted-foreground mt-1">
                            💡 {note.suggestion}
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Compliance Warnings */}
          {complianceWarnings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance & Privacy Warnings
                </CardTitle>
                <CardDescription>
                  Potential compliance and privacy concerns detected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {complianceWarnings.map((warning, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{warning}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Schema & Metadata Preview */}
          {(usedTables.length > 0 || usedColumns.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Schema & Metadata Preview
                </CardTitle>
                <CardDescription>
                  Tables and columns used in the generated query
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Tables Used</h4>
                    <div className="space-y-1">
                      {usedTables.map((table, index) => (
                        <Badge key={index} variant="outline" className="mr-2">
                          {table}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Columns Referenced</h4>
                    <div className="space-y-1">
                      {usedColumns.slice(0, 10).map((column, index) => (
                        <Badge key={index} variant="secondary" className="mr-2">
                          {column}
                        </Badge>
                      ))}
                      {usedColumns.length > 10 && (
                        <span className="text-sm text-muted-foreground">
                          +{usedColumns.length - 10} more...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Human-in-the-Loop Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Query Actions</CardTitle>
              <CardDescription>
                Choose how to proceed with the generated query
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={executeQuery} 
                  disabled={!executionPermission || loading}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {executionPermission ? 'Execute Query' : 'Enable Execution Permission'}
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Query
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </Button>
              </div>
              
              {!executionPermission && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Execution is disabled for safety. Enable execution permission in Step 2 to run queries.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Query Results */}
          {queryResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Query Results
                  <Badge variant="outline">
                    {queryResult.rowCount} rows in {queryResult.executionTime}ms
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        {queryResult.columns.map((column, index) => (
                          <th key={index} className="border border-border p-2 text-left font-medium">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell: any, cellIndex: number) => (
                            <td key={cellIndex} className="border border-border p-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Execution Error */}
          {executionError && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  Execution Error
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{executionError}</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
