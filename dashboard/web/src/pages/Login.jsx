import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@local.test");
  const [password, setPassword] = useState("Admin123!");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password, otp || undefined);
      nav("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div 
      className="min-vh-100 d-flex align-items-center position-relative" 
      style={{ 
        backgroundImage: 'url(https://drivemond.app/wp-content/uploads/2025/04/ride-hailing.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better readability */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
          zIndex: 1
        }}
      ></div>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={7} xl={6} className="position-relative" style={{ zIndex: 2 }}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              <Card.Body className="p-4">
                <div className="text-center mb-3">
                  <img 
                    src="/logo.png" 
                    alt="CyberRide Logo" 
                    className="mb-2"
                    style={{ width: '100px', height: '100px', objectFit: 'contain', marginTop: '10px', marginBottom: '10px' }}
                  />
                  <h2 className="fw-bold mb-1">Welcome Back</h2>
                  <p className="text-muted mb-0">Sign in to CyberRide Dashboard</p>
                </div>

                <Form onSubmit={submit}>
                  <Form.Group className="mb-2">
                    <Form.Label className="fw-semibold">
                      <i className="bi bi-envelope me-2"></i>Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      size="lg"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="fw-semibold">
                      <i className="bi bi-lock me-2"></i>Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      size="lg"
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="fw-semibold">
                      <i className="bi bi-shield-check me-2"></i>OTP (Optional)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      size="lg"
                      placeholder="Enter OTP if enabled"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                      Only required if 2FA is enabled
                    </Form.Text>
                  </Form.Group>

                  {error && (
                    <Alert variant="danger" className="mb-2">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </Alert>
                  )}

                  <Button 
                    variant="primary" 
                    size="lg" 
                    type="submit" 
                    className="w-100 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Demo: admin@local.test / Admin123!
                  </small>
                </div>
              </Card.Body>
              
              <div className="bg-light p-2 text-center border-top">
                <small className="text-muted">
                  Secured by <span className="fw-semibold">CyberRide</span>
                </small>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
