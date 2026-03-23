import { Link } from "wouter";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mb-8 text-primary shadow-sm border">
        <Leaf className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-serif font-bold mb-4 tracking-tight">404 - Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-md">
        The page you are looking for does not exist in the BONAP Source Explorer.
      </p>
      <Button asChild size="lg" className="hover-elevate">
        <Link href="/">Return to Explorer</Link>
      </Button>
    </div>
  );
}
