import { Link, useLocation } from "wouter";
import { Terminal, History, Star, BookTemplate, Settings, Shield } from "lucide-react";
import clsx from "clsx";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Generator", icon: Terminal },
    { href: "/history", label: "History", icon: History },
    { href: "/favorites", label: "Favorites", icon: Star },
    { href: "/templates", label: "Templates", icon: BookTemplate },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/50 h-[calc(100vh-64px)] fixed top-16 left-0 overflow-y-auto">
      <div className="p-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={clsx(
                "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                location === item.href
                  ? "bg-secondary text-foreground border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-border">
        <div className="text-xs text-muted-foreground font-mono mb-2 px-2">
          VENOMFORGE v1.0.0
        </div>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-md transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </a>
      </div>
    </aside>
  );
}
