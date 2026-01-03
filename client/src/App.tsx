import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";

import Generator from "@/pages/Generator";
import History from "@/pages/History";
import Favorites from "@/pages/Favorites";
import Templates from "@/pages/Templates";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <WouterRouter hook={useHashLocation}>
      <Layout>
        <Switch>
          <Route path="/" component={Generator} />
          <Route path="/history" component={History} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/templates" component={Templates} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
