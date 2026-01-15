import React, { useEffect, useMemo, useState } from "react";
import { Card, Table, Tag, Input, Select, Space, Button } from "antd";
import { opsRides } from "../api/client";

export default function Transactions() {
  const [rides, setRides] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => {
    opsRides().then(setRides).catch(() => setRides([]));
  }, []);
  const statuses = useMemo(() => Array.from(new Set(rides.map(r => (r.status || "").toLowerCase()))), [rides]);
  const filtered = useMemo(() => {
    return rides.filter(r => {
      if (status && (r.status || "").toLowerCase() !== status) return false;
      if (q && !(`${r.chat} ${r.product} ${r.fare} ${r.phone}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [rides, q, status]);
  function exportCsv() {
    const rows = [["chat","product","status","driver","fare","phone"], ...filtered.map(r => [r.chat, r.product, r.status, r.driver, r.fare, r.phone])];
    const csv = rows.map(r => r.map(c => `"${c ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  const columns = [
    { title: "Chat", dataIndex: "chat" },
    { title: "Product", dataIndex: "product" },
    { title: "Status", dataIndex: "status", render: s => <Tag>{s}</Tag> },
    { title: "Driver", dataIndex: "driver" },
    { title: "Fare", dataIndex: "fare" },
    { title: "Phone", dataIndex: "phone" }
  ];
  return (
    <Card title="Transactions" extra={<Button onClick={exportCsv}>Export CSV</Button>}>
      <Space style={{ marginBottom: 12 }}>
        <Input placeholder="Search" value={q} onChange={e => setQ(e.target.value)} />
        <Select placeholder="Status" allowClear style={{ minWidth: 160 }} value={status} onChange={setStatus} options={statuses.map(s => ({ value: s, label: s }))} />
      </Space>
      <Table rowKey={(r, i) => i} dataSource={filtered} columns={columns} pagination={{ pageSize: 20 }} />
    </Card>
  );
}
