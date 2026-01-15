import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", icon: "bi-speedometer2", label: "Overview", roles: ["admin", "dispatcher", "viewer"] },
    { path: "/live", icon: "bi-broadcast", label: "Live Ops", roles: ["admin", "dispatcher"] },
    { path: "/drivers", icon: "bi-person-badge", label: "Drivers", roles: ["admin", "dispatcher"] },
    { path: "/map", icon: "bi-map", label: "Map View", roles: ["admin", "dispatcher"] },
    { path: "/analytics", icon: "bi-graph-up", label: "Analytics", roles: ["admin"] },
    { path: "/users", icon: "bi-people", label: "Users", roles: ["admin"] },
    { path: "/transactions", icon: "bi-cash-stack", label: "Transactions", roles: ["admin", "dispatcher"] },
    { path: "/logs", icon: "bi-journal-text", label: "Logs", roles: ["admin", "dispatcher"] },
  ];

  const userRoles = user?.roles || [];
  const filteredNavItems = navItems.filter(item => 
    item.roles.some(role => userRoles.includes(role))
  );

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-vh-100" style={{ 
      backgroundImage: 'url(https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Top Navbar */}
      <Navbar bg="dark" variant="dark" className="shadow-lg" style={{ borderBottom: '3px solid #667eea' }}>
        <Container fluid>
          <button 
            className="btn btn-link text-light me-3 p-0" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ fontSize: '1.5rem', textDecoration: 'none' }}
          >
            <i className="bi bi-list"></i>
          </button>
          <Navbar.Brand className="d-flex align-items-center">
            <img 
              src="/logo.png" 
              alt="CyberRide Logo" 
              style={{ 
                width: '45px', 
                height: '45px', 
                objectFit: 'contain',
                marginTop: '5px',
                marginBottom: '5px',
                marginRight: '10px'
              }}
            />
            <span className="fw-bold" style={{ fontSize: '1.3rem', letterSpacing: '1px' }}>CyberRide</span>
          </Navbar.Brand>
          <div className="ms-auto d-flex align-items-center">
            <span className="text-light me-3">
              <i className="bi bi-person-circle me-2"></i>
              {user?.email}
            </span>
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </Container>
      </Navbar>

      {/* Left Sidebar */}
      <div
        className="bg-dark text-white position-fixed top-0 start-0 h-100 shadow-lg"
        style={{
          width: sidebarOpen ? '250px' : '0',
          marginTop: '56px',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          zIndex: 1040
        }}
      >
        <div className="p-3" style={{ width: '250px' }}>
          <div className="mb-3 pb-3 border-bottom border-secondary">
            <small className="text-muted text-uppercase fw-semibold">Navigation</small>
          </div>
          <Nav className="flex-column">
            {filteredNavItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                className={`mb-2 p-3 rounded d-flex align-items-center ${
                  isActive(item.path) 
                    ? 'bg-primary text-white' 
                    : 'text-light hover-bg-secondary'
                }`}
                style={{ 
                  textDecoration: 'none',
                  transition: 'all 0.3s'
                }}
              >
                <i className={`${item.icon} me-3`} style={{ fontSize: '1.2rem' }}></i>
                <span>{item.label}</span>
              </Nav.Link>
            ))}
          </Nav>
          <div className="mt-4 pt-3 border-top border-secondary">
            <div className="text-muted small">
              <div className="mb-2">
                <i className="bi bi-shield-check me-2"></i>
                <strong>Roles:</strong>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {user?.roles?.map((role, i) => (
                  <span key={i} className="badge bg-secondary">{role}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: sidebarOpen ? '250px' : '0',
          marginTop: '56px',
          transition: 'margin-left 0.3s ease'
        }}
      >
        <Container fluid className="py-3">
          <div className="bg-white rounded-3 shadow-lg p-3" style={{ minHeight: 'calc(100vh - 100px)' }}>
            <Outlet />
          </div>
        </Container>
      </div>
    </div>
  );
}
