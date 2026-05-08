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
      <nav className="bg-white border-b-4 border-dark-900">
        <div className="max-w-7xl mx-auto px-1.5 h-20 flex items-center justify-between">
          <div className="flex items-center gap-1 brutal-card p-6 bg-accent brutal-shadow-sm hover:-translate-y-1 hover:translate-x-1 transition-transform cursor-pointer">
            <div className="w-3 h-3 bg-dark-900 flex items-center justify-center">
              <Rocket className="w-3 h-3 text-white" />
            </div>
            <span className="text-[8px] font-black text-dark-900 uppercase tracking-tighter pr-2">ProjectPilot</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-[10px] font-black text-dark-900 uppercase tracking-widest hover:underline decoration-4 underline-offset-4"
            >
              SIGN IN
            </Link>
            <Link to="/signup" className="btn-primary text-[10px] px-1.5 py-2">
              START FREE
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-1.5 pt-24 pb-24 lg:pt-32 lg:pb-32 text-center animate-fade-in border-b-4 border-dark-900">
        <div className="inline-flex items-center gap-2 px-1 py-2 border-2 border-dark-900 bg-accent text-dark-900 text-[8px] font-black uppercase tracking-widest mb-0.5 brutal-shadow-sm">
          <Zap className="w-3.5 h-3.5" />
          Modern Project Management
        </div>
        <h1 className="text-[8px] md:text-[10px] lg:text-[10px] font-black text-dark-900 leading-none mb-2 max-w-5xl mx-auto uppercase tracking-tighter">
          MANAGE PROJECTS <br/> LIKE A PRO
        </h1>
        <p className="text-[8px] md:text-[8px] font-bold text-dark-900 max-w-3xl mx-auto mb-12 leading-relaxed border-l-4 border-r-4 border-dark-900 px-1.5">
          ProjectPilot brings your team together with powerful task management,
          real-time analytics, and seamless collaboration.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link to="/signup" className="btn-primary text-[10px] px-2 py-1 flex items-center gap-1">
            START FOR FREE <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            to="/login"
            className="btn-secondary bg-accent text-[10px] px-2 py-1"
          >
            ENTER WORKSPACE
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-2 max-w-4xl mx-auto animate-slide-up">
          {[
            { value: '10K+', label: 'Active Users', bg: 'bg-white' },
            { value: '50K+', label: 'Tasks Done', bg: 'bg-[#a78bfa]' },
            { value: '99.9%', label: 'Uptime', bg: 'bg-success' },
            { value: '4.9★', label: 'User Rating', bg: 'bg-accent' },
          ].map((stat, i) => (
            <div key={i} className={`brutal-card p-6 text-center ${stat.bg}`}>
              <div className="text-[10px] font-black text-dark-900">{stat.value}</div>
              <div className="text-[10px] font-bold text-dark-900 mt-2 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-1.5 py-1.5 border-b-4 border-dark-900 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-[8px] md:text-[8px] font-black text-dark-900 mb-1.5 uppercase tracking-tight">
            TOOLS TO SHIP FASTER
          </h2>
          <p className="text-dark-900 font-bold text-[8px] max-w-2xl mx-auto uppercase">
            Everything your team needs to track, analyze, and deliver.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {features.map((feature, i) => (
            <div
              key={i}
              className="brutal-card-hover p-6 bg-white flex flex-col"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-6 h-6 border-2 border-dark-900 bg-accent flex items-center justify-center mb-1.5 brutal-shadow-sm">
                <feature.icon className="w-3 h-3 text-dark-900" />
              </div>
              <h3 className="text-[8px] font-black text-dark-900 mb-1 uppercase tracking-tight">{feature.title}</h3>
              <p className="text-dark-900 font-bold text-[10px] leading-relaxed uppercase">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-1.5 py-1.5">
        <div className="brutal-card p-6 lg:p-20 text-center bg-success">
          <h2 className="text-[8px] md:text-[8px] font-black text-dark-900 mb-1.5 uppercase tracking-tight">
            TRANSFORM YOUR WORKFLOW
          </h2>
          <p className="text-dark-900 font-bold text-[8px] mb-0.5 max-w-2xl mx-auto uppercase">
            Join thousands of teams delivering projects on time.
          </p>
          <Link to="/signup" className="btn-primary bg-dark-900 text-white text-[8px] px-3 py-1 inline-flex items-center gap-1">
            GET STARTED NOW <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-dark-900 py-0.5">
        <div className="max-w-7xl mx-auto px-1.5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-accent border-2 border-dark-900 px-1 py-2 brutal-shadow-sm">
            <Rocket className="w-3 h-3 text-dark-900" />
            <span className="font-black text-dark-900 uppercase tracking-widest text-[10px]">ProjectPilot</span>
          </div>
          <p className="text-[10px] font-bold text-dark-900 uppercase">
            © {new Date().getFullYear()} PROJECTPILOT. NEO-BRUTALISM UI.
          </p>
        </div>
      </footer>
    </div>
  );
}
