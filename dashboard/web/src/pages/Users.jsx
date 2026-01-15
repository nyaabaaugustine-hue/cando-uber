import React, { useEffect, useState } from "react";
import { Card, Table, Button, Modal, Form, Badge, InputGroup } from "react-bootstrap";
import { listUsers, disableUser, createUser } from "../api/client";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    roles: []
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const handleShowModal = () => {
    setFormData({ email: "", password: "", roles: [] });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ email: "", password: "", roles: [] });
  };

  const handleRoleToggle = (role) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser({
        email: formData.email,
        password: formData.password,
        roles: formData.roles.length > 0 ? formData.roles : ["viewer"]
      });
      await loadUsers();
      handleCloseModal();
    } catch (error) {
      alert("Failed to create user: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (userId, userEmail) => {
    if (!confirm(`Are you sure you want to disable user: ${userEmail}?`)) return;
    try {
      await disableUser(userId);
      await loadUsers();
    } catch (error) {
      alert("Failed to disable user: " + error.message);
    }
  };

  const filteredUsers = users.filter(user =>
    !filter ||
    user.email?.toLowerCase().includes(filter.toLowerCase()) ||
    user.roles?.some(r => r.toLowerCase().includes(filter.toLowerCase()))
  );

  const getRoleBadge = (role) => {
    const colors = {
      admin: "danger",
      dispatcher: "primary",
      viewer: "secondary"
    };
    return <Badge bg={colors[role] || "secondary"} className="me-1">{role}</Badge>;
  };

  return (
    <div>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <h1 className="display-6 fw-bold text-dark mb-1">
            <i className="bi bi-people text-primary me-2"></i>
            User Management
          </h1>
          <p className="text-muted mb-0">Manage system users and permissions</p>
        </div>
        <Button variant="primary" size="lg" onClick={handleShowModal}>
          <i className="bi bi-plus-circle me-2"></i>
          Add User
        </Button>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-sm mb-3">
        <Card.Body>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search users by email or role..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            {filter && (
              <Button variant="outline-secondary" onClick={() => setFilter("")}>
                <i className="bi bi-x"></i>
              </Button>
            )}
          </InputGroup>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 pt-3 pb-2">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-table text-primary me-2"></i>
            Users List ({filteredUsers.length})
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-2"></i>
              <p>{filter ? "No users match your search" : "No users available"}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 ps-4">
                      <i className="bi bi-person me-2"></i>Email
                    </th>
                    <th className="border-0">
                      <i className="bi bi-shield me-2"></i>Roles
                    </th>
                    <th className="border-0">
                      <i className="bi bi-toggle-on me-2"></i>Status
                    </th>
                    <th className="border-0 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="bi bi-person-circle text-primary fs-5"></i>
                          </div>
                          <span className="fw-semibold">{user.email}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {user.roles?.map((role) => getRoleBadge(role))}
                        </div>
                      </td>
                      <td>
                        {user.enabled ? (
                          <Badge bg="success">
                            <i className="bi bi-check-circle me-1"></i>Active
                          </Badge>
                        ) : (
                          <Badge bg="secondary">
                            <i className="bi bi-x-circle me-1"></i>Disabled
                          </Badge>
                        )}
                      </td>
                      <td className="text-center">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDisable(user.id, user.email)}
                          disabled={!user.enabled}
                        >
                          <i className="bi bi-ban"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add User Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>
            <i className="bi bi-person-plus-fill me-2 text-primary"></i>
            Create New User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="bi bi-envelope me-2"></i>Email Address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoFocus
              />
              <Form.Text className="text-muted">
                This will be used for login
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="bi bi-key me-2"></i>Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
              <Form.Text className="text-muted">
                Minimum 6 characters
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">
                <i className="bi bi-shield-check me-2"></i>Roles
              </Form.Label>
              <div className="border rounded p-3 bg-light">
                {["admin", "dispatcher", "viewer"].map((role) => (
                  <Form.Check
                    key={role}
                    type="checkbox"
                    id={`role-${role}`}
                    label={
                      <span>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                        {role === "admin" && <Badge bg="danger" className="ms-2 small">Full Access</Badge>}
                        {role === "dispatcher" && <Badge bg="primary" className="ms-2 small">Operations</Badge>}
                        {role === "viewer" && <Badge bg="secondary" className="ms-2 small">Read Only</Badge>}
                      </span>
                    }
                    checked={formData.roles.includes(role)}
                    onChange={() => handleRoleToggle(role)}
                    className="mb-2"
                  />
                ))}
              </div>
              <Form.Text className="text-muted">
                Select at least one role (defaults to viewer)
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal}>
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading || !formData.email || !formData.password}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Create User
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
