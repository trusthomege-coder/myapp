import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import About from './pages/About';
import Rent from './pages/Rent';
import Buy from './pages/Buy';
import Projects from './pages/Projects';
import Contacts from './pages/Contacts';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/rent" element={<Rent />} />
                  <Route path="/buy" element={<Buy />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<AdminPanel />} />
                </Routes>
              </main>
              <Footer />
              <AuthModal />
            </div>
          </Router>
        </FavoritesProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;