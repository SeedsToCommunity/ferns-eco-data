import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { GetBonnapMapMapType } from "@workspace/api-client-react";

const searchSchema = z.object({
  genus: z.string().min(1, "Genus is required").trim(),
  species: z.string().trim().optional(),
  map_type: z.nativeEnum(GetBonnapMapMapType),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface SearchFormProps {
  onSearch: (values: SearchFormValues) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      genus: "",
      species: "",
      map_type: "county_species",
    },
  });

  const selectedMapType = watch("map_type");

  return (
    <form onSubmit={handleSubmit(onSearch)} className="bg-card border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="genus" className="text-foreground font-medium flex items-center gap-1.5">
              Genus <span className="text-destructive">*</span>
            </Label>
            <Input
              id="genus"
              placeholder="e.g., Asclepias"
              {...register("genus")}
              className={`h-12 text-lg bg-background ${errors.genus ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.genus && <p className="text-sm text-destructive mt-1">{errors.genus.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="species" className="text-foreground font-medium">
              Species Epithet
            </Label>
            <Input
              id="species"
              placeholder="e.g., tuberosa"
              {...register("species")}
              className="h-12 text-lg bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">Leave blank for genus map</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Label className="text-foreground font-medium mb-4 block">Map Type</Label>
          <RadioGroup 
            value={selectedMapType} 
            onValueChange={(v) => setValue("map_type", v as GetBonnapMapMapType)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { value: "county_species", label: "County-level species map" },
              { value: "state_species", label: "State/continental species map" },
              { value: "genus_county", label: "Genus-level county map" }
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`map_type_${option.value}`} />
                <Label htmlFor={`map_type_${option.value}`} className="cursor-pointer font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="bg-secondary/30 px-6 py-4 md:px-8 border-t flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading} 
          size="lg"
          className="w-full md:w-auto font-semibold gap-2 transition-all"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <Map className="w-5 h-5" />
          )}
          {isLoading ? "Searching..." : "Look up BONAP map"}
        </Button>
      </div>
    </form>
  );
}
