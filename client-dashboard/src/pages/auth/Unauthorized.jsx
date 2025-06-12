import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <ShieldAlert className="h-16 w-16 text-destructive" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        
        <p className="mb-6 text-muted-foreground">
          You do not have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        
        <Link 
          to="/signin" 
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Return to Sign In
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;