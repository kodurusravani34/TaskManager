import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  UserCircle,
  LogOut,
  Menu,
  X,
  Rocket,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
  { to: '/projects', label: 'PROJECTS', icon: FolderKanban },
  { to: '/tasks', label: 'TASKS', icon: CheckSquare },
  { to: '/team', label: 'TEAM', icon: Users },
  { to: '/profile', label: 'PROFILE', icon: UserCircle },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex relative font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-dark-900/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Moderate width (w-64) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r-4 border-dark-900
          transform transition-transform duration-200 ease-out flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo - Moderate height (h-16) */}
        <div className="h-16 flex items-center gap-3 px-5 border-b-4 border-dark-900 bg-dark-800">
          <div className="w-8 h-8 border-2 border-dark-900 bg-dark-900 flex items-center justify-center brutal-shadow-sm">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black text-white uppercase tracking-tighter">ProjectPilot</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1.5 border-2 border-dark-900 bg-white brutal-shadow-sm"
          >
            <X className="w-5 h-5 text-dark-900" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-5 space-y-3 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 border-2 transition-all brutal-shadow-sm font-black text-sm tracking-widest
                ${isActive
                  ? 'bg-dark-900 text-white border-dark-900 translate-x-1'
                  : 'bg-white text-dark-900 border-dark-900 hover:bg-accent hover:-translate-y-1'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t-4 border-dark-900 bg-white">
          <div className="flex items-center gap-3 p-3 border-2 border-dark-900 mb-4 bg-white brutal-shadow-sm">
            <div className="w-8 h-8 bg-accent border-2 border-dark-900 flex items-center justify-center text-dark-900 font-black text-sm">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-dark-900 truncate uppercase">{user?.name}</p>
              <p className="text-xs font-bold text-dark-500 truncate uppercase">USER</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary w-full flex items-center justify-center gap-2 text-sm py-2.5"
          >
            <LogOut className="w-4 h-4" />
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b-4 border-dark-900 flex items-center px-5 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 border-2 border-dark-900 bg-accent brutal-shadow-sm mr-4"
          >
            <Menu className="w-5 h-5 text-dark-900" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-dark-900 uppercase hidden sm:block tracking-widest">
              WORKSPACE <span className="font-black text-white bg-dark-900 px-3 py-1 border-2 border-dark-900 ml-2 brutal-shadow-sm">{user?.name}</span>
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
