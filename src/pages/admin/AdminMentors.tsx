import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Mail, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Mock data
const mockMentors = [
  { id: "1", name: "Dr. Smith", email: "smith@university.edu", teams: 4, maxTeams: 5 },
  { id: "2", name: "Prof. Johnson", email: "johnson@university.edu", teams: 3, maxTeams: 5 },
  { id: "3", name: "Dr. Williams", email: "williams@university.edu", teams: 5, maxTeams: 5 },
  { id: "4", name: "Prof. Brown", email: "brown@university.edu", teams: 2, maxTeams: 5 },
];

export default function AdminMentors() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMentors = mockMentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentors</h1>
          <p className="text-muted-foreground">Manage mentor accounts and capacity</p>
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
          const atCapacity = mentor.teams >= mentor.maxTeams;

          return (
            <Card key={mentor.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{mentor.name}</CardTitle>
                  <Badge variant={atCapacity ? "destructive" : "secondary"}>
                    {mentor.teams}/{mentor.maxTeams} teams
                  </Badge>
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
