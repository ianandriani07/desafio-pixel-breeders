import { Film, Star } from "lucide-react"
import { cn } from "@/lib/utils"

type HeaderProps = {
  active?: "home" | "rated"
  onChange?: (value: "home" | "rated") => void
}

export function Header({ active = "home", onChange }: HeaderProps) {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Brand */}
        <div className="group flex items-center gap-2 cursor-pointer">
          <Film className="h-6 w-6 text-accent" />
          <span className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
            Cinéf1ilo
          </span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <button
            onClick={() => onChange?.("home")}
            className={cn(
              "px-3 py-2 text-sm font-medium transition-colors hover:text-accent",
              active === "home"
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            Início
          </button>

          <button
            onClick={() => onChange?.("rated")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors hover:text-accent",
              active === "rated"
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            <Star className="h-4 w-4" />
            Filmes Avaliados
          </button>
        </nav>
      </div>
    </header>
  )
}
