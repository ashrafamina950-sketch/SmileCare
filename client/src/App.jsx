import { Link, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import { Services, ServiceDetail } from './pages/Services.jsx';
import { Doctors, DoctorDetail } from './pages/Doctors.jsx';
import Reviews from './pages/Reviews.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Book from './pages/Book.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Login from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Appointments from './pages/admin/Appointments.jsx';
import Messages from './pages/admin/Messages.jsx';
import { ManageDoctors, ManageServices, ManageReviews } from './pages/admin/Manage.jsx';

function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <h1 className="text-5xl font-extrabold">404</h1>
      <p className="mt-2 text-slate-600">We could not find that page.</p>
      <Link to="/" className="btn-primary mt-6">
        Go home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/:slug" element={<DoctorDetail />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="book" element={<Book />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="doctors" element={<ManageDoctors />} />
        <Route path="services" element={<ManageServices />} />
        <Route path="reviews" element={<ManageReviews />} />
        <Route path="messages" element={<Messages />} />
      </Route>
    </Routes>
  );
}
