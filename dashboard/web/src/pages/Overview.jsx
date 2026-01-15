import React, { useEffect, useState } from "react";
import { opsEvents, opsRides } from "../api/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { ActivitySquare, BarChart3, FileText } from "lucide-react";

export default function Overview() {
  const [rides, setRides] = useState([]);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    opsRides().then(setRides).catch(() => setRides([]));
    opsEvents().then(setEvents).catch(() => setEvents([]));
  }, []);
  const active = rides.filter(r => r.status && !["completed","cancelled"].includes(r.status.toLowerCase())).length;
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivitySquare className="h-4 w-4 text-cyan-400" />
            Active Rides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-cyan-300">{active}</div>
            <div className="relative">
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-500 animate-ping opacity-75" />
              <span className="relative h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 shadow-[0_0_0_1px_rgba(34,211,238,0.25)]" />
            </div>
          </div>
          <p className="mt-2 text-xs text-neutral-400">Live pulse shows ongoing operations</p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-violet-400" />
            Total Rides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-violet-300">{rides.length}</div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                Trend
              </span>
            </div>
          </div>
          <div className="mt-3 h-8 w-full rounded-md bg-gradient-to-r from-violet-500/20 to-cyan-500/20" />
        </CardContent>
      </Card>

      <Card className="md:col-span-1 relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-300">
            Showing last {Math.min(10, events.length)} events
          </p>
          <div className="mt-4 space-y-3">
            {events.slice(-5).reverse().map((ev, i) => {
              const a = String(ev.action || "").toLowerCase();
              const color = a.includes("error")
                ? "red"
                : a.includes("warn")
                ? "yellow"
                : "cyan";
              const dot =
                color === "red"
                  ? "bg-red-500"
                  : color === "yellow"
                  ? "bg-yellow-400"
                  : "bg-cyan-400";
              return (
                <div key={i} className="relative pl-4 border-l border-neutral-800">
                  <span className={`absolute -left-1 top-2 h-2 w-2 rounded-full ${dot}`} />
                  <div className="flex items-center justify-between rounded-md px-3 py-2 bg-neutral-900/40 border border-neutral-800">
                    <span className="text-sm font-medium text-neutral-100">{ev.action}</span>
                    <span className="text-xs text-neutral-400">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              );
            })}
            {events.length === 0 && (
              <div className="space-y-2">
                <div className="h-6 w-full rounded-md bg-neutral-800 animate-pulse" />
                <div className="h-6 w-5/6 rounded-md bg-neutral-800 animate-pulse" />
                <div className="h-6 w-4/6 rounded-md bg-neutral-800 animate-pulse" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
