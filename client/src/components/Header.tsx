import { Link } from "wouter";
import { Shield, Github, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Sidebar } from "./Sidebar";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-background border-r border-border">
             <div className="py-4">
               {/* Mobile navigation content essentially replicates Sidebar but inside Sheet */}
               <nav className="flex flex-col space-y-1 px-2">
                 <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary rounded-md">
                   <Shield className="w-4 h-4 text-primary" /> Generator
                 </Link>
                 {/* Simplified for mobile, usually would map same items */}
               </nav>
             </div>
          </SheetContent>
        </Sheet>
        
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary/50 transition-colors">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight font-mono group-hover:text-primary transition-colors">
              VenomForge
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>
    </header>
  );
}
