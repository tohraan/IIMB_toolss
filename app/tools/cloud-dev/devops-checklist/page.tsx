"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  CheckSquare, 
  RotateCcw, 
  Download, 
  Users, 
  Settings, 
  Shield, 
  Monitor, 
  GitBranch, 
  Database, 
  FileText,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Copy,
  ExternalLink,
  BarChart3
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ChecklistItem {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'not-started' | 'in-progress' | 'completed'
  assignee?: string
  deadline?: string
  category: string
  bestPractices?: string[]
  resources?: string[]
}

interface TeamProfile {
  size: 'startup' | 'smb' | 'enterprise'
  maturity: 'beginner' | 'intermediate' | 'advanced'
  teamSize: number
}

interface DevOpsFocus {
  cicd: boolean
  infrastructure: boolean
  security: boolean
  testing: boolean
  monitoring: boolean
  releaseManagement: boolean
  collaboration: boolean
  automation: boolean
}

interface TechnologyStack {
  versionControl: string[]
  ciCd: string[]
  cloud: string[]
  containers: string[]
  monitoring: string[]
  databases: string[]
}

interface ComplianceStandards {
  gdpr: boolean
  soc2: boolean
  hipaa: boolean
  pci: boolean
  iso27001: boolean
  custom: string[]
}

interface PainPoints {
  deploymentSpeed: boolean
  reliability: boolean
  security: boolean
  monitoring: boolean
  collaboration: boolean
  automation: boolean
  scalability: boolean
  custom: string[]
}

interface ChecklistOutput {
  items: ChecklistItem[]
  recommendations: string[]
  priorities: string[]
  timeline: string
}

