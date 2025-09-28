"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { 
  Calculator, 
  RotateCcw, 
  Download, 
  Cloud, 
  Server, 
  Database, 
  Network, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  FileText,
  BarChart3,
  Settings,
  Plus,
  Trash2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ResourceConfiguration {
  id: string
  name: string
  type: 'compute' | 'storage' | 'network' | 'managed'
  provider: string
  region: string
  pricingModel: 'on-demand' | 'reserved' | 'spot'
  configuration: any
  usage: any
}

interface CostEstimate {
  total: number
  breakdown: {
    compute: number
    storage: number
    network: number
    managed: number
  }
  savings: {
    reserved: number
    spot: number
    volume: number
  }
  recommendations: string[]
}

interface ScenarioAnalysis {
  name: string
  cost: number
  savings: number
  description: string
}

export default function CostEstimatorPage() {
  const [step, setStep] = useState(1)
  const [estimateName, setEstimateName] = useState("")
  const [estimateDescription, setEstimateDescription] = useState("")
  const [primaryProvider, setPrimaryProvider] = useState("")
  const [primaryRegion, setPrimaryRegion] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [sustainedUseDiscounts, setSustainedUseDiscounts] = useState(false)
  const [volumeDiscounts, setVolumeDiscounts] = useState(false)
  const [supportLevel, setSupportLevel] = useState("basic")
  const [complianceFeatures, setComplianceFeatures] = useState<string[]>([])
  const [backupSettings, setBackupSettings] = useState("standard")
  const [failoverRegions, setFailoverRegions] = useState<string[]>([])
  const [resourceConfigs, setResourceConfigs] = useState<ResourceConfiguration[]>([])
  const [scenarios, setScenarios] = useState<ScenarioAnalysis[]>([])
  const [estimates, setEstimates] = useState<Record<string, CostEstimate>>({})
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const addResourceConfig = (type: 'compute' | 'storage' | 'network' | 'managed') => {
    const newConfig: ResourceConfiguration = {
      id: Date.now().toString(),
      name: `${type} resource`,
      type,
      provider: primaryProvider,
      region: primaryRegion,
      pricingModel: 'on-demand',
      configuration: {},
      usage: {}
    }
    setResourceConfigs([...resourceConfigs, newConfig])
  }

  const removeResourceConfig = (id: string) => {
    setResourceConfigs(resourceConfigs.filter(config => config.id !== id))
  }

  const updateResourceConfig = (id: string, updates: Partial<ResourceConfiguration>) => {
    setResourceConfigs(resourceConfigs.map(config => 
      config.id === id ? { ...config, ...updates } : config
    ))
  }

  const generatePDF = async () => {
    try {
      // Import jsPDF dynamically
      const jsPDF = (await import('jspdf')).default

      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      let yPosition = 20

      // Helper function to add text with word wrap
      const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
        pdf.setFontSize(fontSize)
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
        
        const lines = pdf.splitTextToSize(text, pageWidth - 40)
        pdf.text(lines, 20, yPosition)
        yPosition += lines.length * fontSize * 0.4 + 5
        
        // Check if we need a new page
        if (yPosition > pageHeight - 20) {
          pdf.addPage()
          yPosition = 20
        }
      }

      // Helper function to add a line
      const addLine = () => {
        pdf.setLineWidth(0.5)
        pdf.line(20, yPosition, pageWidth - 20, yPosition)
        yPosition += 10
      }

      // Title
      addText('Cloud Cost Estimation Report', 20, true)
      addText(`Generated on: ${new Date().toLocaleDateString()}`, 10)
      addLine()

      // Project Details
      addText('Project Details', 16, true)
      addText(`Name: ${estimateName || 'Unnamed Estimate'}`, 12)
      if (estimateDescription) {
        addText(`Description: ${estimateDescription}`, 12)
      }
      addText(`Primary Provider: ${primaryProvider.toUpperCase()}`, 12)
      addText(`Region: ${primaryRegion}`, 12)
      addText(`Currency: ${currency}`, 12)
      addLine()

      // Cost Summary
      addText('Cost Summary', 16, true)
      Object.entries(estimates).forEach(([provider, estimate]) => {
        addText(`${provider.toUpperCase()}: ${currency} ${estimate.total.toLocaleString()}/month`, 14, true)
      })
      addLine()

      // Cost Breakdown
      addText('Cost Breakdown by Service', 16, true)
      Object.entries(estimates).forEach(([provider, estimate]) => {
        addText(`${provider.toUpperCase()}:`, 12, true)
        addText(`  Compute: ${currency} ${estimate.breakdown.compute}`, 10)
        addText(`  Storage: ${currency} ${estimate.breakdown.storage}`, 10)
        addText(`  Network: ${currency} ${estimate.breakdown.network}`, 10)
        addText(`  Managed Services: ${currency} ${estimate.breakdown.managed}`, 10)
        addText('', 10)
      })
      addLine()

      // Scenario Analysis
      if (scenarios.length > 0) {
        addText('Scenario Analysis', 16, true)
        scenarios.forEach(scenario => {
          addText(`${scenario.name}: ${currency} ${scenario.cost.toLocaleString()}`, 12, true)
          addText(`  ${scenario.description}`, 10)
          if (scenario.savings > 0) {
            addText(`  Potential Savings: ${currency} ${scenario.savings.toLocaleString()}`, 10)
          }
          addText('', 10)
        })
        addLine()
      }

      // Savings Recommendations
      addText('Savings Recommendations', 16, true)
      Object.entries(estimates).forEach(([provider, estimate]) => {
        addText(`${provider.toUpperCase()}:`, 12, true)
        estimate.recommendations.forEach(recommendation => {
          addText(`  • ${recommendation}`, 10)
        })
        addText('', 10)
      })
      addLine()

      // Resource Configuration
      addText('Resource Configuration', 16, true)
      addText(`Total Resources: ${resourceConfigs.length}`, 12)
      addText(`Sustained Use Discounts: ${sustainedUseDiscounts ? 'Enabled' : 'Disabled'}`, 12)
      addText(`Volume Discounts: ${volumeDiscounts ? 'Enabled' : 'Disabled'}`, 12)
      addText(`Support Level: ${supportLevel}`, 12)
      addText(`Backup Settings: ${backupSettings}`, 12)
      
      if (resourceConfigs.length > 0) {
        addText('', 10)
        addText('Configured Resources:', 12, true)
        resourceConfigs.forEach((config, index) => {
          addText(`${index + 1}. ${config.name}`, 10, true)
          addText(`   Type: ${config.type}`, 10)
          addText(`   Pricing: ${config.pricingModel}`, 10)
          addText('', 10)
        })
      }

      // Footer
      const totalPages = pdf.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10)
        pdf.text('Cloud Cost Estimator Pro', 20, pageHeight - 10)
      }

      // Download the PDF
      const fileName = `cloud-cost-estimate-${estimateName || 'report'}-${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)

      toast({
        title: "PDF Generated",
        description: "Cost estimate report downloaded as PDF",
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

  const calculateCosts = async () => {
    if (!primaryProvider || resourceConfigs.length === 0) {
      toast({
        title: "Error",
        description: "Please select a provider and add at least one resource configuration",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(3)

    // Simulate comprehensive cost calculation
    await new Promise(resolve => {
      setTimeout(() => {
        const mockEstimates: Record<string, CostEstimate> = {
          aws: {
            total: 2450,
            breakdown: {
              compute: 1200,
              storage: 450,
              network: 300,
              managed: 500
            },
            savings: {
              reserved: 360,
              spot: 600,
              volume: 120
            },
            recommendations: [
              "Consider Reserved Instances for 30% savings on compute",
              "Use Spot Instances for non-critical workloads",
              "Enable S3 Intelligent Tiering for storage optimization"
            ]
          },
          gcp: {
            total: 2180,
            breakdown: {
              compute: 1100,
              storage: 380,
              network: 250,
              managed: 450
            },
            savings: {
              reserved: 330,
              spot: 550,
              volume: 100
            },
            recommendations: [
              "Use Committed Use Discounts for predictable workloads",
              "Enable Preemptible VMs for batch processing",
              "Implement Cloud Storage lifecycle policies"
            ]
          },
          azure: {
            total: 2650,
            breakdown: {
              compute: 1300,
              storage: 500,
              network: 350,
              managed: 500
            },
            savings: {
              reserved: 390,
              spot: 650,
              volume: 130
            },
            recommendations: [
              "Use Reserved Instances for 1-year or 3-year commitments",
              "Consider Spot VMs for development environments",
              "Enable Azure Cost Management for monitoring"
            ]
          }
        }

        const mockScenarios: ScenarioAnalysis[] = [
          {
            name: "Current Configuration",
            cost: mockEstimates[primaryProvider.toLowerCase()]?.total || 0,
            savings: 0,
            description: "Baseline estimate with current settings"
          },
          {
            name: "With Reserved Instances",
            cost: (mockEstimates[primaryProvider.toLowerCase()]?.total || 0) - (mockEstimates[primaryProvider.toLowerCase()]?.savings.reserved || 0),
            savings: mockEstimates[primaryProvider.toLowerCase()]?.savings.reserved || 0,
            description: "30% savings with 1-year reserved instances"
          },
          {
            name: "Hybrid Spot/Reserved",
            cost: (mockEstimates[primaryProvider.toLowerCase()]?.total || 0) - (mockEstimates[primaryProvider.toLowerCase()]?.savings.spot || 0) * 0.6,
            savings: (mockEstimates[primaryProvider.toLowerCase()]?.savings.spot || 0) * 0.6,
            description: "60% spot instances for non-critical workloads"
          }
        ]

        setEstimates(mockEstimates)
        setScenarios(mockScenarios)
        setLoading(false)
        toast({
          title: "Cost Estimates Generated",
          description: "Comprehensive cost analysis completed",
        })
        resolve(undefined)
      }, 3000)
    })
  }

  const reset = () => {
    setStep(1)
    setEstimateName("")
    setEstimateDescription("")
    setPrimaryProvider("")
    setPrimaryRegion("")
    setCurrency("USD")
    setSustainedUseDiscounts(false)
    setVolumeDiscounts(false)
    setSupportLevel("basic")
    setComplianceFeatures([])
    setBackupSettings("standard")
    setFailoverRegions([])
    setResourceConfigs([])
    setScenarios([])
    setEstimates({})
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cloud Cost Estimator Pro</h1>
        <p className="text-muted-foreground">Comprehensive cloud cost estimation with detailed breakdowns, scenario analysis, and PDF export</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant={step >= 1 ? "default" : "secondary"}>1. Basic Setup</Badge>
        <Badge variant={step >= 2 ? "default" : "secondary"}>2. Resources</Badge>
        <Badge variant={step >= 3 ? "default" : "secondary"}>3. Analysis</Badge>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Basic Setup</CardTitle>
              <CardDescription>Configure your cloud cost estimation project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="estimateName">Estimate Name</Label>
                <Input
                  id="estimateName"
                  placeholder="e.g., Production Environment Q1 2024"
                  value={estimateName}
                  onChange={(e) => setEstimateName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimateDescription">Description (Optional)</Label>
                <Textarea
                  id="estimateDescription"
                  placeholder="Describe your project, use case, or any specific requirements..."
                  value={estimateDescription}
                  onChange={(e) => setEstimateDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryProvider">Primary Cloud Provider</Label>
                  <Select value={primaryProvider} onValueChange={setPrimaryProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aws">Amazon Web Services (AWS)</SelectItem>
                      <SelectItem value="gcp">Google Cloud Platform (GCP)</SelectItem>
                      <SelectItem value="azure">Microsoft Azure</SelectItem>
                      <SelectItem value="oracle">Oracle Cloud Infrastructure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryRegion">Primary Region</Label>
                  <Select value={primaryRegion} onValueChange={setPrimaryRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                      <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                      <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                      <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                      <SelectItem value="us-central1">US Central (Iowa)</SelectItem>
                      <SelectItem value="europe-west1">Europe (Belgium)</SelectItem>
                      <SelectItem value="eastus">East US</SelectItem>
                      <SelectItem value="westeurope">West Europe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => setStep(2)} disabled={!primaryProvider || !primaryRegion}>
                Next: Configure Resources
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <Tabs defaultValue="resources" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Resource Configurations
                  </CardTitle>
                  <CardDescription>
                    Add and configure your cloud resources
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => addResourceConfig('compute')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Compute
                    </Button>
                    <Button variant="outline" onClick={() => addResourceConfig('storage')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Storage
                    </Button>
                    <Button variant="outline" onClick={() => addResourceConfig('network')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Network
                    </Button>
                    <Button variant="outline" onClick={() => addResourceConfig('managed')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Managed Service
                    </Button>
                  </div>

                  {resourceConfigs.map((config) => (
                    <Card key={config.id} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{config.name}</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeResourceConfig(config.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{config.type}</Badge>
                          <Badge variant="secondary">{config.provider}</Badge>
                          <Badge variant="secondary">{config.region}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Resource Name</Label>
                            <Input
                              value={config.name}
                              onChange={(e) => updateResourceConfig(config.id, { name: e.target.value })}
                              placeholder="e.g., Web Server, Database Storage"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Pricing Model</Label>
                            <Select
                              value={config.pricingModel}
                              onValueChange={(value: any) => updateResourceConfig(config.id, { pricingModel: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="on-demand">On-Demand</SelectItem>
                                <SelectItem value="reserved">Reserved (1-3 years)</SelectItem>
                                <SelectItem value="spot">Spot/Auction</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {resourceConfigs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No resources configured yet</p>
                      <p className="text-sm">Add your first resource to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Pricing & Discounts
                  </CardTitle>
                  <CardDescription>
                    Configure pricing models and discount options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Sustained Use Discounts</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatic discounts for continuous usage
                        </p>
                      </div>
                      <Switch
                        checked={sustainedUseDiscounts}
                        onCheckedChange={setSustainedUseDiscounts}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Volume Discounts</Label>
                        <p className="text-sm text-muted-foreground">
                          Tiered pricing for high-volume usage
                        </p>
                      </div>
                      <Switch
                        checked={volumeDiscounts}
                        onCheckedChange={setVolumeDiscounts}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Usage Patterns
                  </CardTitle>
                  <CardDescription>
                    Define your expected usage patterns and utilization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Daily Usage Hours</Label>
                      <Input type="number" placeholder="24" defaultValue="24" />
                      <p className="text-xs text-muted-foreground">Hours per day resources are active</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Monthly Usage Days</Label>
                      <Input type="number" placeholder="30" defaultValue="30" />
                      <p className="text-xs text-muted-foreground">Days per month resources are used</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Expected Utilization (%)</Label>
                    <Slider defaultValue={[70]} max={100} min={10} step={10} className="w-full" />
                    <p className="text-xs text-muted-foreground">Average resource utilization percentage</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Advanced Options
                  </CardTitle>
                  <CardDescription>
                    Additional configuration options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Support Level</Label>
                    <Select value={supportLevel} onValueChange={setSupportLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic Support</SelectItem>
                        <SelectItem value="developer">Developer Support</SelectItem>
                        <SelectItem value="business">Business Support</SelectItem>
                        <SelectItem value="enterprise">Enterprise Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Backup Settings</Label>
                    <Select value={backupSettings} onValueChange={setBackupSettings}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic Backup</SelectItem>
                        <SelectItem value="standard">Standard Backup</SelectItem>
                        <SelectItem value="premium">Premium Backup</SelectItem>
                        <SelectItem value="enterprise">Enterprise Backup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Compliance Features</Label>
                    <div className="space-y-2">
                      {['SOC 2', 'HIPAA', 'PCI DSS', 'GDPR', 'ISO 27001'].map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox
                            id={feature}
                            checked={complianceFeatures.includes(feature)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setComplianceFeatures([...complianceFeatures, feature])
                              } else {
                                setComplianceFeatures(complianceFeatures.filter(f => f !== feature))
                              }
                            }}
                          />
                          <Label htmlFor={feature} className="text-sm">{feature}</Label>
                        </div>
                      ))}
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
            <Button onClick={calculateCosts} disabled={loading || resourceConfigs.length === 0}>
              {loading ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Costs
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {step === 3 && Object.keys(estimates).length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Cost Analysis & Estimates</h2>
              {estimateName && (
                <p className="text-muted-foreground">{estimateName}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={generatePDF}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                New Estimate
              </Button>
            </div>
          </div>

          {/* Total Cost Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Total Estimated Monthly Cost
              </CardTitle>
              <CardDescription>
                Comparison across major cloud providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(estimates).map(([provider, estimate]) => (
                  <div key={provider} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {currency} {estimate.total.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {provider} / month
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Cost Breakdown by Service
              </CardTitle>
              <CardDescription>
                Detailed cost analysis by service type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(estimates).map(([provider, estimate]) => (
                  <div key={provider} className="space-y-3">
                    <h4 className="font-medium capitalize">{provider}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Compute:</span>
                        <span>{currency} {estimate.breakdown.compute}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage:</span>
                        <span>{currency} {estimate.breakdown.storage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network:</span>
                        <span>{currency} {estimate.breakdown.network}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Managed Services:</span>
                        <span>{currency} {estimate.breakdown.managed}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>{currency} {estimate.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scenario Analysis */}
          {scenarios.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Scenario Analysis
                </CardTitle>
                <CardDescription>
                  Compare different pricing strategies and configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scenarios.map((scenario, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{scenario.name}</h4>
                        <p className="text-sm text-muted-foreground">{scenario.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {currency} {scenario.cost.toLocaleString()}
                        </div>
                        {scenario.savings > 0 && (
                          <div className="text-sm text-green-600">
                            Save {currency} {scenario.savings.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Savings Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Savings & Optimization Recommendations
              </CardTitle>
              <CardDescription>
                Potential cost savings and optimization opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(estimates).map(([provider, estimate]) => (
                  <div key={provider} className="space-y-3">
                    <h4 className="font-medium capitalize">{provider}</h4>
                    <div className="space-y-2">
                      {estimate.recommendations.map((recommendation, index) => (
                        <Alert key={index}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            {recommendation}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Reserved Savings:</span>
                          <span className="text-green-600">{currency} {estimate.savings.reserved}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spot Savings:</span>
                          <span className="text-green-600">{currency} {estimate.savings.spot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Volume Savings:</span>
                          <span className="text-green-600">{currency} {estimate.savings.volume}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configuration Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Configuration Summary
              </CardTitle>
              <CardDescription>
                Complete overview of your cost estimation inputs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Project Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {estimateName || 'Unnamed Estimate'}</div>
                    <div><strong>Provider:</strong> {primaryProvider}</div>
                    <div><strong>Region:</strong> {primaryRegion}</div>
                    <div><strong>Currency:</strong> {currency}</div>
                    {estimateDescription && (
                      <div><strong>Description:</strong> {estimateDescription}</div>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Resource Configuration</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Total Resources:</strong> {resourceConfigs.length}</div>
                    <div><strong>Sustained Use:</strong> {sustainedUseDiscounts ? 'Enabled' : 'Disabled'}</div>
                    <div><strong>Volume Discounts:</strong> {volumeDiscounts ? 'Enabled' : 'Disabled'}</div>
                    <div><strong>Support Level:</strong> {supportLevel}</div>
                    <div><strong>Backup:</strong> {backupSettings}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
