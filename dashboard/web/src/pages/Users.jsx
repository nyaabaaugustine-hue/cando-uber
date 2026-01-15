import React, { useEffect, useState } from "react";
import { Card, Table, Button } from "antd";
import { listUsers, disableUser, createUser } from "../api/client";

export default function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    listUsers().then(setUsers).catch(() => setUsers([]));
  }, []);
  async function disable(id) {
    await disableUser(id);
    setUsers(await listUsers());
  }
  async function add() {
    const email = prompt("Email:");
    const password = prompt("Temp Password:");
    const rolesStr = prompt("Roles (comma): admin,dispatcher,viewer");
    const roles = rolesStr ? rolesStr.split(",").map(s => s.trim()) : ["viewer"];
    await createUser({ email, password, roles });
    setUsers(await listUsers());
  }
  return (
    <Card title="User Management" extra={<Button onClick={add}>Create User</Button>}>
      <Table rowKey="id" dataSource={users} pagination={{ pageSize: 10 }} columns={[
        { title: "Email", dataIndex: "email" },
        { title: "Roles", dataIndex: "roles", render: r => r.join(", ") },
        { title: "Enabled", dataIndex: "enabled", render: e => String(e) },
        { title: "Actions", render: (_, u) => <Button size="small" onClick={() => disable(u.id)}>Disable</Button> }
      ]} />
    </Card>
  );
}
