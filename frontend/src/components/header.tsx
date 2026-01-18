import { Film, Star } from "lucide-react"
import { cn } from "@/lib/utils"

type HeaderProps = {
  active?: "home" | "rated"
  onChange?: (value: "home" | "rated") => void
}

export function Header({ active = "home", onChange }: HeaderProps) {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto flex h-24 items-center justify-between px-6">
        {/* Logo */}
        <div className="group flex items-center gap-3 cursor-pointer">
          <Film className="h-10 w-10 text-accent" />
          <span className="text-3xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
            Cinéfilo
          </span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-3">
          <button
            onClick={() => onChange?.("home")}
            className={cn(
              "px-4 py-3 text-base font-medium transition-colors hover:text-accent",
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
              "flex items-center gap-2 px-4 py-3 text-base font-medium transition-colors hover:text-accent",
              active === "rated"
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            <Star className="h-5 w-5" />
            Filmes Avaliados
          </button>
        </nav>
      </div>
    </header>
  )
}
