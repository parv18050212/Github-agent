import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Calendar } from "lucide-react";
import { useState } from "react";

// Mock data
const mockBatches = [
  { id: "1", name: "Fall 2024", startDate: "2024-09-01", endDate: "2024-12-15", teams: 12, status: "active" },
  { id: "2", name: "Spring 2024", startDate: "2024-01-15", endDate: "2024-05-30", teams: 10, status: "completed" },
  { id: "3", name: "Fall 2023", startDate: "2023-09-01", endDate: "2023-12-15", teams: 8, status: "archived" },
];

export default function AdminBatches() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBatches = mockBatches.filter((batch) =>
    batch.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Batches / Semesters</h1>
          <p className="text-muted-foreground">Manage academic batches and semesters</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Batch
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search batches..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBatches.map((batch) => (
          <Card key={batch.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{batch.name}</CardTitle>
                <Badge
                  variant={
                    batch.status === "active"
                      ? "default"
                      : batch.status === "completed"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {batch.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {batch.startDate} - {batch.endDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{batch.teams} teams</p>
              <Button variant="outline" className="w-full mt-4">
                Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
