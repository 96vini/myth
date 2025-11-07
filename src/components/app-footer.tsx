import Link from "next/link"
import { Heart } from "lucide-react"

export function AppFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Thunder
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Gerencie seu negócio com eficiência e simplicidade.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Links Rápidos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/customers" className="hover:text-foreground transition-colors">
                  Clientes
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-foreground transition-colors">
                  Equipe
                </Link>
              </li>
              <li>
                <Link href="/plans" className="hover:text-foreground transition-colors">
                  Planos
                </Link>
              </li>
            </ul>
          </div>

          {/* Info Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Documentação
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border/40">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Thunder. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

