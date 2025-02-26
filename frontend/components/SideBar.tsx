"use client";

import { useState } from "react";
import { Home, FileText, Settings, Database, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname(); // Get current route

  const menuItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Oracle Management", href: "/oracle-management", icon: Database },
    { name: "Transactions", href: "/transactions", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div
      className={`h-screen bg-black text-white p-4 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <button
        className="text-white focus:outline-none mb-6 self-start"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Items */}
      <nav className="flex flex-col gap-4">
        {menuItems.map(({ name, href, icon: Icon }) => (
        
            <Link
              href={href}
              className={`flex items-center gap-3 p-2 rounded-md transition-all ${
                pathname === href ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
            >
              <Icon size={22} />
              {!isCollapsed && <span className="truncate">{name}</span>}
            </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
