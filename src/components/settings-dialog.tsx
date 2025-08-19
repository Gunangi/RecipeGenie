"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Bell, Ruler } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Switch } from "./ui/switch"
import { Separator } from "./ui/separator"

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { setTheme, theme } = useTheme()
  const { toast } = useToast()
  
  const [measurementUnit, setMeasurementUnit] = useState("metric")
  const [recipeSuggestionsNotif, setRecipeSuggestionsNotif] = useState(false)
  const [mealRemindersNotif, setMealRemindersNotif] = useState(true)

  useEffect(() => {
    if (open) {
      setMeasurementUnit(localStorage.getItem("measurementUnit") || "metric")
      setRecipeSuggestionsNotif(JSON.parse(localStorage.getItem("recipeSuggestionsNotif") || "false"))
      setMealRemindersNotif(JSON.parse(localStorage.getItem("mealRemindersNotif") || "true"))
    }
  }, [open])

  const handleSave = () => {
    localStorage.setItem("measurementUnit", measurementUnit)
    localStorage.setItem("recipeSuggestionsNotif", JSON.stringify(recipeSuggestionsNotif))
    localStorage.setItem("mealRemindersNotif", JSON.stringify(mealRemindersNotif))
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your application settings and preferences here.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label className="font-semibold">Theme</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant={theme === "light" ? "secondary" : "ghost"}
                onClick={() => setTheme("light")}
              >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "secondary" : "ghost"}
                onClick={() => setTheme("dark")}
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
             <Label className="font-semibold flex items-center gap-2"><Ruler className="w-5 h-5 text-primary" />Default Measurement Units</Label>
             <RadioGroup value={measurementUnit} onValueChange={setMeasurementUnit}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="metric" id="metric" />
                  <Label htmlFor="metric" className="font-normal">Metric (grams, ml)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="imperial" id="imperial" />
                  <Label htmlFor="imperial" className="font-normal">Imperial (ounces, cups)</Label>
                </div>
              </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-4">
             <Label className="font-semibold flex items-center gap-2"><Bell className="w-5 h-5 text-primary" />Push Notifications</Label>
             <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                    <Label className="font-medium">New Recipe Suggestions</Label>
                    <p className="text-xs text-muted-foreground">
                        Receive notifications about new recipes you might like.
                    </p>
                </div>
                <Switch
                    checked={recipeSuggestionsNotif}
                    onCheckedChange={setRecipeSuggestionsNotif}
                />
             </div>
             <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                    <Label className="font-medium">Meal Planning Reminders</Label>
                     <p className="text-xs text-muted-foreground">
                        Get reminders for your planned meals.
                    </p>
                </div>
                <Switch
                    checked={mealRemindersNotif}
                    onCheckedChange={setMealRemindersNotif}
                />
             </div>
          </div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
