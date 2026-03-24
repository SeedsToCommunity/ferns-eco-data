import React from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Map } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="bg-primary/10 p-6 rounded-3xl mb-6">
          <Map className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4 font-serif">Uncharted Territory</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          The page you are looking for does not exist in the FERNS registry explorer.
        </p>
        <Link href="/" className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-0.5">
          Return to Registry
        </Link>
      </div>
    </Layout>
  );
}
