import { Search } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

import { Button } from "@/components/ui/button"

export function HomePage() {
  return (
    <section className="text-center mb-12 container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Descubra e Avalie Filmes
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-8">
            Pesquise seus filmes favoritos, veja detalhes e deixe sua avaliação.
          </p>

        <section className="flex justify-center items-center gap-2">
            <InputGroup className="h-14 w-full max-w-2xl">
                <InputGroupInput
                placeholder="Pesquisar filmes..."
                className="h-14"
                />
                <InputGroupAddon className="h-12 px-3">
                <Search className="size-5 text-muted-foreground" />
                </InputGroupAddon>
            </InputGroup>

            <Button
                className="h-14 px-7 text-md"
            >
                Buscar
            </Button>
        </section>    
    </section>
  )
}
