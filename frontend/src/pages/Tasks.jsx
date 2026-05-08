import { useState, useEffect } from 'react';
import { taskService } from '../services';
import { useAuth } from '../context/AuthContext';
import { Search, CheckSquare, Clock, AlertTriangle, Trash2, X, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS = { TODO: 'bg-white', IN_PROGRESS: 'bg-accent', COMPLETED: 'bg-success' };
const PRIORITY_COLORS = { LOW: 'bg-white', MEDIUM: 'bg-accent', HIGH: 'bg-danger' };

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '', overdue: '' });
  const [editTask, setEditTask] = useState(null);
  const [editForm, setEditForm] = useState({});
  // Removed isAdmin to let anyone do actions per instructions

  useEffect(() => { loadTasks(); }, [filters]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      if (filters.overdue) params.overdue = filters.overdue;
      const res = await taskService.getAll(params);
      setTasks(res.data.data);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  const handleUpdateStatus = async (taskId, status) => {
    try { await taskService.update(taskId, { status }); toast.success('Updated'); loadTasks(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('DELETE THIS TASK?')) return;
    try { await taskService.delete(taskId); toast.success('Deleted'); loadTasks(); }
    catch { toast.error('Failed'); }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      await taskService.update(editTask.id, editForm);
      toast.success('Task updated');
      setEditTask(null);
      loadTasks();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const openEdit = (task) => {
    setEditTask(task);
    setEditForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
  };

  const isOverdue = (d, status) => d && new Date(d) < new Date() && status !== 'COMPLETED';
  const clearFilters = () => setFilters({ status: '', priority: '', search: '', overdue: '' });
  const hasFilters = filters.status || filters.priority || filters.search || filters.overdue;

  return (
    <div className="space-y-8">
      <div className="border-b-4 border-dark-900 pb-4">
        <h1 className="text-[10px] font-black text-dark-900 uppercase tracking-tight">ALL TASKS</h1>
        <p className="text-dark-900 mt-2 font-bold uppercase tracking-wide">Manage and track workspace tasks</p>
      </div>

      {/* Filters */}
      <div className="brutal-card p-6 bg-accent">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-1 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-dark-900" />
            <input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="SEARCH TASKS..." className="brutal-input pl-11 py-0.5 text-[8px] font-bold uppercase" />
          </div>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="select-field py-0.5 text-[8px] w-auto font-bold uppercase">
            <option value="">ALL STATUSES</option>
            <option value="TODO">TO DO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
          <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} className="select-field py-0.5 text-[8px] w-auto font-bold uppercase">
            <option value="">ALL PRIORITIES</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
          <label className="flex items-center gap-1 text-[8px] font-black text-dark-900 uppercase tracking-widest cursor-pointer bg-white border-2 border-dark-900 p-1 brutal-shadow-sm select-none">
            <input type="checkbox" checked={filters.overdue === 'true'} onChange={(e) => setFilters({ ...filters, overdue: e.target.checked ? 'true' : '' })}
              className="w-3 h-3 accent-dark-900 border-2 border-dark-900 cursor-pointer" />
            OVERDUE ONLY
          </label>
          {hasFilters && <button onClick={clearFilters} className="btn-secondary py-0.5 text-[8px] uppercase">CLEAR</button>}
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-24" />)}</div>
      ) : tasks.length === 0 ? (
        <div className="brutal-card p-6 text-center bg-white">
          <CheckSquare className="w-5 h-5 text-dark-900 mx-auto mb-1.5" />
          <p className="text-dark-900 font-black text-[8px] uppercase">{hasFilters ? 'NO TASKS MATCH FILTERS' : 'NO TASKS YET'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task, i) => (
            <div key={task.id} className="brutal-card p-6 bg-white hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0px_#111827] transition-all animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <div className={`hidden md:block w-3 h-8 border-2 border-dark-900 brutal-shadow-sm flex-shrink-0 ${task.status === 'COMPLETED' ? 'bg-success' : task.status === 'IN_PROGRESS' ? 'bg-accent' : 'bg-dark-900'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap mb-2">
                    <h3 className={`text-[8px] font-black uppercase tracking-tight ${task.status === 'COMPLETED' ? 'text-dark-400 line-through' : 'text-dark-900'}`}>{task.title}</h3>
                    <span className={`badge ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
                    {isOverdue(task.dueDate, task.status) && (
                      <span className="badge bg-danger flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> OVERDUE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[8px] font-black text-dark-900 uppercase flex-wrap">
                    {task.project && <span className="bg-accent border-2 border-dark-900 px-2 py-1 brutal-shadow-sm">{task.project.title}</span>}
                    {task.assignedTo && <span className="bg-white border-2 border-dark-900 px-2 py-1 brutal-shadow-sm">→ {task.assignedTo.name}</span>}
                    {task.dueDate && (
                      <span className={`flex items-center gap-1 bg-white border-2 border-dark-900 px-2 py-1 brutal-shadow-sm ${isOverdue(task.dueDate, task.status) ? 'bg-danger text-dark-900' : ''}`}>
                        <Clock className="w-3.5 h-3.5" />{new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <select value={task.status} onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                    className={`text-[8px] font-black p-2 border-2 border-dark-900 cursor-pointer brutal-shadow-sm uppercase ${STATUS_COLORS[task.status]}`}>
                    <option value="TODO">TO DO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                  <button onClick={() => openEdit(task)} className="p-2 border-2 border-dark-900 bg-white hover:bg-accent transition-colors brutal-shadow-sm"><Edit3 className="w-3 h-3" /></button>
                  <button onClick={() => handleDelete(task.id)} className="p-2 border-2 border-dark-900 bg-white hover:bg-danger transition-colors brutal-shadow-sm hover:text-white"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editTask && (
        <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-center justify-center p-1 backdrop-blur-sm" onClick={() => setEditTask(null)}>
          <div className="brutal-card w-full max-w-xl p-2 bg-white shadow-none animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2 border-b-4 border-dark-900 pb-4">
              <h2 className="text-[10px] font-black text-dark-900 uppercase tracking-tight">EDIT TASK</h2>
              <button onClick={() => setEditTask(null)} className="p-2 border-2 border-dark-900 hover:bg-danger transition-colors hover:text-white"><X className="w-3 h-3" /></button>
            </div>
            <form onSubmit={handleEditSave} className="space-y-6">
              <div><label className="label-text">Title</label><input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="brutal-input uppercase" /></div>
              <div><label className="label-text">Description</label><textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="brutal-input min-h-[100px] resize-none uppercase" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div><label className="label-text">Status</label>
                  <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="select-field font-bold uppercase">
                    <option value="TODO">TO DO</option><option value="IN_PROGRESS">IN PROGRESS</option><option value="COMPLETED">COMPLETED</option>
                  </select></div>
                <div><label className="label-text">Priority</label>
                  <select value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })} className="select-field font-bold uppercase">
                    <option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option>
                  </select></div>
                <div><label className="label-text">Due Date</label><input type="date" value={editForm.dueDate} onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })} className="brutal-input font-bold" /></div>
              </div>
              <div className="flex justify-end gap-1 pt-6 border-t-2 border-dark-900">
                <button type="button" onClick={() => setEditTask(null)} className="btn-secondary">CANCEL</button>
                <button type="submit" className="btn-primary bg-success text-dark-900">SAVE CHANGES</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
