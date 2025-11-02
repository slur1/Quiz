import {
  LayoutDashboard,
  HelpCircle,
  Users,
  BookOpen,
  Layers,
  LogOut,
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "quiz", label: "Add Quiz", icon: HelpCircle },
    { id: "section", label: "Add Section & Grade", icon: Layers },
    { id: "subjects", label: "Add Subjects", icon: BookOpen },
    { id: "students", label: "List of Students", icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-md flex flex-col">
      
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">ADMIN NA ASTIQ</h2>
        </div>
      </div>

      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-900 hover:bg-gray-900 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
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