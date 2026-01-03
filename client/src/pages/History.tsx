import { usePayloadHistory } from "@/hooks/use-payloads";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Star, Copy, Terminal, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import clsx from "clsx";
import { useToast } from "@/hooks/use-toast";

export default function History() {
  const { history, removeFromHistory, toggleFavorite, clearHistory } = usePayloadHistory();
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const filteredHistory = history.filter(item => 
    item.type.includes(search.toLowerCase()) || 
    item.ip.includes(search) ||
    item.shell.includes(search.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "Payload copied to clipboard" });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-foreground">History</h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">
            Previous generations stored locally.
          </p>
        </div>
        {history.length > 0 && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={clearHistory}
            className="font-mono text-xs"
          >
            <Trash2 className="w-3 h-3 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search history..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 font-mono bg-card border-border max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {filteredHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-card border-border hover:border-primary/50 transition-colors group">
                <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-md bg-secondary text-primary mt-1">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-foreground font-mono">{item.type}</span>
                        <Badge variant="outline" className="text-xs font-mono text-muted-foreground border-border">
                          {item.ip}:{item.port}
                        </Badge>
                        <span className="text-xs text-muted-foreground">• {formatDistanceToNow(item.createdAt)} ago</span>
                      </div>
                      <code className="text-xs font-mono text-muted-foreground line-clamp-1 break-all bg-background/50 p-1 rounded px-2 border border-border/50 max-w-md lg:max-w-2xl">
                        {item.generatedPayload}
                      </code>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(item.generatedPayload)}
                      className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(item.id)}
                      className={clsx(
                        "hover:bg-secondary transition-colors",
                        item.isFavorite ? "text-yellow-400 hover:text-yellow-500" : "text-muted-foreground hover:text-yellow-400"
                      )}
                    >
                      <Star className={clsx("w-4 h-4", item.isFavorite && "fill-current")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromHistory(item.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-mono">
            No history found. Generate some shells!
          </div>
        )}
      </div>
    </div>
  );
}
