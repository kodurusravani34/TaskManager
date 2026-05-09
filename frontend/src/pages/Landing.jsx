import { Link } from 'react-router-dom';
import {
  Rocket,
  CheckSquare,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  Zap,
  Globe,
} from 'lucide-react';

const features = [
  {
    icon: CheckSquare,
    title: 'Task Management',
    description: 'Create, assign, and track tasks with priorities, deadlines, and status updates.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Add team members to projects, assign roles, and collaborate seamlessly.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Real-time insights with charts showing project progress and team performance.',
  },
  {
    icon: Shield,
    title: 'Secure Access',
    description: 'Secure access control for complete data safety and privacy for your team.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built with modern tech stack for blazing fast performance and responsiveness.',
  },
  {
    icon: Globe,
    title: 'Deploy Anywhere',
    description: 'Production-ready architecture with seamless deployment support out of the box.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b-4 border-dark-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 brutal-card p-3 bg-accent brutal-shadow-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform cursor-pointer">
            <div className="w-6 h-6 bg-dark-900 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black text-dark-900 uppercase tracking-tighter">ProjectPilot</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-xs font-black text-dark-900 uppercase tracking-widest hover:underline decoration-4 underline-offset-4"
            >
              SIGN IN
            </Link>
            <Link to="/signup" className="btn-primary text-xs px-6 py-2.5">
              START FREE
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-24 text-center animate-fade-in border-b-4 border-dark-900">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-dark-900 bg-accent text-dark-900 text-[10px] font-black uppercase tracking-widest mb-8 brutal-shadow-sm">
          <Zap className="w-3.5 h-3.5" />
          Modern Project Management
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-dark-900 leading-tight mb-8 max-w-4xl mx-auto uppercase tracking-tighter">
          MANAGE PROJECTS <br className="hidden md:block"/> LIKE A PRO
        </h1>
        <p className="text-base md:text-lg font-bold text-dark-500 max-w-2xl mx-auto mb-12 leading-relaxed uppercase tracking-wider">
          ProjectPilot brings your team together with powerful task management,
          real-time analytics, and seamless collaboration.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
            START FOR FREE <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="btn-secondary bg-accent text-lg px-8 py-4"
          >
            ENTER WORKSPACE
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-32 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto animate-slide-up">
          {[
            { value: '10K+', label: 'Active Users', bg: 'bg-white' },
            { value: '50K+', label: 'Tasks Done', bg: 'bg-[#a78bfa]' },
            { value: '99.9%', label: 'Uptime', bg: 'bg-success' },
            { value: '4.9★', label: 'User Rating', bg: 'bg-accent' },
          ].map((stat, i) => (
            <div key={i} className={`brutal-card p-8 text-center ${stat.bg} shadow-[6px_6px_0px_#111827]`}>
              <div className="text-3xl font-black text-dark-900">{stat.value}</div>
              <div className="text-[10px] font-black text-dark-900 mt-3 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-b-4 border-dark-900 bg-white">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-black text-dark-900 mb-4 uppercase tracking-tight">
            TOOLS TO SHIP FASTER
          </h2>
          <p className="text-dark-500 font-bold text-sm max-w-2xl mx-auto uppercase tracking-widest">
            Everything your team needs to track, analyze, and deliver.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="brutal-card-hover p-8 bg-white flex flex-col shadow-[6px_6px_0px_#111827]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 border-2 border-dark-900 bg-accent flex items-center justify-center mb-6 brutal-shadow-sm">
                <feature.icon className="w-6 h-6 text-dark-900" />
              </div>
              <h3 className="text-lg font-black text-dark-900 mb-3 uppercase tracking-tight">{feature.title}</h3>
              <p className="text-dark-600 font-bold text-xs leading-relaxed uppercase tracking-wide">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="brutal-card p-10 lg:p-20 text-center bg-success shadow-[8px_8px_0px_#111827]">
          <h2 className="text-3xl md:text-5xl font-black text-dark-900 mb-6 uppercase tracking-tighter">
            TRANSFORM YOUR WORKFLOW
          </h2>
          <p className="text-dark-900 font-bold text-lg mb-10 max-w-3xl mx-auto uppercase tracking-widest">
            Join thousands of teams delivering projects on time.
          </p>
          <Link to="/signup" className="btn-primary bg-dark-900 text-white text-lg px-10 py-5 inline-flex items-center gap-2">
            GET STARTED NOW <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-dark-900 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 bg-accent border-2 border-dark-900 px-4 py-2 brutal-shadow-sm">
            <Rocket className="w-5 h-5 text-dark-900" />
            <span className="font-black text-dark-900 uppercase tracking-tighter text-lg">ProjectPilot</span>
          </div>
          <p className="text-[10px] font-black text-dark-400 uppercase tracking-widest">
            © {new Date().getFullYear()} PROJECTPILOT. NEO-BRUTALISM UI.
          </p>
        </div>
      </footer>
    </div>
  );
}
