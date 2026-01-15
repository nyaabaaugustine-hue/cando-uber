import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MapView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Map View</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Map provider can be integrated here (Leaflet/Mapbox/Google). Markers clickable to open detail panels.
        </p>
      </CardContent>
    </Card>
  );
}
