import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function MentorReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          View and export evaluation reports for your teams
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Reports Coming Soon</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            This feature will allow you to generate and export detailed evaluation reports for your teams.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
