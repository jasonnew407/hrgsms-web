import React from 'react'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import HomePage from './web/HomePage.jsx'
import FAQPage from './web/FAQPage'
import ServicesPage from './web/ServicePage.jsx'
import ContactPage from './web/Contact.jsx'
import ManagementPortalLogin from './web/ManagementPortalLogin.jsx'
import GuestLoginPage from './web/GuestLoginPage.jsx'
import GuestSignupPage from './web/GuestSignupPage.jsx'
import ManagementPortal from './web/ManagementPortal.jsx'
import BranchesPage from './web/BranchesPage.jsx'
import BookingPage from './web/BookingSearchPage.jsx'
import RoomSelectionPage from './web/RoomSelectionPage.jsx'
import FinalizeBookingPage from './web/FinalizeBookingPage.jsx'
import TermsConditionsPage from './web/TermsConditionPage.jsx'
import BookingConfirmationPage from './web/BookingConfirmationPage.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import UserManagement from './web/UserManagement.jsx'
import RoleManagement from './web/RoleManagement.jsx'
import UserActivityLog from './web/UserActivityLog.jsx'
import BranchManagement from './web/BranchManagement.jsx'
import EditProfile from './web/EditProfile.jsx'
import RoleProtectedRoute from './components/RoleProtectedRoute.jsx';
import Unauthorized from './web/Unauthorized.jsx'
import AdminDashboard from './web/AdminDashboard.jsx'

export default function App() {
  return <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path ="/" element={<HomePage />} />
      
      
      
  
      <Route path ="/management-portal-login" element={<ManagementPortalLogin/>} />
      <Route path ="/guest-login" element={<GuestLoginPage/>} />
      <Route path ="/guest-signup" element={<GuestSignupPage/>} />
      <Route path ="/management" element={<ManagementPortal />} />
      <Route path ="/booking-search" element={<BookingPage />} />
      <Route path ="/room-selection" element={<RoomSelectionPage />} />
      <Route path ="/booking-final" element={<FinalizeBookingPage />} />
      <Route path ="/booking-terms" element={<TermsConditionsPage />} />
      <Route path ="/booking-confirmation" element={<BookingConfirmationPage/>} />

      <Route path ="/branches" element={<BranchesPage/>} />
      <Route path ="/contact-page" element={<ContactPage/>} />
      <Route path ="/faq-page" element={<FAQPage/>} />
      <Route path ="/service-page" element={<ServicesPage/>} />

      <Route path = "/user-management" element= {<RoleProtectedRoute allowedRoles={['admin', 'administrator']}><UserManagement /></RoleProtectedRoute>} />
      <Route path ="/role-manage" element={<RoleProtectedRoute allowedRoles={['admin', 'administrator']}><RoleManagement/></RoleProtectedRoute>} />
      <Route path ="/user-log" element={<RoleProtectedRoute allowedRoles={['admin', 'administrator']}><UserActivityLog /></RoleProtectedRoute>} />
      <Route path ="/branch-manage" element={<RoleProtectedRoute allowedRoles={['admin', 'administrator']}><BranchManagement/></RoleProtectedRoute>} />
      <Route path="/profile-edit" element={<EditProfile/>} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path ="/adminDashboard" element={<AdminDashboard />} />
    </Routes>
  </BrowserRouter>
}
