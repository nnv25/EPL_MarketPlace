import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // Перенаправление на страницу входа, если не авторизован
  }

  return children; // Если авторизован, показываем защищённый контент
};

export default ProtectedRoute;