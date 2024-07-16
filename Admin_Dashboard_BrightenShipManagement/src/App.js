import React, { useState , useEffect  } from 'react';
import { Layout, Menu,Button, Avatar } from 'antd';
import { TeamOutlined, FileOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import logo from './logo.jpg';
import Resume from './pages/Resume';
import CrewPage from './pages/CrewPage';
import Login from './Components/Login/Login';

const { Header, Sider, Content } = Layout;

const Sidebar = () => {
  const location = useLocation();

  return (
    <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
      <Menu.Item key="/pages/resume" icon={<FileOutlined />}>
        <Link to="/pages/resume">Resume</Link>
      </Menu.Item>
      <Menu.Item key="/pages/CrewPage" icon={<TeamOutlined/>}>
        <Link to="/pages/CrewPage">Crew</Link>
      </Menu.Item>
    </Menu>
  );
};

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already logged in (by checking the localStorage flag)
    const isLoggedInLocal = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(isLoggedInLocal === 'true');
    setIsInitialized(true); // Mark the login state as initialized
    setIsLoading(false); // Set loading state to false once the login state is fetched
  }, [isLoggedIn]); // Add isLoggedIn as a dependency here

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // Set the localStorage flag to indicate the user is logged in
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Clear the localStorage flag when the user logs out
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh', padding: '0px' }}>
        {isInitialized ? (
          // Only render when the login state is initialized
          <>
            {!isLoading ? (
              // Render the content once loading is false
              <>
                {isLoggedIn ? (
                  <>
                    <Sider>
                      <div className="logo" />
                      <div style={{ padding: '16px', color: '#fff' }}>Dashboard</div>
                      <Sidebar />
                    </Sider>
                    <Layout>
                      <Header style={{ background: '#fff', padding: 0, display: 'flex', alignItems: 'center' }}>
                        <div className="logo">
                          <img
                            src={logo}
                            alt="Logo"
                            style={{ height: '70px', marginRight: '16px', marginLeft: '30px', paddingTop: '30px' }}
                          />
                        </div>
                        <h2 style={{ margin: 0, flex: 1, textAlign: 'center', paddingBottom: '12px' }}>
                          Admin Dashboard
                        </h2>
                        {isLoggedIn && (
                          <Button onClick={handleLogout} style={{ marginRight: '20px', marginLeft: 'auto' }}>
                            Logout
                          </Button>
                        )}
                      </Header>
                      <Content style={{ margin: '16px' }}>
                        <Routes>
                          <Route path="/" element={<Navigate to="/pages/resume" />} />
                          <Route path="/pages/resume" element={<Resume />} />
                          <Route path="/pages/CrewPage" element={<CrewPage />} />
                        </Routes>
                      </Content>
                    </Layout>
                  </>
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )}
              </>
            ) : (
              // Show a loading placeholder if loading is true
              <div>Loading...</div>
            )}
          </>
        ) : (
          // Show a loading placeholder while the login state is being initialized
          <div>Loading...</div>
        )}
      </Layout>
    </Router>
  );
};

export default Dashboard;
