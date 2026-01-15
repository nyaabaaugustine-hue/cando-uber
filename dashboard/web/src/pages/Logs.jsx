import React, { useEffect, useMemo, useState } from "react";
import { Card, Table, Input, DatePicker, Button } from "antd";
import { opsEvents } from "../api/client";
import { toCsv, downloadCsv } from "../utils/csv";

const { RangePicker } = DatePicker;

export default function Logs() {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [range, setRange] = useState(null);
  useEffect(() => {
    opsEvents().then(setEvents).catch(() => setEvents([]));
  }, []);
  const filtered = useMemo(() => {
    return events.filter(ev => {
      const q = query.trim().toLowerCase();
      const okQ = !q || (String(ev.actor || "").toLowerCase().includes(q) || String(ev.action || "").toLowerCase().includes(q) || String(ev.detail || "").toLowerCase().includes(q));
      const okR = !range || (ev.timestamp >= range[0].valueOf() && ev.timestamp <= range[1].valueOf());
      return okQ && okR;
    });
  }, [events, query, range]);
  const columns = [
    { title: "Time", dataIndex: "timestamp", render: t => new Date(t).toLocaleString() },
    { title: "Actor", dataIndex: "actor" },
    { title: "Action", dataIndex: "action" },
    { title: "Detail", dataIndex: "detail" }
  ];
  function exportCsv() {
    const csv = toCsv(filtered, [
      { title: "Time", dataIndex: r => new Date(r.timestamp).toISOString() },
      { title: "Actor", dataIndex: "actor" },
      { title: "Action", dataIndex: "action" },
      { title: "Detail", dataIndex: "detail" }
    ]);
    downloadCsv("logs.csv", csv);
  }
  return (
    <Card title="System Logs" extra={<Button onClick={exportCsv}>Export CSV</Button>}>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <Input placeholder="Search actor/action/detail" value={query} onChange={e => setQuery(e.target.value)} />
        <RangePicker showTime onChange={setRange} />
      </div>
      <Table rowKey={(r, i) => i} dataSource={filtered} columns={columns} pagination={{ pageSize: 15 }} />
    </Card>
  );
}
