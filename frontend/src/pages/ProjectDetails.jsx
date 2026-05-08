import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, taskService, memberService } from '../services';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus, Users, CheckSquare, Clock, Trash2, UserPlus, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  TODO: 'bg-white',
  IN_PROGRESS: 'bg-accent',
  COMPLETED: 'bg-success',
};
const PRIORITY_COLORS = {
  LOW: 'bg-white text-dark-900',
  MEDIUM: 'bg-accent text-dark-900',
  HIGH: 'bg-danger text-dark-900',
};

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedToId: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadProject(); loadUsers(); }, [id]);

  const loadProject = async () => {
    try {
      const res = await projectService.getById(id);
      setProject(res.data.data);
    } catch { toast.error('Failed to load project'); navigate('/projects'); }
    finally { setLoading(false); }
  };

  const loadUsers = async () => {
    try { const res = await memberService.getUsers(); setAllUsers(res.data.data); } catch {}
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;
    try {
      await memberService.addMember(id, selectedUser);
      toast.success('Member added');
      setShowAddMember(false);
      setSelectedUser('');
      loadProject();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('REMOVE THIS MEMBER?')) return;
    try { await memberService.removeMember(id, userId); toast.success('Member removed'); loadProject(); }
    catch { toast.error('Failed'); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return toast.error('Title is required');
    setSaving(true);
    try {
      await taskService.create({ ...taskForm, projectId: id, assignedToId: taskForm.assignedToId || null });
      toast.success('Task created');
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedToId: '' });
      loadProject();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleUpdateStatus = async (taskId, status) => {
    try { await taskService.update(taskId, { status }); toast.success('Status updated'); loadProject(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('DELETE THIS TASK?')) return;
    try { await taskService.delete(taskId); toast.success('Task deleted'); loadProject(); }
    catch { toast.error('Failed'); }
  };

  if (loading) return <div className="space-y-6">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-40" />)}</div>;
  if (!project) return null;

  const isOverdue = (d) => d && new Date(d) < new Date();
  const memberIds = project.members.map((m) => m.userId);
  const availableUsers = allUsers.filter((u) => !memberIds.includes(u.id));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-1 border-b-4 border-dark-900 pb-4">
        <button onClick={() => navigate('/projects')} className="mt-1 p-1 border-2 border-dark-900 bg-white hover:bg-dark-900 hover:text-white brutal-shadow-sm transition-all active:translate-y-1 active:translate-x-1 active:shadow-none">
          <ArrowLeft className="w-3 h-3" />
        </button>
        <div className="flex-1">
          <h1 className="text-[10px] font-black text-dark-900 uppercase tracking-tight">{project.title}</h1>
          <p className="text-[10px] font-bold text-dark-900 mt-2 uppercase">{project.description || 'NO DESCRIPTION'}</p>
          <div className="flex flex-wrap items-center gap-1 mt-4 text-[8px] font-black text-dark-900 uppercase">
            <span className="flex items-center gap-2 bg-white border-2 border-dark-900 px-3 py-1 brutal-shadow-sm"><CheckSquare className="w-3 h-3" /> {project.totalTasks} TASKS</span>
            <span className="flex items-center gap-2 bg-white border-2 border-dark-900 px-3 py-1 brutal-shadow-sm"><Users className="w-3 h-3" /> {project.members.length} MEMBERS</span>
            <span className="flex items-center gap-2 bg-success border-2 border-dark-900 px-3 py-1 brutal-shadow-sm">{project.progress}% COMPLETE</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="brutal-card p-6 bg-white">
        <div className="flex justify-between text-[8px] font-black uppercase mb-1">
          <span className="text-dark-900">OVERALL PROGRESS</span>
          <span className="text-dark-900">{project.completedTasks}/{project.totalTasks} TASKS</span>
        </div>
        <div className="h-6 bg-white border-2 border-dark-900 relative">
          <div className="absolute inset-y-0 left-0 bg-success border-r-2 border-dark-900 transition-all duration-500" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-2">
        {/* Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-dark-900 pb-2">
            <h2 className="text-[8px] font-black text-dark-900 uppercase tracking-tight">TASKS</h2>
            <button onClick={() => setShowTaskModal(true)} className="btn-primary text-[8px] flex items-center gap-2 whitespace-nowrap">
              <Plus className="w-3 h-3" /> ADD TASK
            </button>
          </div>
          {project.tasks.length === 0 ? (
            <div className="brutal-card p-6 text-center bg-accent"><p className="text-dark-900 font-bold uppercase text-[10px]">No tasks yet</p></div>
          ) : (
            <div className="space-y-4">
              {project.tasks.map((task) => (
                <div key={task.id} className="brutal-card p-6 bg-white hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0px_#111827] transition-all">
                  <div className="flex items-start gap-1">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 flex-wrap mb-2">
                        <h3 className={`text-[8px] font-black uppercase tracking-tight ${task.status === 'COMPLETED' ? 'text-dark-500 line-through' : 'text-dark-900'}`}>{task.title}</h3>
                        <span className={`badge ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
                        {isOverdue(task.dueDate) && task.status !== 'COMPLETED' && (
                          <span className="badge bg-danger text-dark-900 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> OVERDUE
                          </span>
                        )}
                      </div>
                      {task.description && <p className="text-[8px] font-bold text-dark-500 mb-0.5 uppercase truncate">{task.description}</p>}
                      <div className="flex flex-wrap items-center gap-1 text-[8px] font-black text-dark-900 uppercase">
                        {task.assignedTo && <span className="bg-dark-50 border-2 border-dark-900 px-2 py-1">→ {task.assignedTo.name}</span>}
                        {task.dueDate && (
                          <span className={`flex items-center gap-1 bg-white border-2 border-dark-900 px-2 py-1 ${isOverdue(task.dueDate) && task.status !== 'COMPLETED' ? 'bg-danger text-dark-900' : ''}`}>
                            <Clock className="w-3 h-3" /> {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-col sm:flex-row">
                      <select value={task.status} onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                        className={`text-[8px] font-black border-2 border-dark-900 p-2 cursor-pointer uppercase brutal-shadow-sm ${STATUS_COLORS[task.status]}`}>
                        <option value="TODO">TO DO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                      <button onClick={() => handleDeleteTask(task.id)} className="p-2 border-2 border-dark-900 bg-white hover:bg-danger hover:text-dark-900 transition-colors brutal-shadow-sm">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Members */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-dark-900 pb-2">
            <h2 className="text-[8px] font-black text-dark-900 uppercase tracking-tight">MEMBERS</h2>
            <button onClick={() => setShowAddMember(true)} className="p-2 border-2 border-dark-900 bg-accent hover:bg-dark-900 hover:text-white transition-colors brutal-shadow-sm">
              <UserPlus className="w-3 h-3" />
            </button>
          </div>
          <div className="brutal-card p-6 bg-white space-y-4">
            {project.members.map((m) => (
              <div key={m.id} className="flex items-center gap-1 p-1 border-2 border-dark-900 bg-white brutal-shadow-sm">
                <div className="w-4 h-4 bg-accent border-2 border-dark-900 flex items-center justify-center text-dark-900 font-black text-[8px]">
                  {m.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-dark-900 truncate uppercase">{m.user.name}</p>
                  <p className="text-[8px] font-bold text-dark-500 uppercase">USER</p>
                </div>
                {m.userId !== user?.id && (
                  <button onClick={() => handleRemoveMember(m.userId)} className="p-1.5 border-2 border-dark-900 hover:bg-danger transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-center justify-center p-1 backdrop-blur-sm" onClick={() => setShowAddMember(false)}>
          <div className="brutal-card w-full max-w-md p-2 bg-white animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-[10px] font-black text-dark-900 mb-1.5 uppercase border-b-4 border-dark-900 pb-2">ADD MEMBER</h2>
            {availableUsers.length === 0 ? <p className="text-dark-900 font-bold uppercase text-center bg-accent p-1 border-2 border-dark-900 brutal-shadow-sm">ALL USERS ARE IN THIS PROJECT</p> : (
              <>
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="select-field mb-1.5 uppercase font-bold text-[10px]">
                  <option value="">SELECT USER</option>
                  {availableUsers.map((u) => <option key={u.id} value={u.id}>{u.name.toUpperCase()} ({u.email.toUpperCase()})</option>)}
                </select>
                <div className="flex justify-end gap-1 pt-6 border-t-2 border-dark-900">
                  <button onClick={() => setShowAddMember(false)} className="btn-secondary">CANCEL</button>
                  <button onClick={handleAddMember} className="btn-primary bg-accent text-dark-900">ADD</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-center justify-center p-1 backdrop-blur-sm" onClick={() => setShowTaskModal(false)}>
          <div className="brutal-card w-full max-w-xl p-2 bg-white animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2 border-b-4 border-dark-900 pb-4">
              <h2 className="text-[10px] font-black text-dark-900 uppercase tracking-tight">NEW TASK</h2>
              <button onClick={() => setShowTaskModal(false)} className="p-2 border-2 border-dark-900 hover:bg-danger transition-colors hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-6">
              <div><label className="label-text">Title</label><input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} className="brutal-input uppercase" placeholder="TASK TITLE" /></div>
              <div><label className="label-text">Description</label><textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} className="brutal-input min-h-[100px] resize-none uppercase" placeholder="OPTIONAL" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="label-text">Priority</label>
                  <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} className="select-field font-bold uppercase">
                    <option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option>
                  </select>
                </div>
                <div><label className="label-text">Due Date</label><input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="brutal-input font-bold" /></div>
              </div>
              <div><label className="label-text">Assign To</label>
                <select value={taskForm.assignedToId} onChange={(e) => setTaskForm({ ...taskForm, assignedToId: e.target.value })} className="select-field font-bold uppercase">
                  <option value="">UNASSIGNED</option>
                  {project.members.map((m) => <option key={m.userId} value={m.userId}>{m.user.name.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-1 pt-6 border-t-2 border-dark-900">
                <button type="button" onClick={() => setShowTaskModal(false)} className="btn-secondary">CANCEL</button>
                <button type="submit" disabled={saving} className="btn-primary bg-success text-dark-900">{saving ? 'CREATING...' : 'CREATE TASK'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
