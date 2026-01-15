import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Analytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics & Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Charts, trends, and exports (CSV/PDF) can be added here.
        </p>
      </CardContent>
    </Card>
  );
}
