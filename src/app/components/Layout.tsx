import { Outlet, Link, useLocation, Navigate } from 'react-router';
import { Home, Dumbbell, TrendingUp, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUserProfile } from '../lib/storage';

export function Layout() {
  const location = useLocation();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const profile = await getUserProfile();
      setIsOnboarded(profile?.onboarded ?? false);
    };

    checkOnboarding();
  }, []);

  // Show loading state while checking onboarding status
  if (isOnboarded === null) {
    return null;
  }

  // Redirect to onboarding if not completed
  if (!isOnboarded) {
    return <Navigate to="/get-started" replace />;
  }

  const navigation = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold text-gray-900">Fitness Consistency App</h1>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {menuOpen ? (
              <X className="size-6 text-gray-600" />
            ) : (
              <Menu className="size-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-gray-100 bg-white">
            <nav className="p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Icon className="size-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
