"use client"

import { Input } from "@/components/ui/input"
import { Search as SearchIcon } from "lucide-react"

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function SearchBar({ className, ...props }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-10 glass-effect rounded-xl"
        {...props}
      />
    </div>
  )
}