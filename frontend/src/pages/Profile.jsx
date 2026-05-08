import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, FolderKanban, CheckSquare, Zap } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  const stats = user._count || {};

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="border-b-4 border-dark-900 pb-4">
        <h1 className="text-[10px] font-black text-dark-900 uppercase tracking-tight">My Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="brutal-card p-6 sm:p-1 text-center bg-accent relative">
        <Zap className="absolute top-4 right-4 w-4 h-4 text-dark-900" />
        <div className="w-10 h-10 bg-white border-4 border-dark-900 flex items-center justify-center text-dark-900 font-black text-[10px] mx-auto mb-1.5 brutal-shadow">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>
        <h2 className="text-[10px] font-black text-dark-900 uppercase tracking-tight">{user.name}</h2>
        <p className="text-dark-900 mt-2 font-bold text-[10px]">{user.email}</p>
        <div className="mt-6">
          <span className="inline-flex items-center gap-2 px-1 py-2 border-2 border-dark-900 bg-white text-dark-900 text-[8px] font-black uppercase brutal-shadow-sm">
            <User className="w-3 h-3" /> Workspace User
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="brutal-card p-6 space-y-6 bg-white">
        <h3 className="text-[8px] font-black text-dark-900 uppercase tracking-tight">Account Info</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          <div className="flex items-center gap-1 p-1 bg-white border-2 border-dark-900 brutal-shadow-sm">
            <Mail className="w-3 h-3 text-dark-900" />
            <div>
              <p className="text-[8px] text-dark-900 font-black uppercase tracking-wider">Email Address</p>
              <p className="text-[10px] font-bold text-dark-900">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 p-1 bg-white border-2 border-dark-900 brutal-shadow-sm">
            <Calendar className="w-3 h-3 text-dark-900" />
            <div>
              <p className="text-[8px] text-dark-900 font-black uppercase tracking-wider">Member Since</p>
              <p className="text-[10px] font-bold text-dark-900 uppercase">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="brutal-card p-6 text-center bg-success">
            <FolderKanban className="w-3 h-3 text-dark-900 mx-auto mb-0.5" />
            <p className="text-[10px] font-black text-dark-900">{stats.createdProjects || 0}</p>
            <p className="text-[8px] font-black text-dark-900 mt-2 uppercase tracking-wide">Projects Created</p>
          </div>
          <div className="brutal-card p-6 text-center bg-accent">
            <CheckSquare className="w-3 h-3 text-dark-900 mx-auto mb-0.5" />
            <p className="text-[10px] font-black text-dark-900">{stats.assignedTasks || 0}</p>
            <p className="text-[8px] font-black text-dark-900 mt-2 uppercase tracking-wide">Tasks Assigned</p>
          </div>
          <div className="brutal-card p-6 text-center bg-[#a78bfa]">
            <User className="w-3 h-3 text-dark-900 mx-auto mb-0.5" />
            <p className="text-[10px] font-black text-dark-900">{stats.memberships || 0}</p>
            <p className="text-[8px] font-black text-dark-900 mt-2 uppercase tracking-wide">Memberships</p>
          </div>
        </div>
      )}
    </div>
  );
}
