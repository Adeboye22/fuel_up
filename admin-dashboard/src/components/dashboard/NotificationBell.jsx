import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";

const NotificationBell = ({ count }) => {
    return (
      <Link to="notifications" className="relative">
        <FaBell className="text-accent-foreground hover:text-accent-foreground/50 cursor-pointer transition-colors" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-emerald-500 text-xs text-white rounded-full h-4 w-4 flex items-center justify-center">
            {count}
          </span>
        )}
      </Link>
    );
  };

  export default NotificationBell;