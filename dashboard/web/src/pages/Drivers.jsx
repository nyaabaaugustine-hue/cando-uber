import React, { useEffect, useState } from "react";
import { Card, Table, Button, Modal, Form, Badge, InputGroup, Row, Col, Tabs, Tab } from "react-bootstrap";
import { getDrivers, createDriver, updateDriver } from "../api/client";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vehicleType: "taxi",
    vehiclePlate: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    capacity: 4,
    licenseNumber: "",
    licenseExpiry: "",
    isOnline: false,
    status: "pending"
  });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (error) {
      console.error("Failed to load drivers:", error);
      // If API fails, show empty array
      setDrivers([]);
    }
  };

  const handleShowModal = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      vehicleType: "taxi",
      vehiclePlate: "",
      vehicleModel: "",
      vehicleYear: "",
      vehicleColor: "",
      capacity: 4,
      licenseNumber: "",
      licenseExpiry: "",
      isOnline: false,
      status: "pending"
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createDriver(formData);
      await loadDrivers(); // Reload drivers list
      handleCloseModal();
      alert("Driver onboarded successfully!");
    } catch (error) {
      console.error("Failed to onboard driver:", error);
      alert("Failed to onboard driver: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (driverId, newStatus) => {
    try {
      await updateDriver(driverId, { status: newStatus });
      await loadDrivers(); // Reload drivers list
    } catch (error) {
      console.error("Failed to update driver status:", error);
      alert("Failed to update driver status");
    }
  };

  const handleOnlineToggle = async (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      try {
        await updateDriver(driverId, { isOnline: !driver.isOnline });
        await loadDrivers(); // Reload drivers list
      } catch (error) {
        console.error("Failed to toggle online status:", error);
        alert("Failed to update online status");
      }
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = !filter || 
      driver.name?.toLowerCase().includes(filter.toLowerCase()) ||
      driver.phone?.includes(filter) ||
      driver.vehiclePlate?.toLowerCase().includes(filter.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
      (activeTab === "online" && driver.isOnline) ||
      (activeTab === "offline" && !driver.isOnline) ||
      driver.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status) => {
    const colors = {
      active: "success",
      pending: "warning",
      suspended: "danger",
      inactive: "secondary"
    };
    return <Badge bg={colors[status] || "secondary"}>{status}</Badge>;
  };

  const getVehicleIcon = (type) => {
    const icons = {
      taxi: "bi-taxi-front",
      motorbike: "bi-bicycle",
      tricycle: "bi-truck",
      delivery: "bi-box-seam"
    };
    return icons[type] || "bi-car-front";
  };

  return (
    <div>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <h1 className="display-6 fw-bold text-dark mb-1">
            <i className="bi bi-person-badge text-primary me-2"></i>
            Driver Management
          </h1>
          <p className="text-muted mb-0">Onboard and manage your driver fleet</p>
        </div>
        <Button variant="primary" size="lg" onClick={handleShowModal}>
          <i className="bi bi-plus-circle me-2"></i>
          Onboard Driver
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-3">
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-people text-primary fs-2 d-block mb-2"></i>
              <h4 className="fw-bold mb-0">{drivers.length}</h4>
              <small className="text-muted">Total Drivers</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-circle-fill text-success fs-2 d-block mb-2"></i>
              <h4 className="fw-bold mb-0">{drivers.filter(d => d.isOnline).length}</h4>
              <small className="text-muted">Online Now</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-check-circle text-success fs-2 d-block mb-2"></i>
              <h4 className="fw-bold mb-0">{drivers.filter(d => d.status === "active").length}</h4>
              <small className="text-muted">Active</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-hourglass text-warning fs-2 d-block mb-2"></i>
              <h4 className="fw-bold mb-0">{drivers.filter(d => d.status === "pending").length}</h4>
              <small className="text-muted">Pending</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs and Search */}
      <Card className="border-0 shadow-sm mb-3">
        <Card.Body>
          <Row>
            <Col md={6}>
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                <Tab eventKey="all" title="All Drivers" />
                <Tab eventKey="online" title="Online" />
                <Tab eventKey="offline" title="Offline" />
                <Tab eventKey="pending" title="Pending" />
                <Tab eventKey="active" title="Active" />
              </Tabs>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search drivers..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                {filter && (
                  <Button variant="outline-secondary" onClick={() => setFilter("")}>
                    <i className="bi bi-x"></i>
                  </Button>
                )}
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Drivers Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 pt-3 pb-2">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-list text-primary me-2"></i>
            Drivers List ({filteredDrivers.length})
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredDrivers.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-2"></i>
              <p>{filter ? "No drivers match your search" : "No drivers available"}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 ps-4">Driver</th>
                    <th className="border-0">Contact</th>
                    <th className="border-0">Vehicle</th>
                    <th className="border-0">Stats</th>
                    <th className="border-0">Status</th>
                    <th className="border-0 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map((driver) => (
                    <tr key={driver.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="bi bi-person-circle text-primary fs-5"></i>
                          </div>
                          <div>
                            <div className="fw-semibold">{driver.name}</div>
                            <small className="text-muted">ID: {driver.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          <div><i className="bi bi-telephone me-2"></i>{driver.phone}</div>
                          <div><i className="bi bi-envelope me-2"></i>{driver.email}</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <i className={`${getVehicleIcon(driver.vehicleType)} me-2`}></i>
                          <Badge bg="light" text="dark" className="me-1">{driver.vehicleType}</Badge>
                        </div>
                        <small className="text-muted">
                          {driver.vehiclePlate} • {driver.vehicleModel}
                        </small>
                      </td>
                      <td>
                        <div className="small">
                          <div><i className="bi bi-star-fill text-warning me-1"></i>{driver.rating || 0}</div>
                          <div><i className="bi bi-truck me-1"></i>{driver.totalTrips || 0} trips</div>
                          <div className="text-success fw-semibold">GH₵{driver.earnings?.toFixed(2) || 0}</div>
                        </div>
                      </td>
                      <td>
                        <div className="mb-2">
                          {getStatusBadge(driver.status)}
                        </div>
                        <div>
                          <Badge bg={driver.isOnline ? "success" : "secondary"}>
                            <i className={`bi bi-circle-fill me-1`}></i>
                            {driver.isOnline ? "Online" : "Offline"}
                          </Badge>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                          {driver.status === "pending" && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleStatusChange(driver.id, "active")}
                              title="Approve"
                            >
                              <i className="bi bi-check-lg"></i>
                            </Button>
                          )}
                          {driver.status === "active" && (
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleStatusChange(driver.id, "suspended")}
                              title="Suspend"
                            >
                              <i className="bi bi-pause"></i>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Onboard Driver Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>
            <i className="bi bi-person-plus-fill me-2 text-primary"></i>
            Onboard New Driver
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          <Form onSubmit={handleSubmit}>
            <h6 className="fw-bold text-primary mb-3">Personal Information</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-person me-2"></i>Full Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-telephone me-2"></i>Phone Number
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="bi bi-envelope me-2"></i>Email Address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="driver@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>

            <hr />
            <h6 className="fw-bold text-primary mb-3">Vehicle Information</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Vehicle Type</Form.Label>
                  <Form.Select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  >
                    <option value="taxi">🚕 Taxi</option>
                    <option value="motorbike">🏍️ Motorbike</option>
                    <option value="tricycle">🛺 Tricycle</option>
                    <option value="delivery">🚚 Delivery Van</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">License Plate</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ABC-123"
                    value={formData.vehiclePlate}
                    onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Vehicle Model</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Toyota Camry"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Year</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="2020"
                    value={formData.vehicleYear}
                    onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Color</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Black"
                    value={formData.vehicleColor}
                    onChange={(e) => setFormData({ ...formData, vehicleColor: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Capacity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="8"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                required
              />
              <Form.Text className="text-muted">Number of passengers</Form.Text>
            </Form.Group>

            <hr />
            <h6 className="fw-bold text-primary mb-3">License Information</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">License Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="DL123456"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">License Expiry</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.licenseExpiry}
                    onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 justify-content-end mt-4">
              <Button variant="secondary" onClick={handleCloseModal}>
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Onboarding...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Onboard Driver
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
