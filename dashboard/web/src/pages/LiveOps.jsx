import React, { useEffect, useMemo, useState } from "react";
import { Card, Table, Tag, Button } from "antd";
import { opsRides, opsEvents } from "../api/client";

export default function LiveOps() {
  const [rides, setRides] = useState([]);
  const columns = useMemo(() => [
    { title: "Chat", dataIndex: "chat" },
    { title: "Product", dataIndex: "product" },
    { title: "Status", dataIndex: "status", render: s => {
      const map = { processing: "volcano", accepted: "blue", arriving: "gold", in_progress: "green", completed: "default" };
      const color = map[(s || "").toLowerCase()] || "default";
      return <Tag color={color}>{s}</Tag>;
    }},
    { title: "Driver", dataIndex: "driver" }
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
