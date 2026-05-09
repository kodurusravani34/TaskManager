import { useState, useEffect } from 'react';
import { memberService } from '../services';
import { useAuth } from '../context/AuthContext';
import { Users, User, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Team() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '' });
  // Keeping isAdmin around just in case we need logic (like inviting users, but user wanted roles removed from UI)

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try { const res = await memberService.getUsers(); setUsers(res.data.data); }
    catch { toast.error('Failed to load team'); }
    finally { setLoading(false); }
  };

  const handleInvite = (e) => {
    e.preventDefault();
    toast.success('Invitation link copied to clipboard (Demo)');
    setShowModal(false);
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
        <div className="flex items-center gap-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-dark-900" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="SEARCH MEMBERS..."
              className="brutal-input pl-11 py-0.5 text-[8px] w-full sm:w-64" />
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center justify-center gap-2 text-[8px] whitespace-nowrap">
            INVITE
          </button>
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
      {/* Invite Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-center justify-center p-1 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="brutal-card w-full max-w-md p-2 bg-white animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-[10px] font-black text-dark-900 mb-1.5 uppercase border-b-4 border-dark-900 pb-2">INVITE MEMBER</h2>
            <form onSubmit={handleInvite} className="space-y-6">
              <div><label className="label-text">Name</label><input required value={inviteForm.name} onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })} className="brutal-input uppercase" placeholder="NAME" /></div>
              <div><label className="label-text">Email</label><input required type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} className="brutal-input uppercase" placeholder="EMAIL ADDRESS" /></div>
              <div className="flex justify-end gap-1 pt-6 border-t-2 border-dark-900">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">CANCEL</button>
                <button type="submit" className="btn-primary bg-accent text-dark-900">SEND INVITE</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
