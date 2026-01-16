import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Calendar, Users, FolderGit2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useBatch } from "@/contexts/BatchContext";
import { useNavigate } from "react-router-dom";

const statusColors = {
  active: "bg-green-500/10 text-green-600 border-green-500/20",
  completed: "bg-muted text-muted-foreground border-border",
  archived: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

export default function AdminBatches() {
  const [searchQuery, setSearchQuery] = useState("");
  const { batches, selectedBatch, setSelectedBatch } = useBatch();
  const navigate = useNavigate();

  const filteredBatches = batches.filter((batch) =>
    batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.semester.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSetActive = (batchId: string) => {
    const batch = batches.find((b) => b.id === batchId);
    if (batch) {
      setSelectedBatch(batch);
    }
  };

  const handleViewDashboard = (batchId: string) => {
    const batch = batches.find((b) => b.id === batchId);
    if (batch) {
      setSelectedBatch(batch);
      navigate("/admin/dashboard");
    }
  };

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
        {filteredBatches.map((batch) => {
          const isSelected = selectedBatch?.id === batch.id;
          
          return (
            <Card 
              key={batch.id} 
              className={isSelected ? "ring-2 ring-primary" : ""}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{batch.semester}</CardTitle>
                    {isSelected && (
                      <Badge variant="default" className="text-[10px]">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={statusColors[batch.status]}
                  >
                    {batch.status}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {batch.startDate} - {batch.endDate}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <FolderGit2 className="h-4 w-4" />
                    {batch.teamCount} teams
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {batch.studentCount} students
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isSelected && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleSetActive(batch.id)}
                    >
                      Set as Active
                    </Button>
                  )}
                  <Button 
                    variant={isSelected ? "default" : "secondary"}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDashboard(batch.id)}
                  >
                    View Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
