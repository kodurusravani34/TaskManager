import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services';
import { Plus, FolderKanban, Users, CheckSquare, Search, Trash2, Edit3, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [form, setForm] = useState({ title: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      const res = await projectService.getAll();
      setProjects(res.data.data);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    setSaving(true);
    try {
      if (editProject) {
        await projectService.update(editProject.id, form);
        toast.success('Project updated');
      } else {
        await projectService.create(form);
        toast.success('Project created');
      }
      setShowModal(false);
      setEditProject(null);
      setForm({ title: '', description: '' });
      loadProjects();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('DELETE THIS PROJECT AND ALL TASKS?')) return;
    try {
      await projectService.delete(id);
      toast.success('Project deleted');
      loadProjects();
    } catch { toast.error('Failed to delete'); }
  };

  const openEdit = (p) => {
    setEditProject(p);
    setForm({ title: p.title, description: p.description || '' });
    setShowModal(true);
  };

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="skeleton h-12 w-48" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-56" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-1 border-b-4 border-dark-900 pb-4">
        <div>
          <h1 className="text-[10px] font-black text-dark-900 uppercase tracking-tight">Projects</h1>
          <p className="text-dark-900 mt-2 font-bold uppercase">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-dark-900" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="SEARCH..."
              className="brutal-input pl-11 py-0.5 text-[8px] w-full sm:w-56" />
          </div>
          <button onClick={() => { setEditProject(null); setForm({ title: '', description: '' }); setShowModal(true); }}
            className="btn-primary flex items-center justify-center gap-2 text-[8px] whitespace-nowrap">
            <Plus className="w-3 h-3" /> NEW PROJECT
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="brutal-card p-6 text-center bg-accent">
          <FolderKanban className="w-5 h-5 text-dark-900 mx-auto mb-1" />
          <p className="text-dark-900 font-bold uppercase text-[10px]">No projects found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.map((project, i) => (
            <div key={project.id} className="brutal-card-hover p-6 flex flex-col bg-white" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start justify-between mb-1 border-b-2 border-dark-900 pb-4">
                <div className="w-5 h-5 bg-accent border-2 border-dark-900 flex items-center justify-center brutal-shadow-sm">
                  <FolderKanban className="w-3 h-3 text-dark-900" />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(project)} className="p-2 border-2 border-dark-900 hover:bg-accent transition-colors">
                    <Edit3 className="w-3 h-3 text-dark-900" />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 border-2 border-dark-900 hover:bg-danger transition-colors text-dark-900 hover:text-white">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <Link to={`/projects/${project.id}`} className="flex-1 group">
                <h3 className="text-[8px] font-black text-dark-900 group-hover:underline decoration-4 underline-offset-4 transition-all mb-0.5 uppercase tracking-tight">{project.title}</h3>
                <p className="text-[8px] font-bold text-dark-500 line-clamp-2 mb-1.5 uppercase tracking-wider leading-relaxed">{project.description || 'NO DESCRIPTION'}</p>
              </Link>
              {/* Progress bar */}
              <div className="mb-1.5 p-1 bg-dark-50 border-2 border-dark-900 brutal-shadow-sm">
                <div className="flex justify-between text-[8px] font-black uppercase mb-2">
                  <span className="text-dark-900">Progress</span>
                  <span className="text-dark-900">{project.progress}%</span>
                </div>
                <div className="h-4 bg-white border-2 border-dark-900 relative">
                  <div className="absolute inset-y-0 left-0 bg-success border-r-2 border-dark-900 transition-all duration-500"
                    style={{ width: `${project.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-1 text-[8px] font-black text-dark-900 uppercase">
                <span className="flex items-center gap-2 bg-white border-2 border-dark-900 px-3 py-1 brutal-shadow-sm"><CheckSquare className="w-3 h-3" /> {project._count?.tasks || 0} TASKS</span>
                <span className="flex items-center gap-2 bg-white border-2 border-dark-900 px-3 py-1 brutal-shadow-sm"><Users className="w-3 h-3" /> {project._count?.members || 0} MEMBERS</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-center justify-center p-1 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="brutal-card w-full max-w-xl p-2 bg-white animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2 border-b-4 border-dark-900 pb-4">
              <h2 className="text-[10px] font-black text-dark-900 uppercase tracking-tight">{editProject ? 'EDIT PROJECT' : 'NEW PROJECT'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 border-2 border-dark-900 hover:bg-danger transition-colors hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="label-text">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="brutal-input uppercase" placeholder="PROJECT NAME" />
              </div>
              <div>
                <label className="label-text">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="brutal-input min-h-[120px] resize-none uppercase" placeholder="OPTIONAL DESCRIPTION" />
              </div>
              <div className="flex justify-end gap-1 pt-6 border-t-2 border-dark-900">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">CANCEL</button>
                <button type="submit" disabled={saving} className="btn-primary bg-success text-dark-900">
                  {saving ? 'SAVING...' : editProject ? 'UPDATE' : 'CREATE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
