import { useState, useEffect } from 'react';
import { memberService } from '../services';
import { useAuth } from '../context/AuthContext';
import { Users, User, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Team() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  // Keeping isAdmin around just in case we need logic (like inviting users, but user wanted roles removed from UI)

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try { const res = await memberService.getUsers(); setUsers(res.data.data); }
    catch { toast.error('Failed to load team'); }
    finally { setLoading(false); }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-6">
      <div className="skeleton h-12 w-48" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-36" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 border-b-4 border-dark-900 pb-4">
        <div>
          <h1 className="text-[10px] font-black text-dark-900 uppercase tracking-tight">Team Roster</h1>
          <p className="text-dark-900 mt-2 font-bold uppercase">{users.length} member{users.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-dark-900" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="SEARCH MEMBERS..."
            className="brutal-input pl-11 py-0.5 text-[8px] w-full sm:w-64" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="brutal-card p-6 text-center bg-accent">
          <Users className="w-5 h-5 text-dark-900 mx-auto mb-1" />
          <p className="text-dark-900 font-bold uppercase text-[10px]">No members found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.map((member, i) => (
            <div key={member.id} className="brutal-card-hover p-6 animate-slide-up bg-white flex flex-col" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 bg-accent border-2 border-dark-900 flex items-center justify-center text-dark-900 font-black text-[8px] brutal-shadow-sm">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-dark-900 truncate uppercase tracking-tight">{member.name}</h3>
                  <p className="text-[8px] text-dark-900 truncate font-medium">{member.email}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="badge flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> USER
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t-2 border-dark-900 text-[8px] font-bold text-dark-900 uppercase tracking-wider">
                JOINED {new Date(member.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
