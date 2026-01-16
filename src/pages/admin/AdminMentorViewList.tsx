import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Mock data
const mockMentors = [
  { id: "1", name: "Dr. Smith", email: "smith@university.edu", teams: 4 },
  { id: "2", name: "Prof. Johnson", email: "johnson@university.edu", teams: 3 },
  { id: "3", name: "Dr. Williams", email: "williams@university.edu", teams: 5 },
  { id: "4", name: "Prof. Brown", email: "brown@university.edu", teams: 2 },
];

export default function AdminMentorView() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMentors = mockMentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Access Mentor View</h1>
        <p className="text-muted-foreground">
          View the system as a specific mentor would see it
        </p>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{mentor.name}</CardTitle>
              <CardDescription>{mentor.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {mentor.teams} teams assigned
              </p>
              <Button className="w-full" asChild>
                <Link to={`/admin/mentor/${mentor.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View as {mentor.name.split(" ")[0]}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
