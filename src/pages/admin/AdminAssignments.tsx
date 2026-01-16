import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

// Mock data
const mockUnassignedTeams = [
  { id: "3", name: "Team Gamma", batch: "Fall 2024" },
  { id: "5", name: "Team Epsilon", batch: "Fall 2024" },
  { id: "6", name: "Team Zeta", batch: "Fall 2024" },
];

const mockMentors = [
  { id: "1", name: "Dr. Smith", capacity: 1, maxCapacity: 5 },
  { id: "2", name: "Prof. Johnson", capacity: 2, maxCapacity: 5 },
  { id: "4", name: "Prof. Brown", capacity: 3, maxCapacity: 5 },
];

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const handleAssign = (teamId: string) => {
    const mentorId = assignments[teamId];
    if (!mentorId) {
      toast.error("Please select a mentor first");
      return;
    }
    const mentor = mockMentors.find((m) => m.id === mentorId);
    const team = mockUnassignedTeams.find((t) => t.id === teamId);
    toast.success(`Assigned ${team?.name} to ${mentor?.name}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assign Teams</h1>
        <p className="text-muted-foreground">
          Assign unassigned teams to mentors
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Unassigned Teams */}
        <Card>
          <CardHeader>
            <CardTitle>Unassigned Teams</CardTitle>
            <CardDescription>
              {mockUnassignedTeams.length} teams need mentors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockUnassignedTeams.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{team.name}</p>
                  <p className="text-sm text-muted-foreground">{team.batch}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={assignments[team.id] || ""}
                    onValueChange={(value) =>
                      setAssignments((prev) => ({ ...prev, [team.id]: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select mentor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMentors
                        .filter((m) => m.capacity < m.maxCapacity)
                        .map((mentor) => (
                          <SelectItem key={mentor.id} value={mentor.id}>
                            {mentor.name} ({mentor.capacity}/{mentor.maxCapacity})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => handleAssign(team.id)}>Assign</Button>
                </div>
              </div>
            ))}

            {mockUnassignedTeams.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                All teams are assigned!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Mentor Capacity */}
        <Card>
          <CardHeader>
            <CardTitle>Mentor Capacity</CardTitle>
            <CardDescription>Current team assignments per mentor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockMentors.map((mentor) => {
              const percentage = (mentor.capacity / mentor.maxCapacity) * 100;
              const atCapacity = mentor.capacity >= mentor.maxCapacity;

              return (
                <div key={mentor.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{mentor.name}</span>
                    <Badge variant={atCapacity ? "destructive" : "secondary"}>
                      {mentor.capacity}/{mentor.maxCapacity}
                    </Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        atCapacity
                          ? "bg-red-500"
                          : percentage >= 80
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
