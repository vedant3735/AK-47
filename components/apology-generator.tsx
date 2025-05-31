"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateApology } from "@/lib/utils-features"
import { Copy, Check } from "lucide-react"

interface ApologyGeneratorProps {
  grievanceText?: string
}

export function ApologyGenerator({ grievanceText = "" }: ApologyGeneratorProps) {
  const [style, setStyle] = useState<"poetic" | "dramatic" | "shakespearean">("poetic")
  const [issue, setIssue] = useState(grievanceText)
  const [apology, setApology] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    if (!issue.trim()) return
    const generatedApology = generateApology(style, issue)
    setApology(generatedApology)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(apology)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-pink-200 shadow-md">
      <CardHeader className="bg-pink-50">
        <CardTitle className="text-pink-700">Apology Generator</CardTitle>
        <CardDescription>Create a sweet, personalized apology</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="issue">What are you apologizing for?</Label>
          <Textarea
            id="issue"
            placeholder="Describe what you're sorry about..."
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="min-h-[80px] border-pink-200 focus:border-pink-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="style">Apology Style</Label>
          <Select value={style} onValueChange={(value) => setStyle(value as any)}>
            <SelectTrigger id="style" className="border-pink-200">
              <SelectValue placeholder="Select a style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="poetic">Poetic</SelectItem>
              <SelectItem value="dramatic">Dramatic</SelectItem>
              <SelectItem value="shakespearean">Shakespearean</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleGenerate} disabled={!issue.trim()} className="w-full bg-pink-500 hover:bg-pink-600">
          Generate Apology
        </Button>

        {apology && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <Label>Your Personalized Apology</Label>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-pink-600" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
            <div className="bg-pink-50 p-4 rounded-md whitespace-pre-wrap text-sm">{apology}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
