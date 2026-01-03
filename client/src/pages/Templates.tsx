import { useTemplates, usePayloadHistory } from "@/hooks/use-payloads";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookTemplate, ArrowRight, GitFork } from "lucide-react";
import { generatePayload } from "@/lib/generators";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from "wouter";

export default function Templates() {
  const { templates } = useTemplates();
  const { addToHistory } = usePayloadHistory();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleUseTemplate = (template: any) => {
    // In a real app, this might navigate to generator with pre-filled state
    // For now, let's just generate it with default IP and save to history
    
    // We assume default IP/Port for the "quick use"
    const config = {
      ...template,
      ip: "10.10.14.2", 
      port: 9001
    };
    
    const payload = generatePayload(config);
    
    addToHistory({
      ...config,
      id: uuidv4(),
      createdAt: Date.now(),
      generatedPayload: payload,
      listenerCommand: `nc -lvnp 9001`,
      isFavorite: false,
    });
    
    toast({
      title: "Template Used",
      description: "Added to history with default LHOST settings. Check History tab.",
    });
    
    setLocation("/history");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight text-foreground flex items-center gap-3">
          <BookTemplate className="w-8 h-8 text-primary" />
          Templates
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          Battle-tested configurations for common scenarios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, idx) => (
          <Card key={idx} className="bg-card border-border hover:border-primary/50 transition-all hover:-translate-y-1">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-primary/10 rounded-md">
                   <GitFork className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
                  {template.type}
                </span>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-foreground">{template.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Uses {template.shell} with {template.obfuscation} obfuscation.
                </p>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                  onClick={() => handleUseTemplate(template)}
                >
                  Load Template <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
