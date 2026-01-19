import React, { useEffect, useMemo, useState } from "react";
import { Card, Table, Tag, Button, message } from "antd";
import { opsRides, opsEvents, acceptRide, declineRide } from "../api/client";

export default function LiveOps() {
  const [rides, setRides] = useState([]);
  
  // Handle accept ride request
  const handleAcceptRide = async (ride) => {
    try {
      await acceptRide(ride.rideId || ride.id);
      message.success("Ride accepted successfully!");
      // Refresh the rides list
      load();
    } catch (error) {
      console.error("Failed to accept ride:", error);
      message.error("Failed to accept ride");
    }
  };
  
  // Handle decline ride request
  const handleDeclineRide = async (ride) => {
    try {
      await declineRide(ride.rideId || ride.id);
      message.success("Ride declined successfully!");
      // Refresh the rides list
      load();
    } catch (error) {
      console.error("Failed to decline ride:", error);
      message.error("Failed to decline ride");
    }
  };
  
  const columns = useMemo(() => [
    { title: "Chat", dataIndex: "chat" },
    { title: "Product", dataIndex: "product" },
    { title: "Status", dataIndex: "status", render: s => {
      const map = { processing: "volcano", accepted: "blue", arriving: "gold", in_progress: "green", completed: "default" };
      const color = map[(s || "").toLowerCase()] || "default";
      return <Tag color={color}>{s}</Tag>;
    }},
    { title: "Driver", dataIndex: "driver" },
    { 
      title: "Actions", 
      key: "actions",
      render: (_, ride) => {
        // Show accept/decline buttons only for new ride requests (processing status)
        if (ride.status && ride.status.toLowerCase() === "processing") {
          return (
            <div style={{ display: "flex", gap: "8px" }}>
              <Button 
                type="primary" 
                size="small"
                onClick={() => handleAcceptRide(ride)}
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              >
                Accept
              </Button>
              <Button 
                type="primary" 
                size="small"
                danger
                onClick={() => handleDeclineRide(ride)}
              >
                Decline
              </Button>
            </div>
          );
        }
        return null;
      }
    }
  ], []);
  
  useEffect(() => {
    function load() {
      opsRides().then(setRides).catch(() => setRides([]));
    }
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);
  
  return (
    <Card title="Live Operations">
      <Table rowKey={(r, i) => i} dataSource={rides} columns={columns} pagination={{ pageSize: 10 }} />
    </Card>
  );
}
