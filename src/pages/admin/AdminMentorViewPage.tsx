import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Import the Mentor Dashboard component to reuse
import MentorDashboard from "@/pages/mentor/MentorDashboard";

// Mock mentor data
const mockMentors: Record<string, { name: string; email: string }> = {
  "1": { name: "Dr. Smith", email: "smith@university.edu" },
  "2": { name: "Prof. Johnson", email: "johnson@university.edu" },
  "3": { name: "Dr. Williams", email: "williams@university.edu" },
  "4": { name: "Prof. Brown", email: "brown@university.edu" },
};

export default function AdminMentorViewPage() {
  const { mentorId } = useParams();
  const mentor = mentorId ? mockMentors[mentorId] : null;

  if (!mentor) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mentor Not Found</h1>
        <Button asChild>
          <Link to="/admin/mentor-view">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mentor List
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Admin viewing banner */}
      <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            Admin View Mode
          </Badge>
          <span className="text-sm">
            Viewing as: <strong>{mentor.name}</strong> ({mentor.email})
          </span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/mentor-view">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit View Mode
          </Link>
        </Button>
      </div>

      {/* Render the mentor dashboard */}
      <MentorDashboard />
    </div>
  );
}
