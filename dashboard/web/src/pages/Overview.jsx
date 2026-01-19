import React, { useEffect, useState } from "react";
import { Row, Col, Card, Badge, ProgressBar, Spinner } from "react-bootstrap";
import { opsEvents, opsRides } from "../api/client";

export default function Overview() {
  const [rides, setRides] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [ridesData, eventsData] = await Promise.all([
        opsRides().catch(() => []),
        opsEvents().catch(() => [])
      ]);
      setRides(ridesData);
      setEvents(eventsData);
    } finally {
      setLoading(false);
    }
  };

  const activeRides = rides.filter(r => 
    r.status && !["completed", "cancelled"].includes(r.status.toLowerCase())
  );

  const completedToday = rides.filter(r => 
    r.status && r.status.toLowerCase() === "completed"
  );

  const revenue = completedToday.length * 15.5; // Mock calculation

  const statusColors = {
    processing: "warning",
    accepted: "info",
    arriving: "primary",
    in_progress: "success",
    completed: "secondary",
    cancelled: "danger"
  };

  return (
    <div>
      <div className="mb-3">
        <h1 className="display-6 fw-bold text-dark mb-1">
          <i className="bi bi-speedometer2 text-primary me-2"></i>
          Dashboard Overview
        </h1>
        <p className="text-muted mb-0">Real-time transport operations monitoring</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <Row className="g-3 mb-3">
            <Col md={6} lg={3}>
              <Card className="border-0 shadow-sm h-100 hover-lift">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted mb-1 text-uppercase small fw-semibold">Active Rides</p>
                      <h2 className="fw-bold text-primary mb-0">{activeRides.length}</h2>
                    </div>
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                      <i className="bi bi-broadcast text-primary fs-4"></i>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="badge bg-success bg-opacity-10 text-success">
                      <i className="bi bi-arrow-up me-1"></i>Live
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="border-0 shadow-sm h-100 hover-lift">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted mb-1 text-uppercase small fw-semibold">Total Rides</p>
                      <h2 className="fw-bold text-info mb-0">{rides.length}</h2>
                    </div>
                    <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                      <i className="bi bi-car-front text-info fs-4"></i>
                    </div>
                  </div>
                  <div className="mt-3">
                    <ProgressBar now={75} variant="info" style={{ height: '6px' }} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="border-0 shadow-sm h-100 hover-lift">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted mb-1 text-uppercase small fw-semibold">Completed</p>
                      <h2 className="fw-bold text-success mb-0">{completedToday.length}</h2>
                    </div>
                    <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                      <i className="bi bi-check-circle text-success fs-4"></i>
                    </div>
                  </div>
                  <div className="mt-3">
                    <small className="text-muted">Today's trips</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="border-0 shadow-sm h-100 hover-lift">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted mb-1 text-uppercase small fw-semibold">Revenue</p>
                      <h2 className="fw-bold text-warning mb-0">GH₵{revenue.toFixed(2)}</h2>
                    </div>
                    <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                      <i className="bi bi-cash-stack text-warning fs-4"></i>
                    </div>
                  </div>
                  <div className="mt-3">
                    <small className="text-success">
                      <i className="bi bi-graph-up me-1"></i>+12.5%
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-3">
            {/* Recent Activity */}
            <Col lg={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-white border-0 pt-4 pb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">
                      <i className="bi bi-activity text-primary me-2"></i>
                      Recent Activity
                    </h5>
                    <Badge bg="primary" pill>{events.length}</Badge>
                  </div>
                </Card.Header>
                <Card.Body className="pt-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {events.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      <p>No recent activity</p>
                    </div>
                  ) : (
                    <div className="activity-timeline">
                      {events.slice(-10).reverse().map((ev, i) => {
                        const action = String(ev.action || "").toLowerCase();
                        const iconClass = action.includes("error") 
                          ? "bi-exclamation-triangle text-danger"
                          : action.includes("completed")
                          ? "bi-check-circle text-success"
                          : "bi-info-circle text-info";
                        
                        return (
                          <div key={i} className="d-flex mb-3 pb-3 border-bottom">
                            <div className="me-3">
                              <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                <i className={`${iconClass} fs-5`}></i>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <p className="mb-1 fw-semibold">{ev.action}</p>
                              <small className="text-muted">
                                {ev.actor && `By ${ev.actor} • `}
                                {new Date(ev.timestamp).toLocaleString()}
                              </small>
                              {ev.detail && (
                                <p className="mb-0 mt-1 small text-muted">{ev.detail}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Active Rides */}
            <Col lg={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-white border-0 pt-4 pb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">
                      <i className="bi bi-geo-alt text-danger me-2"></i>
                      Active Rides
                    </h5>
                    <Badge bg="danger" pill className="pulse">{activeRides.length}</Badge>
                  </div>
                </Card.Header>
                <Card.Body className="pt-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {activeRides.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-car-front fs-1 d-block mb-2"></i>
                      <p>No active rides</p>
                    </div>
                  ) : (
                    activeRides.map((ride, i) => {
                      const statusColor = statusColors[ride.status?.toLowerCase()] || "secondary";
                      return (
                        <Card key={i} className="mb-3 border">
                          <Card.Body className="p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <h6 className="mb-1 fw-bold">
                                  <i className="bi bi-person-circle me-2"></i>
                                  Chat #{ride.chat}
                                </h6>
                                <p className="mb-0 small text-muted">
                                  <i className="bi bi-truck me-1"></i>
                                  {ride.product || "Standard"}
                                </p>
                              </div>
                              <Badge bg={statusColor}>
                                {ride.status}
                              </Badge>
                            </div>
                            {ride.driver && (
                              <div className="mt-2 pt-2 border-top">
                                <small className="text-muted">
                                  <i className="bi bi-person-badge me-1"></i>
                                  Driver: <span className="fw-semibold">{ride.driver}</span>
                                </small>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      );
                    })
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      <style jsx>{`
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
