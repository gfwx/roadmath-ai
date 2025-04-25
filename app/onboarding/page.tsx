"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { createClient } from "@supabase/supabase-js"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    username: "",
    display_name: "",
    age: "",
    gender: "",
    nationality: "",
    m_comfort_level: "",
    m_grade_equiv: "",
  })

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.m_grade_equiv !== ""
      case 2:
        return formData.m_comfort_level !== ""
      case 3:
        return (
          formData.username.trim() !== "" &&
          formData.display_name.trim() !== "" &&
          formData.age.trim() !== "" &&
          formData.gender.trim() !== "" &&
          formData.nationality.trim() !== ""
        )
      default:
        return false
    }
  }

  const handleNext = () => {
    if (step < totalSteps && isStepValid()) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white text-black">
      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome to RoadMath</h1>
          <p className="text-gray-600">Let's get you set up with a personalized learning experience</p>
        </div>

        <Card className="w-full border-black">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  {step === 1
                    ? "Question 1 of 3: Your Grade Level"
                    : step === 2
                      ? "Question 2 of 3: Math Comfort Level"
                      : "Question 3 of 3: Your Details"}
                </h3>
                <p className="text-sm text-gray-500">
                  {step === 1
                    ? "This helps us tailor the content to your academic level."
                    : step === 2
                      ? "Let us know how comfortable you are with mathematics."
                      : "Tell us a bit about yourself to complete your profile."}
                </p>
              </div>

              <div className="space-y-4">
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <Label htmlFor="grade">What grade are you in?</Label>
                    <RadioGroup
                      value={formData.m_grade_equiv}
                      onValueChange={(value) => handleInputChange("m_grade_equiv", value)}
                      className="grid grid-cols-1 gap-4 pt-2"
                    >
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="9" id="grade-9" />
                        <Label htmlFor="grade-9" className="cursor-pointer">
                          9th Grade / Freshman
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="10" id="grade-10" />
                        <Label htmlFor="grade-10" className="cursor-pointer">
                          10th Grade / Sophomore
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="11" id="grade-11" />
                        <Label htmlFor="grade-11" className="cursor-pointer">
                          11th Grade / Junior
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="12" id="grade-12" />
                        <Label htmlFor="grade-12" className="cursor-pointer">
                          12th Grade / Senior
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="13" id="grade-college" />
                        <Label htmlFor="grade-college" className="cursor-pointer">
                          College / University
                        </Label>
                      </div>
                    </RadioGroup>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <Label htmlFor="comfort">How comfortable are you with mathematics?</Label>
                    <RadioGroup
                      value={formData.m_comfort_level}
                      onValueChange={(value) => handleInputChange("m_comfort_level", value)}
                      className="grid grid-cols-1 gap-4 pt-2"
                    >
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="1" id="comfort-1" />
                        <Label htmlFor="comfort-1" className="cursor-pointer">
                          1 - Not comfortable at all
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="2" id="comfort-2" />
                        <Label htmlFor="comfort-2" className="cursor-pointer">
                          2 - Slightly comfortable
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="3" id="comfort-3" />
                        <Label htmlFor="comfort-3" className="cursor-pointer">
                          3 - Moderately comfortable
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="4" id="comfort-4" />
                        <Label htmlFor="comfort-4" className="cursor-pointer">
                          4 - Very comfortable
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="5" id="comfort-5" />
                        <Label htmlFor="comfort-5" className="cursor-pointer">
                          5 - Extremely comfortable
                        </Label>
                      </div>
                    </RadioGroup>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="display_name">Display Name</Label>
                        <Input
                          id="display_name"
                          value={formData.display_name}
                          onChange={(e) => handleInputChange("display_name", e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => handleInputChange("age", e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">Non-binary</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input
                          id="nationality"
                          value={formData.nationality}
                          onChange={(e) => handleInputChange("nationality", e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              className="bg-black h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="border-black text-black hover:bg-gray-100"
            >
              Back
            </Button>
            {step < totalSteps ? (
              <Button onClick={handleNext} disabled={!isStepValid()} className="bg-black text-white hover:bg-gray-800">
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="bg-black text-white hover:bg-gray-800"
              >
                Complete Setup
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
