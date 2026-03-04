import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

// Components
import Navbar from './components/Navbar/Navbar';
import TestNavbar from './components/Navbar/TestNavbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages - Student
import Home from './pages/Home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile';
import StagesList from './pages/StagesList/StagesList';
import StageDetails from './pages/StageDetails/StageDetails';
import CompleteProfileStudent from './pages/Student/CompleteProfileStudent';
import Favorites from './pages/Student/Favorites';


// Pages - Company
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyProfile from './pages/company/CompanyProfile';
import PostStage from './pages/company/PostStage';
import CompanyApplications from './pages/company/CompanyApplications';
import CompleteProfileCompany from './pages/company/CompleteProfileCompany';
import CompanyEditProfile from './pages/company/CompanyEditProfile';
import EditStage from './pages/company/EditStage';

// Pages - Admin
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProfile from './pages/Admin/AdminProfile';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminStages from './pages/Admin/AdminStages';
import AdminCompanies from './pages/Admin/AdminCompanies';
import EditProfilAdmin from './pages/Admin/EditProfilAdmin';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom-bootstrap.css';
import './styles/global.css';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App" style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Navbar />
          {/*<TestNavbar/>*/}

          <main style={{ flex: 1 }}>
            <Routes>
              {/* ===== PUBLIC ROUTES ===== */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/stages" element={<StagesList />} />
              <Route path="/stages/:id" element={<StageDetails />} />

              {/* ===== STUDENT ROUTES ===== */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/complete-profile-student"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <CompleteProfileStudent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mes-candidatures"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Favorites />
                  </ProtectedRoute>
                }
              />

              {/* ===== COMPANY ROUTES ===== */}
              <Route
                path="/company/profile"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <CompanyProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/edit-stage/:id"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <EditStage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/edit-profile"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <CompanyEditProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/complete-profile-company"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <CompleteProfileCompany />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <CompanyDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/post-stage"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <PostStage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/applications"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <CompanyApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/stages/:id"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <StageDetails />
                  </ProtectedRoute>
                }
              />

              {/* ===== ADMIN ROUTES ===== */}
              <Route
                path="/admin/profile"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/edit-profil-admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <EditProfilAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/stages"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminStages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/companies"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminCompanies />
                  </ProtectedRoute>
                }
              />

              {/* ===== 404 NOT FOUND ===== */}
              <Route
                path="*"
                element={
                  <div style={{
                    minHeight: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}>
                    <h1 style={{ fontSize: '5rem', color: '#0066CC' }}>404</h1>
                    <h3>Page non trouvée</h3>
                    <p className="text-muted">La page que vous recherchez n'existe pas.</p>
                    <a href="/" className="btn btn-primary mt-3" style={{
                      backgroundColor: '#0066CC',
                      borderColor: '#0066CC',
                      borderRadius: '10px',
                      padding: '0.75rem 2rem'
                    }}>
                      Retour à l'accueil
                    </a>
                  </div>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;