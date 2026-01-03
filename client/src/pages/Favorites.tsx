import { usePayloadHistory } from "@/hooks/use-payloads";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Star, Copy, Terminal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useToast } from "@/hooks/use-toast";

export default function Favorites() {
  const { history, removeFromHistory, toggleFavorite } = usePayloadHistory();
  const { toast } = useToast();
  
  const favorites = history.filter(item => item.isFavorite);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "Payload copied to clipboard" });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight text-foreground flex items-center gap-3">
          <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          Favorites
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          Your curated collection of shells.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {favorites.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
            >
              <Card className="bg-card border-border hover:border-yellow-400/50 transition-colors group h-full flex flex-col">
                <div className="p-5 flex flex-col gap-4 flex-grow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                       <Badge variant="outline" className="font-mono text-primary border-primary/30">
                         {item.type}
                       </Badge>
                       <span className="text-xs text-muted-foreground font-mono">
                         {item.ip}:{item.port}
                       </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(item.id)}
                      className="text-yellow-400 -mt-2 -mr-2 hover:bg-transparent"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                  
                  <div className="bg-background/50 p-3 rounded border border-border font-mono text-xs text-muted-foreground break-all flex-grow">
                    {item.generatedPayload}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono">
                      {formatDistanceToNow(item.createdAt)} ago
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(item.generatedPayload)}
                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="w-3 h-3 mr-1" /> Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromHistory(item.id)}
                        className="h-8 px-2 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {favorites.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
              <Star className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No favorites yet</h3>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              Star items in your history or generator to save them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
