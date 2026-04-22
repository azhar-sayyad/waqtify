import React, {useState} from 'react';
import {useAuthStore} from '@waqtify/core';
import {useNavigate, useLocation} from 'react-router-dom';
import {LayoutDashboard, BarChart2, Settings, Hexagon, Search, Bell, Menu, X} from 'lucide-react';
import {Button} from '@waqtify/ui';

export function AppLayout({children}: { children: React.ReactNode }) {
    const logout = useAuthStore(state => state.logout);
    const user = useAuthStore(state => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/landing');
    };

    const navLinks = [
        {name: 'Dashboard', path: '/', icon: LayoutDashboard},
        {name: 'Analytics', path: '/analytics', icon: BarChart2},
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // For now, just log the search - can be enhanced later
            console.log('Searching for:', searchQuery);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Top Navigation Bar */}
            <header
                className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 z-50">
                <div className="h-full flex items-center justify-between px-4 md:px-6">
                    {/* Logo & Mobile Menu Toggle */}
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Hexagon className="w-5 h-5 text-primary"/>
                            </div>
                            <span className="font-bold text-lg tracking-tight hidden sm:block">Waqtify</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 md:mx-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search habits, analytics..."
                                className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
                            />
                        </div>
                    </form>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            className="relative p-2 rounded-lg hover:bg-secondary transition-colors hidden md:block">
                            <Bell className="w-5 h-5 text-muted-foreground"/>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-border/30 hidden md:flex">
                            <div className="text-right">
                                <p className="text-sm font-medium leading-tight">{user?.name || 'Guest User'}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[120px]">{user?.email || 'guest@waqtify.com'}</p>
                            </div>
                            <div
                                className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-sm font-bold text-primary-foreground border-2 border-primary/20 shadow-sm">
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                        </div>

                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 pt-20 px-4 md:hidden">
                    <nav className="space-y-2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            const Icon = link.icon;
                            return (
                                <button
                                    key={link.name}
                                    onClick={() => {
                                        navigate(link.path);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                        isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }`}
                                >
                                    <Icon className="w-5 h-5"/>
                                    {link.name}
                                </button>
                            );
                        })}
                        <div className="pt-4 border-t border-border/30 mt-4">
                            <div className="flex items-center gap-3 px-4 py-3">
                                <div
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-base font-bold text-primary-foreground">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{user?.name || 'Guest User'}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email || 'guest@waqtify.com'}</p>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 pt-16 flex">
                {/* Sidebar (Desktop) */}
                <aside
                    className="fixed left-0 top-16 bottom-0 w-64 bg-card/30 backdrop-blur-xl border-r border-border/30 hidden md:flex flex-col z-30">
                    <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                        <p className="px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Main
                            Menu</p>
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            const Icon = link.icon;
                            return (
                                <button
                                    key={link.name}
                                    onClick={() => navigate(link.path)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                        isActive
                                            ? 'bg-primary/10 text-primary shadow-sm'
                                            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                                    }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                            isActive ? 'bg-primary/10' : 'bg-secondary/30'
                                        }`}>
                                        <Icon className="w-4 h-4"/>
                                    </div>
                                    {link.name}
                                </button>
                            );
                        })}

                        <div className="pt-6 mt-6 border-t border-border/30">
                            <p className="px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Settings</p>
                            <button
                                onClick={() => navigate('/settings')}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all"
                            >
                                <div className="w-8 h-8 rounded-lg bg-secondary/30 flex items-center justify-center">
                                    <Settings className="w-4 h-4"/>
                                </div>
                                Settings
                            </button>
                        </div>
                    </div>

                    {/* Pro Upgrade Card */}
                    <div className="p-4 border-t border-border/30">
                        <div
                            className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4">
                            <h4 className="text-sm font-bold text-foreground mb-1">Go Pro</h4>
                            <p className="text-xs text-muted-foreground mb-3">Unlock advanced analytics & unlimited
                                habits</p>
                            <Button size="sm" className="w-full text-xs h-8 bg-primary hover:bg-primary/90">
                                Upgrade Now
                            </Button>
                        </div>
                    </div>


                    <div className="p-4 border-t border-border/30">
                        <div>
                            <Button size="sm" className="w-full text-xs h-8 bg-primary hover:bg-primary/90"
                                    onClick={handleLogout}
                            >
                                log out

                            </Button>
                        </div>
                    </div>


                </aside>

                {/* Content Container */}
                <div className="flex-1 md:ml-64">
                    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-md border-t border-border/50 z-40 flex items-center justify-around px-2 safe-area-bottom">
                {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    const Icon = link.icon;
                    return (
                        <button
                            key={link.name}
                            onClick={() => navigate(link.path)}
                            className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-all ${
                                isActive ? 'text-primary' : 'text-muted-foreground'
                            }`}
                        >
                            <div className={`p-1.5 rounded-lg transition-colors ${
                                isActive ? 'bg-primary/10' : ''
                            }`}>
                                <Icon className="w-5 h-5"/>
                            </div>
                            <span className="text-[10px] font-medium">{link.name}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
