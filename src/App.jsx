import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Board from './pages/Board.jsx';
import Committees from './pages/Committees.jsx';
import Delegates from './pages/Delegates.jsx';
import Register from './pages/Register.jsx';
import Staff from './pages/Staff.jsx';
import Sponsors from './pages/Sponsors.jsx';
import Faq from './pages/Faq.jsx';
import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';
import NotFound from './pages/NotFound.jsx';

// The admin panel is loaded only when someone opens /admin, so it never slows down the public site.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/board" element={<Board />} />
        <Route path="/committees" element={<Committees />} />
        <Route path="/delegates" element={<Delegates />} />
        <Route path="/register" element={<Register />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<div className="p-10 text-center text-navy-700">Loading…</div>}>
            <AdminApp />
          </Suspense>
        }
      />
    </Routes>
  );
}
