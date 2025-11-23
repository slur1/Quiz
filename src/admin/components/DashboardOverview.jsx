
import { useState } from "react";
import { Users, BarChart3, Layers } from "lucide-react";

export default function DashboardOverview() {
 
  const [studentData] = useState({
    totalStudents: 342,
    sections: [
      { name: "Section A", count: 2 },
      { name: "Section B", count: 52 },
      { name: "Section C", count: 38 },
      { name: "Section D", count: 48 },
      { name: "Section E", count: 55 },
      { name: "Section F", count: 42 },
      { name: "Section G", count: 62 },
    ],
  });

  return (
    
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
              Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{studentData.totalStudents}</p>
            </div>
            <div className="bg-gray-300 p-3 rounded-lg">
              <Users size={24} className="text-gray-900" />
            </div>
          </div>
        </div>

        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Active Sections</p>
              <p className="text-3xl font-bold text-gray-900">{studentData.sections.length}</p>
            </div>
            <div className="bg-gray-300  p-3 rounded-lg">
              <Layers size={24} className="text-gray-900" />
            </div>
          </div>
        </div>

        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Avg. per Section</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(studentData.totalStudents / studentData.sections.length)}
              </p>
            </div>
            <div className="bg-gray-300 p-3 rounded-lg">
              <BarChart3 size={24} className="text-gray-900" />
            </div>
          </div>
        </div>
      </div>

      
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Student Count by Section</h2>
        <div className="space-y-3">
          {studentData.sections.map((section) => (
            <div key={section.name} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-700 mb-1">{section.name}</p>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gray-900 h-2 rounded-full"
                    style={{
                      width: `${(section.count / studentData.totalStudents) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <p className="ml-4 text-sm font-semibold text-gray-700 min-w-fit">
                {section.count} students
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
