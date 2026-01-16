import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Mail, Users, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBatch } from "@/contexts/BatchContext";

// Mock data with batch assignments
const mockMentors = [
  { id: "1", name: "Dr. Smith", email: "smith@university.edu", batchTeams: { "4th-sem-2024": 2, "6th-sem-2024": 1 }, maxTeams: 5 },
  { id: "2", name: "Prof. Johnson", email: "johnson@university.edu", batchTeams: { "4th-sem-2024": 1, "4th-sem-2023": 1 }, maxTeams: 5 },
  { id: "3", name: "Dr. Williams", email: "williams@university.edu", batchTeams: { "4th-sem-2024": 1, "6th-sem-2024": 1 }, maxTeams: 5 },
  { id: "4", name: "Prof. Brown", email: "brown@university.edu", batchTeams: { "6th-sem-2024": 1 }, maxTeams: 5 },
];

export default function AdminMentors() {
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedBatch } = useBatch();
  const navigate = useNavigate();

  // Filter mentors who have teams in the selected batch
  const filteredMentors = mockMentors
    .filter((mentor) => {
      if (!selectedBatch) return true;
      return mentor.batchTeams[selectedBatch.id] !== undefined;
    })
    .filter((mentor) =>
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Calculate teams for display
  const getMentorTeamCount = (mentor: typeof mockMentors[0]) => {
    if (!selectedBatch) {
      return Object.values(mentor.batchTeams).reduce((sum, count) => sum + count, 0);
    }
    return mentor.batchTeams[selectedBatch.id] || 0;
  };

  if (!selectedBatch) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <GraduationCap className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">No Batch Selected</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Please select a batch from the dropdown in the header to view mentors.
        </p>
        <Button onClick={() => navigate("/admin/batches")}>
          Go to Batches
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Mentors</h1>
            <Badge variant="secondary">{selectedBatch.semester} {selectedBatch.year}</Badge>
          </div>
          <p className="text-muted-foreground">
            {filteredMentors.length} mentors assigned to {selectedBatch.name}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Mentor
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search mentors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredMentors.map((mentor) => {
          const teamCount = getMentorTeamCount(mentor);
          const totalTeams = Object.values(mentor.batchTeams).reduce((sum, count) => sum + count, 0);
          const atCapacity = totalTeams >= mentor.maxTeams;

          return (
            <Card key={mentor.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{mentor.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {teamCount} in batch
                    </Badge>
                    <Badge variant={atCapacity ? "destructive" : "secondary"}>
                      {totalTeams}/{mentor.maxTeams} total
                    </Badge>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {mentor.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to={`/admin/mentor/${mentor.id}`}>
                    <Users className="h-4 w-4 mr-2" />
                    View as Mentor
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