export default function DevOpsChecklistPage() {
  const [step, setStep] = useState(1)
  const [checklistName, setChecklistName] = useState("")
  const [checklistDescription, setChecklistDescription] = useState("")
  const [teamProfile, setTeamProfile] = useState<TeamProfile>({
    size: 'startup',
    maturity: 'beginner',
    teamSize: 5
  })
  const [devopsFocus, setDevopsFocus] = useState<DevOpsFocus>({
    cicd: true,
    infrastructure: true,
    security: true,
    testing: true,
    monitoring: true,
    releaseManagement: true,
    collaboration: true,
    automation: true
  })
  const [technologyStack, setTechnologyStack] = useState<TechnologyStack>({
    versionControl: [],
    ciCd: [],
    cloud: [],
    containers: [],
    monitoring: [],
    databases: []
  })
  const [complianceStandards, setComplianceStandards] = useState<ComplianceStandards>({
    gdpr: false,
    soc2: false,
    hipaa: false,
    pci: false,
    iso27001: false,
    custom: []
  })
  const [painPoints, setPainPoints] = useState<PainPoints>({
    deploymentSpeed: false,
    reliability: false,
    security: false,
    monitoring: false,
    collaboration: false,
    automation: false,
    scalability: false,
    custom: []
  })
  const [outputFormat, setOutputFormat] = useState<'task-list' | 'kanban' | 'roadmap' | 'report'>('task-list')
  const [enableCollaboration, setEnableCollaboration] = useState(false)
  const [teamMembers, setTeamMembers] = useState<string[]>([])
  const [checklistOutput, setChecklistOutput] = useState<ChecklistOutput | null>(null)
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const addTeamMember = (member: string) => {
    if (member && !teamMembers.includes(member)) {
      setTeamMembers([...teamMembers, member])
    }
  }

  const removeTeamMember = (member: string) => {
    setTeamMembers(teamMembers.filter(m => m !== member))
  }

  const updateDevopsFocus = (key: keyof DevOpsFocus, value: boolean) => {
    setDevopsFocus(prev => ({ ...prev, [key]: value }))
  }

  const updateTechnologyStack = (category: keyof TechnologyStack, tool: string, checked: boolean) => {
    setTechnologyStack(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category], tool]
        : prev[category].filter(t => t !== tool)
    }))
  }

  const updateComplianceStandards = (standard: keyof Omit<ComplianceStandards, 'custom'>, value: boolean) => {
    setComplianceStandards(prev => ({ ...prev, [standard]: value }))
  }

  const updatePainPoints = (point: keyof Omit<PainPoints, 'custom'>, value: boolean) => {
    setPainPoints(prev => ({ ...prev, [point]: value }))
  }

  const toggleTaskCompletion = (taskId: string) => {
    const newCompleted = new Set(completedTasks)
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId)
    } else {
      newCompleted.add(taskId)
    }
    setCompletedTasks(newCompleted)
  }

  const getProgressPercentage = () => {
    if (!checklistOutput || checklistOutput.items.length === 0) return 0
    return Math.round((completedTasks.size / checklistOutput.items.length) * 100)
  }

  const exportToNotion = () => {
    if (!checklistOutput) return

    let notionContent = `# ${checklistName || 'DevOps Checklist'}\n\n`
    
    if (checklistDescription) {
      notionContent += `${checklistDescription}\n\n`
    }

    notionContent += `## Project Details\n`
    notionContent += `- **Team Size**: ${teamProfile.size} (${teamProfile.teamSize} members)\n`
    notionContent += `- **Maturity Level**: ${teamProfile.maturity}\n`
    notionContent += `- **Generated**: ${new Date().toLocaleDateString()}\n\n`

    notionContent += `## Focus Areas\n`
    Object.entries(devopsFocus).forEach(([key, enabled]) => {
      if (enabled) {
        notionContent += `- [ ] ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}\n`
      }
    })
    notionContent += `\n`

    notionContent += `## Technology Stack\n`
    Object.entries(technologyStack).forEach(([category, tools]) => {
      if (tools.length > 0) {
        notionContent += `### ${category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}\n`
        tools.forEach(tool => {
          notionContent += `- ${tool}\n`
        })
        notionContent += `\n`
      }
    })

    notionContent += `## DevOps Checklist\n\n`
    
    const categories = [...new Set(checklistOutput.items.map(item => item.category))]
    categories.forEach(category => {
      notionContent += `### ${category}\n\n`
      checklistOutput.items
        .filter(item => item.category === category)
        .forEach(item => {
          const isCompleted = completedTasks.has(item.id)
          notionContent += `- [${isCompleted ? 'x' : ' '}] **${item.title}** (${item.priority})\n`
          if (item.description) {
            notionContent += `  - ${item.description}\n`
          }
          if (item.bestPractices && item.bestPractices.length > 0) {
            notionContent += `  - **Best Practices**:\n`
            item.bestPractices.forEach(practice => {
              notionContent += `    - ${practice}\n`
            })
          }
          if (enableCollaboration && teamMembers.length > 0) {
            notionContent += `  - **Assignee**: [Select team member]\n`
            notionContent += `  - **Deadline**: [Set deadline]\n`
          }
          notionContent += `\n`
        })
    })

    notionContent += `## Recommendations\n\n`
    checklistOutput.recommendations.forEach(rec => {
      notionContent += `- ${rec}\n`
    })
    notionContent += `\n`

    notionContent += `## Timeline\n`
    notionContent += `${checklistOutput.timeline}\n\n`

    notionContent += `---\n`
    notionContent += `*Generated by DevOps Checklist Builder Pro*\n`

    // Copy to clipboard
    navigator.clipboard.writeText(notionContent).then(() => {
      toast({
        title: "Notion Export Ready",
        description: "Checklist copied to clipboard. Paste into Notion to import.",
      })
    }).catch(() => {
      // Fallback: create downloadable file
      const blob = new Blob([notionContent], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `devops-checklist-${checklistName || 'notion'}.md`
      a.click()
      URL.revokeObjectURL(url)

      toast({
        title: "Notion Export Downloaded",
        description: "Markdown file downloaded. Import into Notion.",
      })
    })
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
      addText('DevOps Checklist Report', 20, true)
      addText(`Generated on: ${new Date().toLocaleDateString()}`, 10)
      addLine()

      // Project Details
      addText('Project Details', 16, true)
      addText(`Name: ${checklistName || 'Unnamed Checklist'}`, 12)
      if (checklistDescription) {
        addText(`Description: ${checklistDescription}`, 12)
      }
      addText(`Team Size: ${teamProfile.size} (${teamProfile.teamSize} members)`, 12)
      addText(`Maturity Level: ${teamProfile.maturity}`, 12)
      addLine()

      // Focus Areas
      addText('DevOps Focus Areas', 16, true)
      Object.entries(devopsFocus).forEach(([key, enabled]) => {
        if (enabled) {
          addText(`• ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`, 10)
        }
      })
      addLine()

      // Technology Stack
      addText('Technology Stack', 16, true)
      Object.entries(technologyStack).forEach(([category, tools]) => {
        if (tools.length > 0) {
          addText(`${category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:`, 12, true)
          tools.forEach(tool => {
            addText(`  • ${tool}`, 10)
          })
        }
      })
      addLine()

      // Checklist Items
      if (checklistOutput) {
        addText('DevOps Checklist Items', 16, true)
        const categories = [...new Set(checklistOutput.items.map(item => item.category))]
        categories.forEach(category => {
          addText(`${category}:`, 12, true)
          checklistOutput.items
            .filter(item => item.category === category)
            .forEach(item => {
              addText(`  • ${item.title}`, 10)
              if (item.description) {
                addText(`    ${item.description}`, 9)
              }
            })
        })
        addLine()

        // Recommendations
        if (checklistOutput.recommendations.length > 0) {
          addText('Recommendations', 16, true)
          checklistOutput.recommendations.forEach(rec => {
            addText(`• ${rec}`, 10)
          })
        }
      }

      // Footer
      const totalPages = pdf.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10)
        pdf.text('DevOps Checklist Builder Pro', 20, pageHeight - 10)
      }

      const fileName = `devops-checklist-${checklistName || 'report'}-${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)

      toast({
        title: "PDF Generated",
        description: "DevOps checklist report downloaded as PDF",
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

  const generateChecklist = async () => {
    setLoading(true)
    setStep(3)

    // Simulate comprehensive checklist generation
    await new Promise(resolve => {
      setTimeout(() => {
        const mockChecklist: ChecklistOutput = {
          items: [
            // CI/CD Items
            ...(devopsFocus.cicd ? [
              {
                id: 'cicd-1',
                title: 'Set up automated CI/CD pipeline',
                description: 'Implement continuous integration and deployment workflows',
                priority: 'high' as const,
                status: 'not-started' as const,
                category: 'CI/CD',
                bestPractices: ['Use infrastructure as code', 'Implement proper testing gates'],
                resources: ['Jenkins documentation', 'GitHub Actions guide']
              },
              {
                id: 'cicd-2',
                title: 'Configure automated testing',
                description: 'Set up unit, integration, and end-to-end tests',
                priority: 'high' as const,
                status: 'not-started' as const,
                category: 'CI/CD',
                bestPractices: ['Maintain test coverage > 80%', 'Use parallel test execution'],
                resources: ['Testing best practices', 'Test automation tools']
              }
            ] : []),
            
            // Infrastructure Items
            ...(devopsFocus.infrastructure ? [
              {
                id: 'infra-1',
                title: 'Implement Infrastructure as Code',
                description: 'Use tools like Terraform or CloudFormation for infrastructure management',
                priority: 'high' as const,
                status: 'not-started' as const,
                category: 'Infrastructure',
                bestPractices: ['Version control infrastructure', 'Use modular templates'],
                resources: ['Terraform documentation', 'CloudFormation templates']
              },
              {
                id: 'infra-2',
                title: 'Set up container orchestration',
                description: 'Deploy and manage containers using Kubernetes or similar',
                priority: 'medium' as const,
                status: 'not-started' as const,
                category: 'Infrastructure',
                bestPractices: ['Use resource limits', 'Implement health checks'],
                resources: ['Kubernetes guide', 'Docker best practices']
              }
            ] : []),

            // Security Items
            ...(devopsFocus.security ? [
              {
                id: 'sec-1',
                title: 'Implement security scanning',
                description: 'Set up automated security vulnerability scanning',
                priority: 'critical' as const,
                status: 'not-started' as const,
                category: 'Security',
                bestPractices: ['Scan dependencies regularly', 'Use SAST and DAST tools'],
                resources: ['OWASP guidelines', 'Security scanning tools']
              },
              {
                id: 'sec-2',
                title: 'Configure access controls',
                description: 'Implement proper RBAC and least privilege access',
                priority: 'high' as const,
                status: 'not-started' as const,
                category: 'Security',
                bestPractices: ['Use multi-factor authentication', 'Regular access reviews'],
                resources: ['RBAC best practices', 'IAM policies']
              }
            ] : []),

            // Monitoring Items
            ...(devopsFocus.monitoring ? [
              {
                id: 'mon-1',
                title: 'Set up application monitoring',
                description: 'Implement APM and log aggregation',
                priority: 'high' as const,
                status: 'not-started' as const,
                category: 'Monitoring',
                bestPractices: ['Monitor key business metrics', 'Set up alerting thresholds'],
                resources: ['Monitoring tools comparison', 'Alerting best practices']
              },
              {
                id: 'mon-2',
                title: 'Configure health checks',
                description: 'Implement comprehensive health check endpoints',
                priority: 'medium' as const,
                status: 'not-started' as const,
                category: 'Monitoring',
                bestPractices: ['Check dependencies', 'Use circuit breakers'],
                resources: ['Health check patterns', 'Circuit breaker implementation']
              }
            ] : [])
          ],
          recommendations: [
            'Start with CI/CD pipeline setup as it provides immediate value',
            'Implement monitoring early to establish baseline metrics',
            'Consider security requirements from the beginning',
            'Automate repetitive tasks to reduce manual errors'
          ],
          priorities: [
            'Critical: Security scanning and access controls',
            'High: CI/CD pipeline and automated testing',
            'Medium: Infrastructure as code and monitoring',
            'Low: Advanced automation and optimization'
          ],
          timeline: '4-6 weeks for basic implementation, 3-6 months for full maturity'
        }

        setChecklistOutput(mockChecklist)
        setLoading(false)
        toast({
          title: "Checklist Generated",
          description: "Your comprehensive DevOps checklist is ready",
        })
        resolve(undefined)
      }, 3000)
    })
  }

  const reset = () => {
    setStep(1)
    setChecklistName("")
    setChecklistDescription("")
    setTeamProfile({
      size: 'startup',
      maturity: 'beginner',
      teamSize: 5
    })
    setDevopsFocus({
      cicd: true,
      infrastructure: true,
      security: true,
      testing: true,
      monitoring: true,
      releaseManagement: true,
      collaboration: true,
      automation: true
    })
    setTechnologyStack({
      versionControl: [],
      ciCd: [],
      cloud: [],
      containers: [],
      monitoring: [],
      databases: []
    })
    setComplianceStandards({
      gdpr: false,
      soc2: false,
      hipaa: false,
      pci: false,
      iso27001: false,
      custom: []
    })
    setPainPoints({
      deploymentSpeed: false,
      reliability: false,
      security: false,
      monitoring: false,
      collaboration: false,
      automation: false,
      scalability: false,
      custom: []
    })
    setOutputFormat('task-list')
    setEnableCollaboration(false)
    setTeamMembers([])
    setChecklistOutput(null)
    setCompletedTasks(new Set())
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">DevOps Checklist Builder Pro</h1>
        <p className="text-muted-foreground">Generate comprehensive DevOps checklists tailored to your team and technology stack</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant={step >= 1 ? "default" : "secondary"}>1. Team Profile</Badge>
        <Badge variant={step >= 2 ? "default" : "secondary"}>2. Configuration</Badge>
        <Badge variant={step >= 3 ? "default" : "secondary"}>3. Checklist</Badge>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Step 1: Team & Organization Profile
            </CardTitle>
            <CardDescription>Tell us about your team and current DevOps maturity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="checklist-name">Checklist Name</Label>
                  <Input
                    id="checklist-name"
                    placeholder="e.g., Q1 DevOps Initiative"
                    value={checklistName}
                    onChange={(e) => setChecklistName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checklist-description">Description</Label>
                  <Textarea
                    id="checklist-description"
                    placeholder="Brief description of your DevOps goals..."
                    value={checklistDescription}
                    onChange={(e) => setChecklistDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-size">Team Size</Label>
                  <Select value={teamProfile.size} onValueChange={(value: any) => setTeamProfile(prev => ({ ...prev, size: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup (1-10 people)</SelectItem>
                      <SelectItem value="smb">SMB (11-100 people)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (100+ people)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-count">Number of Team Members</Label>
                  <Input
                    id="team-count"
                    type="number"
                    min="1"
                    value={teamProfile.teamSize}
                    onChange={(e) => setTeamProfile(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maturity">DevOps Maturity Level</Label>
                  <Select value={teamProfile.maturity} onValueChange={(value: any) => setTeamProfile(prev => ({ ...prev, maturity: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner - Manual processes</SelectItem>
                      <SelectItem value="intermediate">Intermediate - Some automation</SelectItem>
                      <SelectItem value="advanced">Advanced - Fully automated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button onClick={() => setStep(2)} disabled={!checklistName}>
              Next: Configuration
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Step 2: DevOps Configuration
            </CardTitle>
            <CardDescription>Configure your DevOps focus areas, technology stack, and requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="focus" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="focus">Focus Areas</TabsTrigger>
                <TabsTrigger value="tech">Technology</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="pain">Pain Points</TabsTrigger>
              </TabsList>

              <TabsContent value="focus" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(devopsFocus).map(([key, enabled]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Switch
                        id={key}
                        checked={enabled}
                        onCheckedChange={(checked) => updateDevopsFocus(key as keyof DevOpsFocus, checked)}
                      />
                      <Label htmlFor={key} className="text-sm">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tech" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Version Control</Label>
                      <div className="mt-2 space-y-2">
                        {['GitHub', 'GitLab', 'Bitbucket', 'Azure DevOps'].map(tool => (
                          <div key={tool} className="flex items-center space-x-2">
                            <Checkbox
                              id={`vc-${tool}`}
                              checked={technologyStack.versionControl.includes(tool)}
                              onCheckedChange={(checked) => updateTechnologyStack('versionControl', tool, !!checked)}
                            />
                            <Label htmlFor={`vc-${tool}`} className="text-sm">{tool}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">CI/CD Tools</Label>
                      <div className="mt-2 space-y-2">
                        {['Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Azure Pipelines'].map(tool => (
                          <div key={tool} className="flex items-center space-x-2">
                            <Checkbox
                              id={`cicd-${tool}`}
                              checked={technologyStack.ciCd.includes(tool)}
                              onCheckedChange={(checked) => updateTechnologyStack('ciCd', tool, !!checked)}
                            />
                            <Label htmlFor={`cicd-${tool}`} className="text-sm">{tool}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Cloud Platforms</Label>
                      <div className="mt-2 space-y-2">
                        {['AWS', 'Google Cloud', 'Azure', 'DigitalOcean', 'Heroku'].map(tool => (
                          <div key={tool} className="flex items-center space-x-2">
                            <Checkbox
                              id={`cloud-${tool}`}
                              checked={technologyStack.cloud.includes(tool)}
                              onCheckedChange={(checked) => updateTechnologyStack('cloud', tool, !!checked)}
                            />
                            <Label htmlFor={`cloud-${tool}`} className="text-sm">{tool}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Containers & Orchestration</Label>
                      <div className="mt-2 space-y-2">
                        {['Docker', 'Kubernetes', 'Docker Swarm', 'OpenShift'].map(tool => (
                          <div key={tool} className="flex items-center space-x-2">
                            <Checkbox
                              id={`container-${tool}`}
                              checked={technologyStack.containers.includes(tool)}
                              onCheckedChange={(checked) => updateTechnologyStack('containers', tool, !!checked)}
                            />
                            <Label htmlFor={`container-${tool}`} className="text-sm">{tool}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(complianceStandards).filter(([key]) => key !== 'custom').map(([standard, enabled]) => (
                    <div key={standard} className="flex items-center space-x-2">
                      <Switch
                        id={standard}
                        checked={enabled}
                        onCheckedChange={(checked) => updateComplianceStandards(standard as keyof Omit<ComplianceStandards, 'custom'>, checked)}
                      />
                      <Label htmlFor={standard} className="text-sm font-medium">
                        {standard.toUpperCase()}
                      </Label>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pain" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(painPoints).filter(([key]) => key !== 'custom').map(([point, enabled]) => (
                    <div key={point} className="flex items-center space-x-2">
                      <Switch
                        id={point}
                        checked={enabled}
                        onCheckedChange={(checked) => updatePainPoints(point as keyof Omit<PainPoints, 'custom'>, checked)}
                      />
                      <Label htmlFor={point} className="text-sm">
                        {point.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="collaboration"
                  checked={enableCollaboration}
                  onCheckedChange={setEnableCollaboration}
                />
                <Label htmlFor="collaboration">Enable Team Collaboration Features</Label>
              </div>

              {enableCollaboration && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Team Members</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add team member email"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTeamMember((e.target as HTMLInputElement).value)
                            ;(e.target as HTMLInputElement).value = ''
                          }
                        }}
                      />
                      <Button onClick={() => {
                        const input = document.querySelector('input[placeholder="Add team member email"]') as HTMLInputElement
                        if (input?.value) {
                          addTeamMember(input.value)
                          input.value = ''
                        }
                      }}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {teamMembers.map(member => (
                        <Badge key={member} variant="secondary" className="flex items-center gap-1">
                          {member}
                          <button onClick={() => removeTeamMember(member)} className="ml-1 hover:text-destructive">
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select value={outputFormat} onValueChange={(value: any) => setOutputFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task-list">Task List</SelectItem>
                    <SelectItem value="kanban">Kanban Board</SelectItem>
                    <SelectItem value="roadmap">Roadmap</SelectItem>
                    <SelectItem value="report">Executive Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={() => setStep(1)} variant="outline">
                Back
              </Button>
              <Button onClick={generateChecklist} disabled={loading}>
                {loading ? (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Checklist...
                  </>
                ) : (
                  <>
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Generate Checklist
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && checklistOutput && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">DevOps Checklist</h2>
              <p className="text-muted-foreground">{checklistOutput.items.length} actionable items across {[...new Set(checklistOutput.items.map(item => item.category))].length} categories</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToNotion}>
                <Copy className="mr-2 h-4 w-4" />
                Export to Notion
              </Button>
              <Button variant="outline" onClick={generatePDF}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                New Checklist
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">{completedTasks.size} of {checklistOutput.items.length} tasks completed</span>
                </div>
                <Progress value={getProgressPercentage()} className="h-2.5" />
                <div className="text-center">
                  <span className="text-2xl font-bold text-blue-600">{getProgressPercentage()}%</span>
                  <span className="text-sm text-muted-foreground ml-1">Complete</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Alert */}
          <Alert>
            <Target className="h-4 w-4" />
            <AlertDescription>
              <strong>Timeline:</strong> {checklistOutput.timeline}
            </AlertDescription>
          </Alert>

          {/* Completion Celebration */}
          {getProgressPercentage() === 100 && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>🎉 Congratulations!</strong> You've completed all DevOps checklist items! Your team is now ready for advanced DevOps practices.
              </AlertDescription>
            </Alert>
          )}

          {/* Priority Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Priority Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {checklistOutput.priorities.map((priority, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant={priority.includes('Critical') ? 'destructive' : priority.includes('High') ? 'default' : 'secondary'}>
                      {priority.split(':')[0]}
                    </Badge>
                    <span className="text-sm">{priority.split(':')[1]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Checklist Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...new Set(checklistOutput.items.map(item => item.category))].map(category => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category === 'CI/CD' && <GitBranch className="h-5 w-5" />}
                    {category === 'Infrastructure' && <Settings className="h-5 w-5" />}
                    {category === 'Security' && <Shield className="h-5 w-5" />}
                    {category === 'Monitoring' && <Monitor className="h-5 w-5" />}
                    {category === 'Testing' && <CheckCircle className="h-5 w-5" />}
                    {category}
                  </CardTitle>
                  <CardDescription>
                    {checklistOutput.items.filter(item => item.category === category).length} items
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {checklistOutput.items
                    .filter(item => item.category === category)
                    .map(item => {
                      const isCompleted = completedTasks.has(item.id)
                      return (
                        <div key={item.id} className={`border rounded-lg p-4 space-y-3 transition-all duration-200 ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id={item.id}
                              checked={isCompleted}
                              onCheckedChange={() => toggleTaskCompletion(item.id)}
                              className="mt-1"
                            />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <h4 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                                    {item.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                                <Badge variant={
                                  item.priority === 'critical' ? 'destructive' :
                                  item.priority === 'high' ? 'default' :
                                  item.priority === 'medium' ? 'secondary' : 'outline'
                                }>
                                  {item.priority}
                                </Badge>
                              </div>
                              
                              {item.bestPractices && item.bestPractices.length > 0 && (
                                <div>
                                  <Label className="text-xs font-medium text-muted-foreground">Best Practices:</Label>
                                  <ul className="text-xs text-muted-foreground mt-1">
                                    {item.bestPractices.map((practice, index) => (
                                      <li key={index}>• {practice}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {enableCollaboration && (
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <Select>
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Assign to..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {teamMembers.map(member => (
                                        <SelectItem key={member} value={member}>{member}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <Input type="date" className="h-8" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Improvement Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {checklistOutput.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">{recommendation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
