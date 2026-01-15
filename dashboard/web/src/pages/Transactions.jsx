import React, { useEffect, useState } from "react";
import { Card, Table, Badge, Form, InputGroup, Button } from "react-bootstrap";
import { opsRides } from "../api/client";

export default function Transactions() {
  const [rides, setRides] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    try {
      const data = await opsRides();
      setRides(data);
    } catch (error) {
      console.error("Failed to load rides:", error);
    }
  };

  const completedRides = rides.filter(r => 
    r.status?.toLowerCase() === "completed"
  );

  const filteredTransactions = completedRides.filter(ride => 
    !filter || 
    String(ride.chat).includes(filter) ||
    ride.product?.toLowerCase().includes(filter.toLowerCase())
  );

  const totalRevenue = filteredTransactions.length * 15.5;

  return (
    <div>
      <div className="mb-3">
        <h1 className="display-6 fw-bold text-dark mb-1">
          <i className="bi bi-cash-stack text-success me-2"></i>
          Transactions
        </h1>
        <p className="text-muted mb-0">Financial records and payment history</p>
      </div>

      {/* Revenue Summary */}
      <Card className="border-0 shadow-sm mb-3 bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Card.Body className="text-white p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="text-white-50 mb-2">Total Revenue</h6>
              <h2 className="fw-bold mb-0">₵{totalRevenue.toFixed(2)}</h2>
            </div>
            <div className="text-end">
              <h6 className="text-white-50 mb-2">Transactions</h6>
              <h2 className="fw-bold mb-0">{filteredTransactions.length}</h2>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Search */}
      <Card className="border-0 shadow-sm mb-3">
        <Card.Body>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search transactions..."
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

      {/* Transactions Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 pt-4 pb-3">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-receipt text-success me-2"></i>
            Transaction History
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-2"></i>
              <p>{filter ? "No transactions match your search" : "No completed transactions"}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 ps-4">Transaction ID</th>
                    <th className="border-0">Chat</th>
                    <th className="border-0">Product</th>
                    <th className="border-0">Driver</th>
                    <th className="border-0">Amount</th>
                    <th className="border-0">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((ride, index) => (
                    <tr key={index}>
                      <td className="ps-4 font-monospace">
                        <small>TXN-{String(index + 1).padStart(5, '0')}</small>
                      </td>
                      <td className="fw-semibold">
                        <i className="bi bi-hash text-muted"></i>
                        {ride.chat}
                      </td>
                      <td>
                        <Badge bg="light" text="dark" className="border">
                          {ride.product || "Standard"}
                        </Badge>
                      </td>
                      <td>
                        {ride.driver ? (
                          <span>
                            <i className="bi bi-person-circle text-success me-2"></i>
                            {ride.driver}
                          </span>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td className="fw-bold text-success">
                        ₵{ride.fare || "15.50"}
                      </td>
                      <td>
                        <Badge bg="success">
                          <i className="bi bi-check-circle me-1"></i>
                          Paid
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
