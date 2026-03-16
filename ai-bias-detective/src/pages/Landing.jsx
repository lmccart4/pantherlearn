import { Link } from 'react-router-dom'
import { Shield, Search, FileText, Scale, ArrowRight } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink relative overflow-hidden noise-overlay">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-clue-gold/[0.02] via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-clue-gold/[0.015] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-8 animate-fade-in">
          <div className="w-6 h-6 bg-clue-gold/10 border border-clue-gold/30 rounded flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-clue-gold" />
          </div>
          <span className="text-xs font-[family-name:var(--font-mono)] text-clue-gold uppercase tracking-[0.2em]">
            AI Investigation Unit
          </span>
        </div>

        {/* Hero */}
        <h1 className="font-[family-name:var(--font-display)] text-6xl md:text-7xl text-text-primary leading-[1.05] mb-6 animate-fade-in stagger-1">
          AI Bias<br />
          <span className="text-clue-gold italic">Detective</span>
        </h1>
        
        <p className="text-lg text-text-secondary max-w-lg mb-12 animate-fade-in stagger-2 leading-relaxed">
          Investigate AI systems. Uncover hidden biases in training data. 
          Document evidence. Write reports that matter.
        </p>

        {/* CTA */}
        <Link
          to="/login"
          className="inline-flex items-center gap-3 bg-clue-gold text-ink px-6 py-3.5 rounded-lg font-semibold text-sm hover:bg-clue-amber transition-colors animate-fade-in stagger-3 group"
        >
          Begin Investigation
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-24">
          {[
            { icon: Search, title: 'Investigate', desc: 'Explore training data and uncover hidden patterns that reveal algorithmic bias.' },
            { icon: FileText, title: 'Document', desc: 'Build forensic case files with evidence, annotations, and detailed analysis.' },
            { icon: Scale, title: 'Mitigate', desc: 'Propose real solutions to make AI systems more fair and equitable.' },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`bg-case-dark border border-case-border rounded-xl p-6 animate-fade-in stagger-${i + 3}`}
            >
              <div className="w-10 h-10 bg-case-light rounded-lg flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-clue-gold" />
              </div>
              <h3 className="text-text-primary font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Cases preview */}
        <div className="mt-20 animate-fade-in stagger-5">
          <p className="text-xs font-[family-name:var(--font-mono)] text-text-dim uppercase tracking-[0.15em] mb-4">
            Active Cases
          </p>
          <div className="flex gap-3 flex-wrap">
            {['HireRight AI', 'LoanStar AI', 'FaceCheck AI', 'ForYou Engine'].map(name => (
              <span key={name} className="px-3 py-1.5 bg-case-dark border border-case-border rounded-lg text-xs font-[family-name:var(--font-mono)] text-text-secondary">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
