import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  HelpCircle,
  Users,
  BookOpen,
  Layers,
  CircleStar,
  LogOut,
  BadgePlus,
  UserStar,
  Settings,
} from "lucide-react";

export default function Sidebar({ onLogout }) {
  const location = useLocation();  
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, path: "/admin/overview" },
    { id: "question", label: "Add Question", icon: BadgePlus, path: "/admin/question" },
    { id: "all", label: "All Questions", icon: HelpCircle, path: "/admin/all" },
    { id: "summary", label: "Quiz Summary", icon: UserStar, path: "/admin/summary" },
    { id: "quiz", label: "Add Quiz", icon: CircleStar, path: "/admin/quiz" },
    { id: "section", label: "Grade & Section", icon: Layers, path: "/admin/section" },
    { id: "subjects", label: "Add Subjects", icon: BookOpen, path: "/admin/subjects" },
    { id: "students", label: "List of Students", icon: Users, path: "/admin/students" },
    { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-md flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">ADMIN NA ASTIQ</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-900 hover:bg-gray-900 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600 transition-all font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
