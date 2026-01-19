import React, { useEffect, useState } from "react";
import { Card, Table, Badge, Form, InputGroup, Button } from "react-bootstrap";
import { opsEvents, notifyAdmin } from "../api/client";

export default function Logs() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("");
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    loadEvents();
    const interval = setInterval(loadEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadEvents = async () => {
    try {
      const data = await opsEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };
  
  const sendToTelegram = async (ev) => {
    try {
      setSendingId(ev.timestamp);
      await notifyAdmin({
        action: ev.action,
        actor: ev.actor,
        detail: ev.detail
      });
    } catch (e) {
    } finally {
      setSendingId(null);
    }
  };

  const filteredEvents = events.filter(ev => 
    !filter || 
    ev.action?.toLowerCase().includes(filter.toLowerCase()) ||
    ev.actor?.toLowerCase().includes(filter.toLowerCase()) ||
    ev.detail?.toLowerCase().includes(filter.toLowerCase())
  );

  const getEventBadge = (action) => {
    const actionLower = String(action || "").toLowerCase();
    if (actionLower.includes("error")) return { bg: "danger", icon: "bi-x-circle" };
    if (actionLower.includes("warning") || actionLower.includes("warn")) return { bg: "warning", icon: "bi-exclamation-triangle" };
    if (actionLower.includes("completed") || actionLower.includes("success")) return { bg: "success", icon: "bi-check-circle" };
    if (actionLower.includes("started") || actionLower.includes("accepted")) return { bg: "info", icon: "bi-info-circle" };
    return { bg: "secondary", icon: "bi-circle" };
  };

  return (
    <div>
      <div className="mb-3">
        <h1 className="display-6 fw-bold text-dark mb-1">
          <i className="bi bi-journal-text text-info me-2"></i>
          System Logs
        </h1>
        <p className="text-muted mb-0">Activity logs and system events</p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-file-text text-primary fs-2 d-block mb-2"></i>
              <h4 className="fw-bold mb-0">{events.length}</h4>
              <small className="text-muted">Total Events</small>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-check-circle text-success fs-2 d-block mb-2"></i>
              <h4 className="fw-bold mb-0">
                {events.filter(e => e.action?.toLowerCase().includes("completed")).length}
              </h4>
              <small className="text-muted">Success</small>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-exclamation-triangle text-warning fs-2 d-block mb-2"></i>
              <h4 className="fw-bold mb-0">
                {events.filter(e => e.action?.toLowerCase().includes("warn")).length}
              </h4>
              <small className="text-muted">Warnings</small>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-x-circle text-danger fs-2 d-block mb-2"></i>
              <h4 className="fw-bold mb-0">
                {events.filter(e => e.action?.toLowerCase().includes("error")).length}
              </h4>
              <small className="text-muted">Errors</small>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-sm mb-3">
        <Card.Body>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search logs..."
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

      {/* Logs Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 pt-4 pb-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">
              <i className="bi bi-list-ul text-info me-2"></i>
              Event Log
            </h5>
            <Button variant="outline-primary" size="sm" onClick={loadEvents}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-2"></i>
              <p>{filter ? "No events match your search" : "No events available"}</p>
            </div>
          ) : (
            <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <Table hover className="mb-0">
                <thead className="bg-light sticky-top">
                  <tr>
                    <th className="border-0 ps-4">Timestamp</th>
                    <th className="border-0">Level</th>
                    <th className="border-0">Action</th>
                    <th className="border-0">Actor</th>
                    <th className="border-0">Details</th>
                    <th className="border-0">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.slice().reverse().map((ev, index) => {
                    const badge = getEventBadge(ev.action);
                    return (
                      <tr key={index}>
                        <td className="ps-4 font-monospace small">
                          {new Date(ev.timestamp).toLocaleString()}
                        </td>
                        <td>
                          <Badge bg={badge.bg}>
                            <i className={`${badge.icon} me-1`}></i>
                          </Badge>
                        </td>
                        <td className="fw-semibold">{ev.action}</td>
                        <td>
                          {ev.actor ? (
                            <span>
                              <i className="bi bi-person-circle text-primary me-2"></i>
                              {ev.actor}
                            </span>
                          ) : (
                            <span className="text-muted">System</span>
                          )}
                        </td>
                        <td>
                          <small className="text-muted">
                            {ev.detail || "-"}
                          </small>
                        </td>
                        <td>
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            onClick={() => sendToTelegram(ev)}
                            disabled={sendingId === ev.timestamp}
                          >
                            {sendingId === ev.timestamp ? (
                              <span><i className="bi bi-hourglass-split me-1"></i>Sending</span>
                            ) : (
                              <span><i className="bi bi-send me-1"></i>Notify</span>
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
