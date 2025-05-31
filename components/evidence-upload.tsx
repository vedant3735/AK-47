"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FileUp, X, ImageIcon } from "lucide-react"

interface EvidenceUploadProps {
  onUpload: (files: string[]) => void
}

export function EvidenceUpload({ onUpload }: EvidenceUploadProps) {
  const [files, setFiles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsLoading(true)
      try {
        // Convert files to base64
        const filePromises = Array.from(e.target.files).map((file) => fileToBase64(file))
        const base64Files = await Promise.all(filePromises)

        const updatedFiles = [...files, ...base64Files]
        setFiles(updatedFiles)
        onUpload(updatedFiles)
      } catch (error) {
        console.error("Error converting files to base64:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onUpload(updatedFiles)
  }

  return (
    <Card className="border-pink-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-pink-700 text-lg">Evidence Upload</CardTitle>
        <CardDescription>Attach proof to support your grievance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <Label
              htmlFor="evidence-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-pink-300 rounded-lg cursor-pointer bg-pink-50 hover:bg-pink-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp className="w-8 h-8 mb-2 text-pink-500" />
                <p className="mb-1 text-sm text-pink-700">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-pink-500">Screenshots, voice notes, or other evidence</p>
              </div>
              <Input
                id="evidence-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </Label>
          </div>

          {isLoading && (
            <div className="text-center">
              <p className="text-sm text-pink-600">Uploading files...</p>
            </div>
          )}

          {files.length > 0 && (
            <div>
              <p className="text-sm font-medium text-pink-700 mb-2">
                Exhibits A through {String.fromCharCode(64 + files.length)} are now being reviewed by the Love Court
              </p>
              <div className="grid grid-cols-3 gap-2">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="h-20 w-full bg-pink-100 rounded-md flex items-center justify-center overflow-hidden">
                      {file.startsWith("data:image") ? (
                        <img
                          src={file || "/placeholder.svg"}
                          alt={`Evidence ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-pink-500" />
                      )}
                    </div>
                    <button
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <p className="text-xs text-center mt-1 text-pink-700">Exhibit {String.fromCharCode(65 + index)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
