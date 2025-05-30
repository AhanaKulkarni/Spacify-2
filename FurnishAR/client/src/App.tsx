import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Home } from "@/pages/Home";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { DEFAULT_FURNITURE_CATALOG } from "@/lib/furniture-data";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { setFurnitureLibrary } = useAppStore();

  // Initialize furniture library on app start
  useEffect(() => {
    setFurnitureLibrary(DEFAULT_FURNITURE_CATALOG);
  }, [setFurnitureLibrary]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
