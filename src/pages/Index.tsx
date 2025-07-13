
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to dashboard since we're using Layout component
  return <Navigate to="/" replace />;
};

export default Index;
