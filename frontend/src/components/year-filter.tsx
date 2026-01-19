"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface YearFilterProps {
    value: string | null
    onChange: (value: string | null) => void
    className?: string
    triggerClassName?: string
}

export function YearFilter({ value, onChange }: YearFilterProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)

  return (
    <div className="flex items-center gap-1">
      <Select
        value={value ?? ""}
        onValueChange={(val) => onChange(val || null)}
      >
        <SelectTrigger
          className={`h-12 w-[120px] bg-secondary border-border ${
            value ? "ring-2 ring-accent ring-offset-1 ring-offset-background" : ""
          }`}
        >
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => onChange(null)}
          aria-label="Limpar filtro de ano"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
