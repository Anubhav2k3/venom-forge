import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { payloadConfigSchema, type PayloadConfig } from "@shared/schema";
import { generatePayload, generateListener, generateTtyUpgrade, PAYLOAD_TYPES, SHELL_OPTIONS } from "@/lib/generators";
import { usePayloadHistory } from "@/hooks/use-payloads";
import { v4 as uuidv4 } from 'uuid';

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CodeBlock } from "@/components/CodeBlock";
import { Badge } from "@/components/ui/badge";
import { Terminal, Save, Copy, Zap, ShieldAlert, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Generator() {
  const { toast } = useToast();
  const { addToHistory } = usePayloadHistory();
  
  const form = useForm<PayloadConfig>({
    resolver: zodResolver(payloadConfigSchema),
    defaultValues: {
      ip: "10.10.14.2", // Common HTB tun0 IP
      port: 4444,
      type: "bash",
      shell: "/bin/bash",
      obfuscation: "none",
    },
    mode: "onChange",
  });

  const [generated, setGenerated] = useState("");
  const [listener, setListener] = useState("");
  const [upgrade, setUpgrade] = useState("");

  const formValues = form.watch();

  useEffect(() => {
    // Real-time generation
    const payload = generatePayload(formValues);
    const listen = generateListener(formValues.port, formValues.type);
    const upg = generateTtyUpgrade(formValues.shell);
    
    setGenerated(payload);
    setListener(listen);
    setUpgrade(upg);
  }, [formValues]);

  const handleSave = () => {
    const entry = {
      ...formValues,
      id: uuidv4(),
      createdAt: Date.now(),
      generatedPayload: generated,
      listenerCommand: listener,
      isFavorite: false,
    };
    addToHistory(entry);
    toast({
      title: "Payload Saved",
      description: "Added to your history.",
    });
  };

  const currentType = PAYLOAD_TYPES.find(t => t.value === formValues.type);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-foreground flex items-center gap-3">
            <Terminal className="w-8 h-8 text-primary" />
            Payload Generator
          </h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">
            Craft reverse shells instantly. 100% Client-Side.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="font-mono text-xs py-1 px-3 border-primary/30 text-primary">
             <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
             ACTIVE SESSION
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration */}
        <motion.div 
          className="lg:col-span-5 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 bg-card border-border shadow-lg space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ip" className="text-xs font-mono uppercase text-muted-foreground">LHOST (IP Address)</Label>
                <div className="relative">
                  <Monitor className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    {...form.register("ip")}
                    id="ip" 
                    className="pl-9 font-mono bg-background border-border focus-visible:ring-primary/20"
                  />
                </div>
                {form.formState.errors.ip && (
                  <p className="text-xs text-destructive font-mono">{form.formState.errors.ip.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="port" className="text-xs font-mono uppercase text-muted-foreground">LPORT (Port)</Label>
                <div className="relative">
                  <Zap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    {...form.register("port")}
                    id="port" 
                    type="number"
                    className="pl-9 font-mono bg-background border-border focus-visible:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono uppercase text-muted-foreground">Payload Type</Label>
              <Select 
                onValueChange={(val) => form.setValue("type", val as any)} 
                defaultValue={formValues.type}
              >
                <SelectTrigger className="font-mono bg-background border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border max-h-[300px]">
                  {PAYLOAD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="font-mono focus:bg-primary/20">
                      <div className="flex items-center gap-2">
                         {/* Icons could be mapped dynamically, simplification here */}
                         <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-mono uppercase text-muted-foreground">Shell Executable</Label>
              </div>
              <Select 
                onValueChange={(val) => form.setValue("shell", val)} 
                defaultValue={formValues.shell}
              >
                <SelectTrigger className="font-mono bg-background border-border">
                  <SelectValue placeholder="Select shell" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {SHELL_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="font-mono focus:bg-primary/20">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={handleSave}
                className="w-full bg-secondary hover:bg-secondary/80 text-foreground border border-border shadow-sm font-mono"
              >
                <Save className="w-4 h-4 mr-2 text-primary" />
                Save to History
              </Button>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border border-primary/20">
            <div className="flex gap-3">
              <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-primary">Operational Security</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Generated payloads are not encrypted by default. Use with caution during authorized engagements. Network filters may flag standard netcat connections.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Column: Output */}
        <motion.div 
          className="lg:col-span-7 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="space-y-2">
             <div className="flex items-center justify-between">
               <Label className="text-xs font-mono uppercase text-muted-foreground">Generated Payload</Label>
               <span className="text-xs font-mono text-muted-foreground">{generated.length} chars</span>
             </div>
             <CodeBlock code={generated} language="bash" label={currentType?.label} className="shadow-xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-mono uppercase text-muted-foreground">Listener Command</Label>
              <CodeBlock code={listener} language="bash" label="LOCAL TERMINAL" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-mono uppercase text-muted-foreground">TTY Upgrade</Label>
              <CodeBlock code={upgrade} language="bash" label="STABILIZE" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
