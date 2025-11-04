import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Folder,
    Users,
    ListChecks,
    Grid3X3,
    Menu,
    X,
    CodeIcon
} from 'lucide-react';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        {
            name: 'Dashboard',
            path: '/',
            icon: <LayoutDashboard className="h-5 w-5" />
        },
        {
            name: 'Public Repos',
            path: '/public-repos',
            icon: <CodeIcon className="h-5 w-5" />
        },
        {
            name: 'Projects',
            path: '/projects',
            icon: <Folder className="h-5 w-5" />
        },
        {
            name: 'Users',
            path: '/users',
            icon: <Users className="h-5 w-5" />
        },
        {
            name: 'Tasks',
            path: '/tasks',
            icon: <ListChecks className="h-5 w-5" />
        },
        {
            name: 'Workspaces',
            path: '/workspaces',
            icon: <Grid3X3 className="h-5 w-5" />
        },
    ];

    return (
        <nav className="bg-gray-900 border-b border-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="bg-amber-600 p-2 rounded-lg">
                                <LayoutDashboard className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-white font-bold text-xl hidden md:block">
                                PCB
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="flex space-x-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === link.path
                                        ? 'bg-gray-800 text-amber-400'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    <span className="mr-2">{link.icon}</span>
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-gray-900 border-t border-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${location.pathname === link.path
                                    ? 'bg-gray-800 text-amber-400'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <span className="mr-2">{link.icon}</span>
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;