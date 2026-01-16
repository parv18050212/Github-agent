import { useBatch, Batch } from "@/contexts/BatchContext";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap } from "lucide-react";

const statusColors = {
  active: "bg-green-500/10 text-green-600 border-green-500/20",
  completed: "bg-muted text-muted-foreground border-muted",
  archived: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

export function BatchSelector() {
  const { batches, selectedBatch, setSelectedBatch } = useBatch();

  const handleSelect = (batchId: string) => {
    const batch = batches.find((b) => b.id === batchId);
    if (batch) {
      setSelectedBatch(batch);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <GraduationCap className="h-4 w-4 text-muted-foreground" />
      <Select
        value={selectedBatch?.id || ""}
        onValueChange={handleSelect}
      >
        <SelectTrigger className="w-[220px] h-9">
          <SelectValue placeholder="Select a batch..." />
        </SelectTrigger>
        <SelectContent>
          {batches.map((batch) => (
            <SelectItem key={batch.id} value={batch.id}>
              <div className="flex items-center gap-2">
                <span>{batch.semester} {batch.year}</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 ${statusColors[batch.status]}`}
                >
                  {batch.status}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedBatch && (
        <Badge variant="secondary" className="text-xs">
          {selectedBatch.teamCount} teams
        </Badge>
      )}
    </div>
  );
}
