import '../styles/tokens.css';
import '../styles/global.css';
import { Route, Routes } from 'react-router-dom';
import GNB from '../components/layout/GNB';
import { AuthProvider } from '../features/auth/AuthContext';
import LoginModal from '../components/auth/LoginModal';
import HomePage from '../pages/HomePage';
import CourseDetailPage from '../pages/CourseDetailPage';
import SavedPage from '../pages/SavedPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <GNB />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <LoginModal />
    </AuthProvider>
  );
}

