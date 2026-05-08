import { useState, useEffect } from 'react';
import { dashboardService } from '../services';
import { useAuth } from '../context/AuthContext';
import { FolderKanban, CheckSquare, AlertTriangle, TrendingUp, ListTodo } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const COLORS = ['#a78bfa', '#facc15', '#4ade80']; // Purple, Yellow, Green

function StatCard({ icon: Icon, label, value, bgClass, delay }) {
  return (
    <div className={`brutal-card p-5 animate-slide-up ${bgClass}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between mb-3 border-b-2 border-dark-900 pb-3">
        <div className="w-8 h-8 bg-white border-2 border-dark-900 flex items-center justify-center brutal-shadow-sm">
          <Icon className="w-4 h-4 text-dark-900" />
        </div>
        <TrendingUp className="w-5 h-5 text-dark-900" />
      </div>
      <p className="text-4xl font-black text-dark-900 tracking-tighter leading-none mt-2">{value}</p>
      <p className="text-xs font-bold text-dark-900 mt-2 uppercase tracking-widest">{label}</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-2 border-dark-900 p-2 brutal-shadow-sm">
        <p className="text-xs text-dark-900 font-black uppercase tracking-wider">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await dashboardService.getStats();
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-24" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="skeleton h-48" />
          <div className="skeleton h-48" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { icon: FolderKanban, label: 'Projects', value: stats.totalProjects, bgClass: 'bg-white' },
    { icon: CheckSquare, label: 'Tasks', value: stats.totalTasks, bgClass: 'bg-[#a78bfa]' },
    { icon: ListTodo, label: 'Completed', value: stats.completedTasks, bgClass: 'bg-white' },
    { icon: AlertTriangle, label: 'Overdue', value: stats.overdueTasks, bgClass: 'bg-[#ef4444]' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-4 border-dark-900 pb-3">
        <h1 className="text-3xl font-black text-dark-900 uppercase tracking-tight leading-none">Dashboard</h1>
        <p className="text-dark-900 mt-2 text-sm font-bold uppercase tracking-wide">WELCOME BACK, {user?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((s, i) => (
          <StatCard key={i} {...s} delay={i * 50} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Pie Chart */}
        <div className="brutal-card bg-white p-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-lg font-black text-dark-900 mb-4 uppercase border-b-2 border-dark-900 pb-2">Tasks Overview</h2>
          {stats.totalTasks > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.tasksByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={60}
                  dataKey="value"
                  stroke="#1e293b"
                  strokeWidth={2}
                >
                  {stats.tasksByStatus.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-dark-900 text-sm font-bold uppercase">No tasks yet</div>
          )}
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {stats.tasksByStatus.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-dark-900" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs font-black text-dark-900 uppercase tracking-widest">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="brutal-card bg-white p-5 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-lg font-black text-dark-900 mb-4 uppercase border-b-2 border-dark-900 pb-2">Project Progress</h2>
          {stats.projectProgress.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.projectProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#1e293b" vertical={false} strokeDasharray="2 2" />
                <XAxis dataKey="name" tick={{ fill: '#1e293b', fontSize: 10, fontWeight: 'bold' }} axisLine={{ stroke: '#1e293b', strokeWidth: 2 }} tickLine={{ stroke: '#1e293b', strokeWidth: 2 }} />
                <YAxis tick={{ fill: '#1e293b', fontSize: 10, fontWeight: 'bold' }} axisLine={{ stroke: '#1e293b', strokeWidth: 2 }} tickLine={{ stroke: '#1e293b', strokeWidth: 2 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.1 }} />
                <Bar dataKey="completed" name="Completed" fill="#4ade80" stroke="#1e293b" strokeWidth={2} />
                <Bar dataKey="total" name="Total" fill="#a78bfa" stroke="#1e293b" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-dark-900 text-sm font-bold uppercase">No projects yet</div>
          )}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="brutal-card bg-white p-5 animate-slide-up" style={{ animationDelay: '400ms' }}>
        <h2 className="text-lg font-black text-dark-900 mb-4 uppercase border-b-2 border-dark-900 pb-2">Recent Activity</h2>
        {stats.recentTasks.length > 0 ? (
          <div className="space-y-3">
            {stats.recentTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-3 bg-white border-2 border-dark-900 brutal-shadow-sm hover:-translate-y-1 transition-transform">
                <div className={`w-4 h-4 border-2 border-dark-900 flex-shrink-0 ${
                  task.status === 'COMPLETED' ? 'bg-success' :
                  task.status === 'IN_PROGRESS' ? 'bg-accent' : 'bg-dark-900'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-dark-900 truncate uppercase leading-none">{task.title}</p>
                  <p className="text-xs font-bold text-dark-500 uppercase mt-1">{task.project?.title}</p>
                </div>
                <span className="badge px-3 py-1 text-xs bg-white">
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-dark-900 text-sm font-bold uppercase">No recent activity</p>
        )}
      </div>
    </div>
  );
}
