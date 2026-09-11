import { useEffect, useMemo, useState, type ChangeEvent, type KeyboardEvent, type MouseEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Bell, CalendarDays, Check, FileText, LockKeyhole, MapPin, Monitor, PartyPopper, Search, Sparkles, Target, Timer, TrendingUp, Upload, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Step = 'signup' | 'welcome' | 'role' | 'skills' | 'goal' | 'career-start' | 'loading' | 'preview' | 'simulator';

type Option = {
  id: string;
  label: string;
  description?: string;
};

const steps: Step[] = ['signup', 'welcome', 'role', 'skills', 'goal', 'career-start', 'preview'];
const questionSteps: Step[] = ['role', 'skills', 'goal', 'career-start'];
const workshopImage = 'https://cdn.hubblecontent.osi.office.net/m365content/publish/abd81379-64cb-443c-96c8-9992e1cb95a6/thumbnails/xxlarge.jpg';
const simulatorImage = 'https://cdn.hubblecontent.osi.office.net/m365content/publish/b0f25f80-94e7-4691-b122-b22b81e83ad6/thumbnails/xlarge.jpg';

const roles: Option[] = [
  { id: 'customer-service', label: 'Customer service representative' },
  { id: 'cybersecurity', label: 'Cybersecurity analyst' },
  { id: 'data-analyst', label: 'Data analyst' },
  { id: 'designer', label: 'Designer' },
  { id: 'educator', label: 'Educator' },
  { id: 'enterprise-computing', label: 'Enterprise computing professional' },
  { id: 'it-support', label: 'IT support technician' },
  { id: 'project-manager', label: 'Project manager' },
  { id: 'ux-designer', label: 'UX designer' },
  { id: 'web-developer', label: 'Web developer' },
];

const roleSkills: Record<string, Option[]> = {
  'customer-service': [
    { id: 'crm', label: 'CRM platforms' }, { id: 'omnichannel', label: 'Omnichannel support' }, { id: 'case-management', label: 'Case management' }, { id: 'ai-assist', label: 'AI-assisted service tools' }, { id: 'active-listening', label: 'Active listening' }, { id: 'de-escalation', label: 'De-escalation' }, { id: 'clear-communication', label: 'Clear communication' }, { id: 'problem-solving', label: 'Problem solving' },
  ],
  cybersecurity: [
    { id: 'siem', label: 'SIEM tools' }, { id: 'incident-response', label: 'Incident response' }, { id: 'threat-analysis', label: 'Threat analysis' }, { id: 'cloud-security', label: 'Cloud security' }, { id: 'risk-thinking', label: 'Risk-based thinking' }, { id: 'attention-detail', label: 'Attention to detail' }, { id: 'communication', label: 'Security communication' }, { id: 'continuous-learning', label: 'Continuous learning' },
  ],
  'data-analyst': [
    { id: 'sql', label: 'SQL' }, { id: 'python', label: 'Python' }, { id: 'data-visualisation', label: 'Data visualisation' }, { id: 'ai-analytics', label: 'AI-assisted analytics' }, { id: 'critical-thinking', label: 'Critical thinking' }, { id: 'data-storytelling', label: 'Data storytelling' }, { id: 'business-curiosity', label: 'Business curiosity' }, { id: 'stakeholder-communication', label: 'Stakeholder communication' },
  ],
  designer: [
    { id: 'design-systems', label: 'Design systems' }, { id: 'prototyping', label: 'Rapid prototyping' }, { id: 'accessibility', label: 'Accessible design' }, { id: 'ai-design-tools', label: 'Generative AI design tools' }, { id: 'creative-thinking', label: 'Creative thinking' }, { id: 'feedback', label: 'Giving and receiving feedback' }, { id: 'collaboration', label: 'Cross-functional collaboration' }, { id: 'storytelling', label: 'Visual storytelling' },
  ],
  educator: [
    { id: 'learning-design', label: 'Learning experience design' }, { id: 'digital-learning', label: 'Digital learning platforms' }, { id: 'ai-literacy', label: 'AI literacy' }, { id: 'assessment', label: 'Formative assessment' }, { id: 'facilitation', label: 'Facilitation' }, { id: 'empathy', label: 'Empathy' }, { id: 'adaptability', label: 'Adaptability' }, { id: 'communication', label: 'Clear communication' },
  ],
  'enterprise-computing': [
    { id: 'mainframe', label: 'Mainframe systems' }, { id: 'hybrid-cloud', label: 'Hybrid cloud' }, { id: 'automation', label: 'Infrastructure automation' }, { id: 'security', label: 'Enterprise security' }, { id: 'systems-thinking', label: 'Systems thinking' }, { id: 'troubleshooting', label: 'Structured troubleshooting' }, { id: 'documentation', label: 'Technical documentation' }, { id: 'collaboration', label: 'Cross-team collaboration' },
  ],
  'it-support': [
    { id: 'endpoint', label: 'Endpoint management' }, { id: 'cloud-admin', label: 'Cloud administration' }, { id: 'identity', label: 'Identity and access management' }, { id: 'automation', label: 'Support automation' }, { id: 'troubleshooting', label: 'Troubleshooting' }, { id: 'customer-empathy', label: 'Customer empathy' }, { id: 'communication', label: 'Technical communication' }, { id: 'prioritisation', label: 'Prioritisation' },
  ],
  'project-manager': [
    { id: 'agile', label: 'Agile delivery' }, { id: 'project-tools', label: 'Project management platforms' }, { id: 'data-reporting', label: 'Data-driven reporting' }, { id: 'ai-planning', label: 'AI-assisted planning' }, { id: 'stakeholder-management', label: 'Stakeholder management' }, { id: 'risk-management', label: 'Risk management' }, { id: 'negotiation', label: 'Negotiation' }, { id: 'leadership', label: 'Collaborative leadership' },
  ],
  'ux-designer': [
    { id: 'user-research', label: 'User research' }, { id: 'prototyping', label: 'Interactive prototyping' }, { id: 'design-systems', label: 'Design systems' }, { id: 'accessibility', label: 'Accessibility standards' }, { id: 'empathy', label: 'User empathy' }, { id: 'facilitation', label: 'Workshop facilitation' }, { id: 'storytelling', label: 'Design storytelling' }, { id: 'collaboration', label: 'Cross-functional collaboration' },
  ],
  'web-developer': [
    { id: 'javascript', label: 'JavaScript and TypeScript' }, { id: 'react', label: 'Modern frontend frameworks' }, { id: 'api', label: 'API integration' }, { id: 'ai-coding', label: 'AI-assisted development' }, { id: 'problem-solving', label: 'Problem solving' }, { id: 'collaboration', label: 'Developer collaboration' }, { id: 'communication', label: 'Technical communication' }, { id: 'continuous-learning', label: 'Continuous learning' },
  ],
};

const generalSkills: Option[] = [
  { id: 'digital-literacy', label: 'Digital literacy' }, { id: 'ai-literacy', label: 'AI literacy' }, { id: 'data-literacy', label: 'Data literacy' }, { id: 'problem-solving', label: 'Problem solving' }, { id: 'communication', label: 'Clear communication' }, { id: 'collaboration', label: 'Collaboration' }, { id: 'adaptability', label: 'Adaptability' }, { id: 'critical-thinking', label: 'Critical thinking' },
];

const goals = [
  { id: 'growth', label: 'Career growth & promotion', description: 'Build toward more responsibility in your current field.', icon: TrendingUp },
  { id: 'new-career', label: 'Explore a new career', description: 'Find a path that could take your experience somewhere new.', icon: Target },
  { id: 'skill-stacking', label: 'Just skill stacking', description: 'Keep building useful skills at your own pace.', icon: Sparkles },
  { id: 'undecided', label: 'Not decided yet', description: 'Start by understanding what you already have.', icon: Timer },
];

const courses = [
  { priority: '01', name: 'Data visualisation with Python', duration: '1 hr 40 min', explanation: 'Closes two skill gaps for your Senior data analyst pathway.', score: 86 },
  { priority: '02', name: 'Build impactful dashboards', duration: '55 min', explanation: 'Strengthens dashboard building, a skill employers increasingly request.', score: 79 },
  { priority: '03', name: 'Storytelling with data', duration: '45 min', explanation: 'Helps you turn analysis into clear recommendations for stakeholders.', score: 72 },
];

type DashboardView = 'dashboard' | 'simulator' | 'community' | 'course';

function DashboardBrand() {
  return (
    <div className="flex items-center gap-3 text-foreground" aria-label="IBM SkillsBuild">
      <span className="flex flex-col items-center gap-0.5" aria-hidden="true">
        <span className="h-px w-full bg-foreground" />
        <span className="text-xl font-bold leading-none tracking-tight">IBM</span>
        <span className="h-px w-full bg-foreground" />
      </span>
      <span className="text-base font-semibold tracking-tight">SkillsBuild</span>
    </div>
  );
}

type PathwayMilestone = {
  name: string;
  status: 'Completed' | 'Recommended course' | 'Next skill to build' | 'Target role';
  position: { left: string; top: string };
};

const pathwayMilestones: PathwayMilestone[] = [
  { name: 'Spreadsheet analysis', status: 'Completed', position: { left: '7%', top: '61%' } },
  { name: 'SQL queries', status: 'Completed', position: { left: '18%', top: '35%' } },
  { name: 'Data visualisation with Python', status: 'Recommended course', position: { left: '30%', top: '58%' } },
  { name: 'Dashboard building', status: 'Next skill to build', position: { left: '43%', top: '34%' } },
  { name: 'Build impactful dashboards', status: 'Recommended course', position: { left: '56%', top: '58%' } },
  { name: 'Data storytelling', status: 'Next skill to build', position: { left: '69%', top: '35%' } },
  { name: 'Storytelling with data', status: 'Recommended course', position: { left: '81%', top: '58%' } },
  { name: 'Senior data analyst', status: 'Target role', position: { left: '92%', top: '35%' } },
];

function PathwayNode({ milestone, index }: { milestone: PathwayMilestone; index: number }) {
  const nodeClass = milestone.status === 'Completed'
    ? 'fill-success stroke-success'
    : milestone.status === 'Recommended course'
      ? 'fill-primary stroke-primary'
      : milestone.status === 'Target role'
        ? 'fill-deep-blue stroke-deep-blue'
        : 'fill-background stroke-border';
  const nodeTextClass = milestone.status === 'Next skill to build' ? 'text-foreground' : 'text-primary-foreground';
  const pillarClass = milestone.status === 'Completed'
    ? 'border-success after:bg-success'
    : milestone.status === 'Recommended course'
      ? 'border-primary after:bg-primary'
      : milestone.status === 'Target role'
        ? 'border-deep-blue after:bg-deep-blue'
        : 'border-border after:bg-muted';

  return (
    <li
      className="absolute w-44 -translate-x-1/2 -translate-y-1/2"
      style={{ left: milestone.position.left, top: milestone.position.top }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative z-20 mb-1 h-16 w-14" aria-label={`Milestone ${index + 1}`}>
          <MapPin className="absolute left-1 top-1 size-full fill-deep-blue text-deep-blue" strokeWidth={1.8} aria-hidden="true" />
          <MapPin className={cn('absolute inset-0 size-full', nodeClass)} strokeWidth={1.8} aria-hidden="true" />
          <span className={cn('absolute left-1/2 top-[42%] z-10 -translate-x-1/2 -translate-y-1/2 text-sm font-bold', nodeTextClass)}>
            {milestone.status === 'Target role' ? <LockKeyhole className="size-4" aria-hidden="true" /> : index + 1}
          </span>
        </div>
        <div className={cn('relative z-10 -mt-1 min-h-24 w-full border bg-background p-3 pb-4 text-foreground after:absolute after:-bottom-2 after:left-2 after:-z-10 after:h-2 after:w-full after:border after:border-t-0', pillarClass)}>
          <p className="text-sm font-semibold leading-snug">{milestone.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{milestone.status}</p>
          {milestone.status === 'Recommended course' ? <p className="mt-2 text-xs font-semibold">Start now <ArrowRight className="inline size-3" aria-hidden="true" /></p> : null}
        </div>
      </div>
    </li>
  );
}

function CareerGrowthPathway() {
  return (
    <section className="mt-12" aria-labelledby="career-growth-pathway-heading">
      <h2 id="career-growth-pathway-heading" className="text-2xl font-semibold">Career Growth Pathway</h2>
      <p className="mt-2 text-muted-foreground">7 of 12 skills confirmed · About 5 hours 40 minutes to your next milestone.</p>
      <div className="mt-6 border border-secondary bg-card p-5 text-card-foreground sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-semibold">Data analyst to Senior data analyst</p>
            <p className="mt-1 text-sm text-muted-foreground">Follow the milestones from confirmed skills to your target role.</p>
          </div>
          <div className="grid gap-x-5 gap-y-2 text-xs sm:grid-cols-2" aria-label="Roadmap legend">
            <span className="flex items-center gap-2"><span className="size-3 rounded-full bg-success" aria-hidden="true" />Green filled node = Confirmed or completed</span>
            <span className="flex items-center gap-2"><span className="size-3 rounded-full border-2 border-border bg-background" aria-hidden="true" />Grey outline node = Next skill to build</span>

            <span className="flex items-center gap-2"><span className="size-3 rounded-full bg-primary" aria-hidden="true" />IBM-blue filled node = Recommended course</span>
            <span className="flex items-center gap-2"><span className="size-3 rounded-full bg-deep-blue" aria-hidden="true" />Locked dark-blue node = Target role</span>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto pb-4" aria-label="Career growth roadmap">
          <div className="relative h-[34rem] min-w-[1080px] overflow-hidden bg-secondary">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1080 544" fill="none" aria-hidden="true" preserveAspectRatio="none">
              <path d="M35 350 C145 350 130 190 235 190 C345 190 330 350 445 350 C560 350 545 190 655 190 C770 190 755 350 865 350 C970 350 950 190 1045 190" stroke="var(--deep-blue)" strokeWidth="78" strokeLinecap="round" transform="translate(0 15)" />
              <path d="M35 350 C145 350 130 190 235 190 C345 190 330 350 445 350 C560 350 545 190 655 190 C770 190 755 350 865 350 C970 350 950 190 1045 190" stroke="var(--primary)" strokeWidth="78" strokeLinecap="round" />
              <path d="M35 350 C145 350 130 190 235 190 C345 190 330 350 445 350 C560 350 545 190 655 190 C770 190 755 350 865 350 C970 350 950 190 1045 190" stroke="var(--secondary)" strokeWidth="4" strokeLinecap="round" strokeDasharray="16 16" />
            </svg>
            <ol className="absolute inset-0">
              {pathwayMilestones.map((milestone: PathwayMilestone, index: number) => <PathwayNode key={milestone.name} milestone={milestone} index={index} />)}
            </ol>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground sm:hidden">Scroll horizontally to explore the full pathway.</p>
      </div>
    </section>
  );
}
type SimulatorSkill = {
  name: string;
  roles: string;
};

const simulatorSkills: SimulatorSkill[] = [
  { name: 'AI literacy', roles: 'Junior AI specialist · Business analyst · Customer experience roles' },
  { name: 'Problem solving', roles: 'Business analyst · Operations coordinator · Project manager roles' },
  { name: 'Clear communication', roles: 'Customer experience · Project manager · Support analyst roles' },
  { name: 'Workflow design', roles: 'Business analyst · Operations coordinator · AI support roles' },
];

const workplaceEvidence = [
  'Identify a customer problem',
  'Design an AI-supported workflow',
  'Consider escalation and responsible use',
];

function CareerExperienceSimulator({ currentRole, targetRole, onOpenWorkspace }: { currentRole: string; targetRole: string; onOpenWorkspace: () => void }) {
  const [selectedSkill, setSelectedSkill] = useState<SimulatorSkill | null>(null);
  const [showCareerAspects, setShowCareerAspects] = useState(false);
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <header className="max-w-4xl">
        <p className="text-sm font-semibold">CAREER EXPERIENCE SIMULATOR</p>
        <h1 className="mt-4 text-3xl font-light tracking-tight sm:text-4xl">Try the work before you claim the skill</h1>
        <p className="mt-5 text-lg text-muted-foreground">Complete one realistic project based on what you are learning now.</p>
        <p className="mt-6 border-l-4 border-primary pl-4 text-sm font-semibold">Current pathway: {currentRole} <ArrowRight className="mx-1 inline size-4" aria-hidden="true" /> {targetRole}</p>
      </header>

      <section className="mt-10 border border-border bg-secondary text-secondary-foreground lg:grid lg:grid-cols-[1.05fr_0.95fr]" aria-labelledby="simulator-project-title">
        <div className="order-2 p-6 sm:p-8 lg:order-1 lg:p-10">
          <p className="text-sm font-semibold">YOUR REAL-WORLD PROJECT</p>
          <h2 id="simulator-project-title" className="mt-5 text-2xl font-semibold sm:text-3xl">Build a customer-support AI agent</h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">Design a simple AI assistant that helps customers find answers, routes complex questions to the right team, and explains its decisions clearly.</p>
          <div className="mt-7 space-y-2 text-sm">
            <p><span className="font-semibold">Estimated time:</span> 15 minutes</p>
            <p><span className="font-semibold">Skills applied:</span> AI literacy · Problem solving · Clear communication</p>
          </div>
          <Button className="mt-8 rounded-none" onClick={onOpenWorkspace}>Start project <ArrowRight aria-hidden="true" /></Button>
        </div>
        <div className="relative order-1 min-h-72 overflow-hidden lg:order-2 lg:m-6 lg:min-h-[28rem]">
          <img src={simulatorImage} alt="Professional using a laptop in a modern workplace" className="absolute inset-0 h-full w-full object-cover" />

        </div>
      </section>

      <section className="mt-8 border border-border bg-card p-6 text-card-foreground sm:p-8 lg:p-10" aria-labelledby="project-brief-heading">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <h2 id="project-brief-heading" className="text-2xl font-semibold">Your brief</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">A support team receives the same customer questions every day. Create a simple plan for an AI agent that can answer common questions, know when to escalate, and keep the customer experience clear.</p>
          </div>
          <ol className="divide-y divide-border border-y border-border">
            <li className="flex gap-5 py-5"><span className="font-semibold">1.</span><span>Choose three common customer questions.</span></li>
            <li className="flex gap-5 py-5"><span className="font-semibold">2.</span><span>Write the AI agent’s response and escalation rule for each.</span></li>
            <li className="flex gap-5 py-5"><span className="font-semibold">3.</span><span>Explain one risk and how you would reduce it.</span></li>
          </ol>
        </div>
        <Button variant="outline" className="mt-8 rounded-none" onClick={onOpenWorkspace}>Open project workspace <ArrowRight aria-hidden="true" /></Button>
      </section>

      <section className="mt-12" aria-labelledby="project-proves-heading">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <h2 id="project-proves-heading" className="text-2xl font-semibold">What this project proves</h2>
            <p className="mt-3 text-lg text-muted-foreground">This project helps you practise skills that appear in real job descriptions.</p>
            <p className="mt-5 leading-relaxed">You are not only completing a course. You are applying what you learned to a realistic workplace project.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            aria-expanded={showCareerAspects}
            aria-controls="career-aspects-card"
            onClick={() => setShowCareerAspects((current: boolean) => !current)}
            className="min-h-12 shrink-0 rounded-none"
          >
            <PartyPopper className="size-5" aria-hidden="true" />
            {showCareerAspects ? 'Hide career aspects' : 'Unlock career aspects'}
          </Button>
        </div>

        <div className="mt-7 flex flex-wrap gap-3" aria-label="Skills this project helps practise">
          {simulatorSkills.map((skill: SimulatorSkill) => {
            const isSelected = selectedSkill?.name === skill.name;
            return (
              <button
                key={skill.name}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedSkill(isSelected ? null : skill)}
                className={cn(
                  'flex min-h-16 items-center gap-3 rounded-full border px-5 py-3 text-left shadow-sm transition-colors',
                  isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary text-secondary-foreground hover:border-primary',
                )}
              >
                <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-full border', isSelected ? 'border-primary-foreground' : 'border-border')} aria-hidden="true">
                  <Check className="size-4" />
                </span>
                <span>
                  <span className="block font-semibold">{skill.name}</span>
                  <span className={cn('block text-xs', isSelected ? 'text-primary-foreground' : 'text-muted-foreground')}>To be practised</span>
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {selectedSkill ? (
            <motion.div
              key={selectedSkill.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' as const }}
              className="mt-5 border-l-4 border-primary bg-secondary p-5 text-secondary-foreground"
            >
              <p className="font-semibold">{selectedSkill.name}</p>
              <p className="mt-2 text-sm">Appears in: {selectedSkill.roles}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <p className="mt-6 text-sm text-muted-foreground">Complete the project to add these skills to your Career Growth Pathway.</p>

        <AnimatePresence>
          {showCareerAspects ? (
            <motion.aside
              id="career-aspects-card"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.28, ease: 'easeOut' as const }}
              className="mt-7 overflow-hidden rounded-lg border border-primary bg-card text-card-foreground shadow-lg"
              aria-labelledby="career-aspects-heading"
            >
              <div className="border-b border-border bg-secondary p-6 text-secondary-foreground sm:flex sm:items-center sm:gap-5">
                <motion.span
                  initial={{ rotate: -12, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' as const }}
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  aria-hidden="true"
                >
                  <PartyPopper className="size-6" />
                </motion.span>
                <div className="mt-4 sm:mt-0">
                  <h3 id="career-aspects-heading" className="text-xl font-semibold">Unlocked new career aspects</h3>
                  <p className="mt-2 text-sm text-muted-foreground">These roles commonly require the skills practised in this project.</p>
                </div>
              </div>
              <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
                {['Junior AI specialist', 'Business analyst', 'Customer experience specialist', 'AI support analyst'].map((role: string) => (
                  <div key={role} className="bg-card p-5 text-card-foreground">
                    <p className="font-semibold">{role}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Uses AI literacy, communication, and workflow design.</p>
                  </div>
                ))}
              </div>
            </motion.aside>
          ) : null}
        </AnimatePresence>
        <div className="mt-10 border border-border bg-card p-6 text-card-foreground sm:p-8" aria-labelledby="workplace-connection-heading">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
            <div>
              <h3 id="workplace-connection-heading" className="text-xl font-semibold">How this connects to the workplace</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">This project mirrors a practical final assignment in an IBM learning pathway. It gives you a project where you can apply the skill, not only learn the theory.</p>
            </div>
            <ul className="divide-y divide-border border-y border-border">
              {workplaceEvidence.map((evidence: string) => (
                <li key={evidence} className="flex items-center gap-4 py-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary text-foreground" aria-hidden="true"><Check className="size-4" /></span>
                  <span className="font-medium">{evidence}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

type CommunityMember = {
  name: string;
  direction: string;
  tags: string[];
  introduction: string;
  image: string;
};

const communityMembers: CommunityMember[] = [
  {
    name: 'Minh N.',
    direction: 'Aspiring business analyst',
    tags: ['New to Singapore', 'Career switcher'],
    introduction: 'I am building data and problem-solving skills after working in customer operations.',
    image: 'https://cdn.hubblecontent.osi.office.net/m365content/publish/d451c706-8f19-4041-984f-48ea1a2964fd/thumbnails/large.jpg',
  },
  {
    name: 'Thiri A.',
    direction: 'Data analyst',
    tags: ['Working while learning', 'Growing in data'],
    introduction: 'I learn in short sessions after work and enjoy dashboard-building projects.',
    image: 'https://cdn.hubblecontent.osi.office.net/m365content/publish/21e8c927-150d-443f-99e7-c971d1963b5b/thumbnails/large.jpg',
  },
  {
    name: 'Paolo S.',
    direction: 'Project coordinator',
    tags: ['Building confidence', 'Looking for peer support'],
    introduction: 'I am exploring how my coordination experience can lead to a new role.',
    image: 'https://cdn.hubblecontent.osi.office.net/m365content/publish/9409513e-8997-4ef4-8504-04a596cdfeaf/thumbnails/large.jpg',
  },
];

function CommunityScreen() {
  const [requestedMembers, setRequestedMembers] = useState<string[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);

  const requestConnection = (name: string) => {
    setRequestedMembers((current: string[]) => current.includes(name) ? current : [...current, name]);
  };

  const joinEvent = (eventName: string) => {
    setJoinedEvents((current: string[]) => current.includes(eventName) ? current : [...current, eventName]);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <header className="max-w-4xl">
        <p className="text-sm font-semibold">COMMUNITY</p>
        <h1 className="mt-4 text-3xl font-light tracking-tight sm:text-4xl">People building their next step too</h1>
        <p className="mt-5 text-lg text-muted-foreground">Meet peers with similar goals, share what you are learning, and grow your network in Singapore.</p>
      </header>

      <div className="mt-8 flex items-start gap-4 border-l-4 border-primary bg-secondary p-5 text-secondary-foreground">
        <Users className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <p className="text-sm">Community matches are based on shared learning goals and selected community tags.</p>
      </div>

      <section className="mt-12" aria-labelledby="community-members-heading">
        <h2 id="community-members-heading" className="text-2xl font-semibold">People on a similar path</h2>
        <p className="mt-2 text-muted-foreground">Suggested from your learning goal, current role, and selected community interests.</p>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {communityMembers.map((member: CommunityMember) => {
            const requested = requestedMembers.includes(member.name);
            return (
              <article key={member.name} className="flex flex-col border border-border bg-card text-card-foreground">
                <img src={member.image} alt={`Portrait of ${member.name}`} className="h-64 w-full object-cover object-top" />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="mt-1 text-sm font-semibold">{member.direction}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {member.tags.map((tag: string) => <span key={tag} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{tag}</span>)}
                  </div>
                  <p className="mt-5 leading-relaxed text-muted-foreground">“{member.introduction}”</p>
                  <Button type="button" variant={requested ? 'secondary' : 'default'} disabled={requested} onClick={() => requestConnection(member.name)} className="mt-6 w-full rounded-none">
                    {requested ? 'Requested' : 'Connect'}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="learning-circles-heading">
        <h2 id="learning-circles-heading" className="text-2xl font-semibold">Upcoming learning circles</h2>
        <p className="mt-2 max-w-4xl text-muted-foreground">Small, semi-formal sessions for sharing career journeys, practical project lessons, and local job-market experiences.</p>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {[
            { title: 'From operations to data: what changed for me', type: 'Virtual learning circle', date: 'Thursday, 7:00 PM', place: 'Online', participants: '8 of 12 joined', host: 'Host: Minh N.', action: 'Join session' },
            { title: 'Coffee and career stories: building your next step in Singapore', type: 'In-person community meetup', date: 'Saturday, 10:30 AM', place: 'One-North, Singapore', participants: '14 of 20 joined', host: '', action: 'Reserve a place' },
          ].map((event: { title: string; type: string; date: string; place: string; participants: string; host: string; action: string }) => {
            const joined = joinedEvents.includes(event.title);
            return (
              <article key={event.title} className="flex min-h-80 flex-col border border-border bg-card p-6 text-card-foreground sm:p-8">
                <p className="w-fit bg-deep-blue px-3 py-1 text-xs font-semibold text-deep-blue-foreground">{event.type}</p>
                <h3 className="mt-6 text-xl font-semibold leading-snug">{event.title}</h3>
                <div className="mt-6 space-y-3 text-sm">
                  <p className="flex items-center gap-3"><CalendarDays className="size-5 shrink-0" aria-hidden="true" />{event.date}</p>
                  <p className="flex items-center gap-3">{event.place === 'Online' ? <Monitor className="size-5 shrink-0" aria-hidden="true" /> : <MapPin className="size-5 shrink-0" aria-hidden="true" />}{event.place}</p>
                  <p className="flex items-center gap-3"><Users className="size-5 shrink-0" aria-hidden="true" />{event.participants}</p>
                  {event.host ? <p className="font-semibold">{event.host}</p> : null}
                </div>
                <Button type="button" disabled={joined} onClick={() => joinEvent(event.title)} className="mt-auto w-full rounded-none pt-4">
                  {joined ? 'Place requested' : <>{event.action} <ArrowRight aria-hidden="true" /></>}
                </Button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}


function CareerDashboard({ view, setView, courseName, currentRole, targetRole }: { view: DashboardView; setView: (view: DashboardView, courseName?: string) => void; courseName: string; currentRole: string; targetRole: string }) {
  const tabs: { id: DashboardView; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'simulator', label: 'Career experience simulator' },
    { id: 'community', label: 'Community' },
  ];


  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border bg-background" aria-label="Career Path navigation">
        <div className="mx-auto flex max-w-7xl flex-col px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="flex h-20 items-center"><DashboardBrand /></div>
          <div className="flex gap-6 overflow-x-auto">
            {tabs.map((tab: { id: DashboardView; label: string }) => (
              <button key={tab.id} type="button" onClick={() => setView(tab.id)} className={cn('relative min-h-14 whitespace-nowrap text-sm font-semibold', view === tab.id ? 'text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:bg-primary' : 'text-muted-foreground')}>{tab.label}</button>
            ))}
          </div>
        </div>
      </nav>

      {view === 'dashboard' ? (
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <p className="text-sm font-semibold">Career Path</p>
          <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">Good morning, Cho</h1>
          <p className="mt-4 text-lg text-muted-foreground">You are closer to your next role than you think.</p>

          <section className="mt-10 flex flex-col gap-6 bg-primary p-6 text-primary-foreground sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-3xl items-start gap-4">
              <Bell className="mt-1 size-6 shrink-0" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-semibold">Data visualisation skills are rising in demand</h2>
                <p className="mt-3 leading-relaxed">Employers are increasingly asking for dashboard and storytelling skills. Building these skills can strengthen your path toward Senior data analyst.</p>
              </div>
            </div>
            <Button variant="secondary" className="shrink-0 rounded-none" onClick={() => setView('course', 'Why data visualisation matters')}>See why this matters <ArrowRight aria-hidden="true" /></Button>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold">Recommended for your growth</h2>
            <p className="mt-2 text-muted-foreground">Courses prioritised by the skills that move your path forward.</p>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {courses.map((course: (typeof courses)[number]) => (
                <article key={course.priority} className="flex min-h-96 flex-col border border-border bg-card p-6 text-card-foreground">
                  <p className="text-sm font-semibold text-muted-foreground">{course.priority}</p>
                  <h3 className="mt-6 text-xl font-semibold">{course.name}</h3>
                  <p className="mt-2 text-sm font-semibold">{course.duration}</p>
                  <p className="mt-5 leading-relaxed text-muted-foreground">{course.explanation}</p>
                  <div className="mt-auto pt-8">
                    <div className="flex items-center justify-between gap-4 text-sm font-semibold"><span>Career Fit Score</span><span>{course.score}%</span></div>
                    <div className="mt-3 h-1 bg-secondary" aria-label={`Career Fit Score ${course.score}%`}><div className="h-full bg-primary" style={{ width: `${course.score}%` }} /></div>
                    <p className="mt-3 text-xs text-muted-foreground">An explanatory estimate, not a guarantee.</p>
                    <Button className="mt-6 w-full rounded-none" onClick={() => setView('course', course.name)}>Start now <ArrowRight aria-hidden="true" /></Button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <CareerGrowthPathway />

          <section className="mt-8 border border-border bg-secondary p-6 text-secondary-foreground sm:flex sm:items-center sm:justify-between sm:gap-8">
            <div>
              <h2 className="text-xl font-semibold">Today’s next step</h2>
              <p className="mt-4 font-semibold">Start Data visualisation with Python</p>
              <p className="mt-1">Complete the first 20 minutes on your commute.</p>
              <p className="mt-3 text-sm">A practical first step for your 1-hour plan.</p>
            </div>
            <Button className="mt-6 shrink-0 rounded-none sm:mt-0" onClick={() => setView('course', 'Data visualisation with Python')}>Start now <ArrowRight aria-hidden="true" /></Button>
          </section>
        </div>
      ) : view === 'simulator' ? (
        <CareerExperienceSimulator currentRole={currentRole} targetRole={targetRole} onOpenWorkspace={() => setView('course', 'Project workspace')} />
      ) : view === 'community' ? (
        <CommunityScreen />
      ) : (
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
          <p className="text-sm font-semibold">Career Path</p>
          <h1 className="mt-3 text-3xl font-light">{courseName}</h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">This prototype destination is ready for a future configured learning experience.</p>
          <Button className="mt-8 rounded-none" onClick={() => setView('dashboard')}>Back to dashboard</Button>
        </div>
      )}
    </main>
  );
}

const headingLines: Record<Step, string[]> = {
  signup: ['Your career growth journey', 'starts here.'],
  welcome: ['See where your skills', 'can take you'],
  role: ['What do you do', 'right now?'],
  skills: ['What are the skills', 'you already have?'],
  goal: ['What is your goal?'],
  'career-start': ['Where are you now', 'in your career?'],
  loading: ['Building your path…'],
  preview: ['You are further along', 'than you think'],
  simulator: ['Career Experience', 'Simulator'],
};

const panelVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -18, transition: { duration: 0.34, ease: 'easeOut' as const } },
};

function Brand() {
  return (
    <div className="flex items-center gap-3 text-white" aria-label="IBM SkillsBuild">
      <span className="flex flex-col items-center gap-0.5" aria-hidden="true">
        <span className="h-px w-full bg-white" />
        <span className="text-xl font-bold leading-none tracking-tight">IBM</span>
        <span className="h-px w-full bg-white" />
      </span>
      <span className="text-base font-semibold tracking-tight">SkillsBuild</span>
    </div>
  );
}

function Heading({ step }: { step: Step }) {
  return (
    <h1 className="text-[2.2rem] font-light leading-[1.02] tracking-[-0.035em] sm:text-[3.25rem] lg:text-[3.625rem]">
      {headingLines[step].map((line: string, index: number) => (
        <motion.span
          key={line}
          className="block"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}


          transition={{ duration: 0.48, delay: index * 0.12, ease: 'easeOut' as const }}
        >
          {line}
        </motion.span>
      ))}
    </h1>
  );
}

function OptionCard({ option, selected, onClick, index }: { option: Option; selected: boolean; onClick: () => void; index: number }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'min-h-20 border p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-card-foreground hover:border-primary',
      )}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.06, ease: 'easeOut' as const }}
    >
      <span className="flex items-start justify-between gap-4">
        <span>
          <span className="block text-base font-semibold leading-snug">{option.label}</span>
          {option.description ? <span className={cn('mt-2 block text-sm leading-relaxed', selected ? 'text-primary-foreground' : 'text-muted-foreground')}>{option.description}</span> : null}
        </span>
        {selected ? <Check className="mt-0.5 size-5 shrink-0" aria-hidden="true" /> : null}
      </span>
    </motion.button>
  );
}

export default function HomePage() {
  const [step, setStep] = useState<Step>('signup');
  const [search, setSearch] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [userGoal, setUserGoal] = useState('');
  const [careerStartMethod, setCareerStartMethod] = useState<'resume' | 'linkedin' | 'simulator' | ''>('');
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [desiredRole, setDesiredRole] = useState('');
  const [commitmentTime, setCommitmentTime] = useState('');
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [dashboardView, setDashboardView] = useState<DashboardView>('dashboard');
  const [courseName, setCourseName] = useState('');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) setPointer({ x: 0, y: 0 });
  }, [reduceMotion]);

  const filteredRoles = useMemo(
    () => roles.filter((role: Option) => role.label.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  const questionNumber = questionSteps.indexOf(step) + 1;

  const goBack = () => {
    const index = steps.indexOf(step);
    if (index > 0) setStep(steps[index - 1]);
  };

  const toggleSelection = (id: string, values: string[], setter: (next: string[]) => void) => {
    setter(values.includes(id) ? values.filter((value: string) => value !== id) : [...values, id]);
  };

  const chooseRole = (id: string) => {
    if (currentRole !== id) setSelectedSkills([]);
    setCurrentRole(id);
    setCustomRole('');
    window.setTimeout(() => setStep('skills'), reduceMotion ? 0 : 400);
  };

  const chooseCustomRole = () => {
    const role = search.trim();
    if (!role) return;
    if (currentRole !== 'custom' || customRole !== role) setSelectedSkills([]);
    setCustomRole(role);
    setCurrentRole('custom');
    window.setTimeout(() => setStep('skills'), reduceMotion ? 0 : 400);
  };

  const chooseCareerStart = (method: 'resume' | 'linkedin') => {
    setCareerStartMethod(method);
    setStep('loading');
    window.setTimeout(() => setStep('preview'), reduceMotion ? 0 : 1800);
  };

  const startSimulator = () => {
    setCareerStartMethod('simulator');
    setStep('simulator');
  };

  const handlePointerMove = (event: MouseEvent<HTMLElement>) => {
    if (reduceMotion || window.innerWidth < 768) return;
    setPointer({ x: (event.clientX / window.innerWidth - 0.5) * 14, y: (event.clientY / window.innerHeight - 0.5) * 14 });
  };

  const availableSkills = roleSkills[currentRole] ?? generalSkills;
  const selectedRoleLabel = currentRole === 'custom' ? customRole : roles.find((role: Option) => role.id === currentRole)?.label ?? 'Your current role';
  const selectedSkillLabels = availableSkills.filter((skill: Option) => selectedSkills.includes(skill.id)).map((skill: Option) => skill.label);

  const changeDashboardView = (view: DashboardView, selectedCourse = '') => {
    setDashboardView(view);
    if (selectedCourse) setCourseName(selectedCourse);
  };

  if (step === 'preview') {
    return <CareerDashboard view={dashboardView} setView={changeDashboardView} courseName={courseName} currentRole={selectedRoleLabel} targetRole={desiredRole.trim() || 'Senior data analyst'} />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-primary text-foreground" onMouseMove={handlePointerMove}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${workshopImage})` }} aria-hidden="true" />
      <div className="absolute inset-0 bg-primary mix-blend-multiply" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--primary),transparent_35%),linear-gradient(115deg,var(--primary),transparent_55%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-secondary blur-3xl [animation:drift-one_16s_ease-in-out_infinite]" style={{ translate: `${pointer.x}px ${pointer.y}px` }} />
        <div className="absolute right-[-8rem] top-[12%] h-[30rem] w-[30rem] rounded-full bg-primary blur-3xl [animation:drift-two_20s_ease-in-out_infinite]" style={{ translate: `${-pointer.x}px ${pointer.y * 0.5}px` }} />
        <div className="absolute bottom-[-10rem] left-[35%] h-96 w-96 rounded-full bg-secondary blur-3xl [animation:drift-one_24s_ease-in-out_infinite]" />
      </div>

      <header className="relative z-10 flex h-20 items-center px-5 sm:px-8 lg:px-12">
        <Brand />
      </header>

      {questionNumber > 0 ? (
        <div className="relative z-10 px-5 sm:px-8 lg:px-12">
          <div className="h-1 w-full bg-secondary"><motion.div className="h-full bg-primary" animate={{ width: `${questionNumber * 25}%` }} transition={{ duration: 0.5, ease: 'easeOut' as const }} /></div>
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center px-5 py-8 sm:px-8 lg:px-12">
        <AnimatePresence mode="wait">
          <motion.section
            key={step}
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn('mx-auto w-full bg-background text-foreground', step === 'signup' ? 'max-w-xl p-7 sm:p-12' : 'max-w-[56rem] p-6 sm:p-10 lg:p-12')}
          >
            {questionNumber > 0 ? <p className="mb-7 text-sm font-semibold text-muted-foreground">{questionNumber} of 4</p> : null}
            {step === 'signup' ? (
              <div>
                <p className="mb-5 text-sm font-semibold">Career Path</p>
                <Heading step={step} />
                <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">Discover the skills you already have and build a practical path forward.</p>
                <div className="mt-9 space-y-3">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" placeholder="name@gmail.com" className="h-12 rounded-none border-border" />
                </div>
                <Button className="mt-5 h-12 w-full rounded-none text-base" onClick={() => setStep('welcome')}>Continue with Google <ArrowRight aria-hidden="true" /></Button>
                <p className="mt-4 text-sm text-muted-foreground">This is a prototype. No account will be created.</p>
              </div>
            ) : null}

            {step === 'welcome' ? (
              <div className="max-w-2xl py-5 sm:py-12">
                <Heading step={step} />
                <p className="mt-7 text-xl text-muted-foreground">Two minutes. Discover your potential and growth.</p>
                <Button className="mt-10 h-12 rounded-none px-7 text-base" onClick={() => setStep('role')}>Show me <ArrowRight aria-hidden="true" /></Button>
              </div>
            ) : null}

            {step === 'role' ? (
              <div className="max-w-[45rem]">
                <Heading step={step} />
                <p className="mt-5 text-base text-muted-foreground">Pick the closest one, or type your own job. You can change this later.</p>
                <div className="relative mt-8">
                  <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2" aria-hidden="true" />
                  <Label htmlFor="role-search" className="sr-only">Search or enter your role</Label>
                  <Input id="role-search" value={search} onChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)} onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => { if (event.key === 'Enter' && search.trim()) chooseCustomRole(); }} placeholder="Search or type your job" className="h-12 rounded-none pl-12" />
                </div>
                {search.trim() && !roles.some((role: Option) => role.label.toLowerCase() === search.trim().toLowerCase()) ? (
                  <button type="button" onClick={chooseCustomRole} className="mt-3 flex min-h-12 w-full items-center justify-between border border-primary bg-secondary px-4 py-3 text-left font-semibold text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                    <span>Use “{search.trim()}” as my role</span>
                    <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
                  </button>
                ) : null}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {filteredRoles.map((role: Option, index: number) => <OptionCard key={role.id} option={role} selected={currentRole === role.id} onClick={() => chooseRole(role.id)} index={index} />)}
                </div>
                {filteredRoles.length === 0 && !search.trim() ? <p className="border border-border bg-muted p-5 text-muted-foreground">Start typing to find your role.</p> : null}
              </div>
            ) : null}

            {step === 'skills' ? (
              <div className="max-w-[45rem]">
                <Heading step={step} />
                <p className="mt-5 text-base text-muted-foreground">These technical and people skills are showing up in job descriptions for {selectedRoleLabel.toLowerCase()}. Choose the ones you already use. These skills can be upgraded even further.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {availableSkills.map((skill: Option, index: number) => (
                    <motion.button key={skill.id} type="button" aria-pressed={selectedSkills.includes(skill.id)} onClick={() => toggleSelection(skill.id, selectedSkills, setSelectedSkills)} className={cn('min-h-12 rounded-full border px-5 py-3 text-left font-semibold transition-colors', selectedSkills.includes(skill.id) ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-card-foreground hover:border-primary')} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.06 }}>
                      {skill.label}
                    </motion.button>
                  ))}
                </div>
                <Button disabled={selectedSkills.length === 0} className="mt-9 h-12 rounded-none px-7" onClick={() => setStep('goal')}>Keep going <ArrowRight aria-hidden="true" /></Button>
              </div>
            ) : null}

            {step === 'goal' ? (
              <div className="max-w-[45rem]">
                <Heading step={step} />
                <p className="mt-5 text-base text-muted-foreground">Choose what feels most useful right now.</p>
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {goals.map(({ id, label, description, icon: Icon }, index: number) => (
                    <motion.button key={id} type="button" aria-pressed={userGoal === id} onClick={() => setUserGoal(id)} className={cn('min-h-48 border p-6 text-left transition-colors', userGoal === id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-card-foreground hover:border-primary')} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.06 }}>
                      <Icon className="size-7" strokeWidth={1.5} aria-hidden="true" />
                      <span className="mt-8 block text-lg font-semibold">{label}</span>
                      <span className={cn('mt-2 block text-sm leading-relaxed', userGoal === id ? 'text-primary-foreground' : 'text-muted-foreground')}>{description}</span>
                    </motion.button>
                  ))}
                </div>
                <AnimatePresence>
                  {userGoal === 'growth' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-6 grid gap-4 border border-border bg-card p-5 text-card-foreground sm:grid-cols-2"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="desired-role">Role you want</Label>
                        <Input id="desired-role" value={desiredRole} onChange={(event: ChangeEvent<HTMLInputElement>) => setDesiredRole(event.target.value)} placeholder="e.g. Senior data analyst" className="h-12 rounded-none" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="commitment-time">Time you can commit</Label>
                        <Input id="commitment-time" value={commitmentTime} onChange={(event: ChangeEvent<HTMLInputElement>) => setCommitmentTime(event.target.value)} placeholder="e.g. 3 hours per week" className="h-12 rounded-none" />
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                {userGoal ? <Button className="mt-9 h-12 rounded-none px-7" disabled={userGoal === 'growth' && (!desiredRole.trim() || !commitmentTime.trim())} onClick={() => setStep('career-start')}>Continue <ArrowRight aria-hidden="true" /></Button> : null}
              </div>
            ) : null}

            {step === 'career-start' ? (
              <div>
                <Heading step={step} />
                <p className="mt-5 text-base text-muted-foreground">Tell your current status or check where you are in the job market. This is for a skills gap analysis.</p>
                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex min-h-80 flex-col border border-border bg-card p-6 text-card-foreground">
                    <FileText className="size-8" strokeWidth={1.5} aria-hidden="true" />
                    <h2 className="mt-7 text-xl font-semibold">Add my experience</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Upload a resume or connect LinkedIn to help map your experience.</p>
                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      <Button variant="outline" className="h-16 min-w-36 rounded-none px-5" asChild>
                        <label htmlFor="resume-upload" className="flex cursor-pointer flex-col items-center gap-1.5 whitespace-nowrap">
                          <span>Upload resume</span>
                          <Upload className="size-4" aria-hidden="true" />
                          <input
                            id="resume-upload"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.doc,.docx"
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                              if (event.target.files?.length) chooseCareerStart('resume');
                            }}
                          />
                        </label>
                      </Button>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin-profile">Add LinkedIn profile</Label>
                        <Input
                          id="linkedin-profile"
                          type="url"
                          value={linkedinProfile}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => setLinkedinProfile(event.target.value)}
                          placeholder="Paste your profile link"
                          className="h-10 rounded-none"
                        />
                        <Button variant="outline" className="w-full rounded-none" disabled={!linkedinProfile.trim()} onClick={() => chooseCareerStart('linkedin')}>Continue</Button>
                      </div>
                    </div>
                    <p className="mt-auto pt-6 text-xs text-muted-foreground">Prototype only — your information will not be saved.</p>
                  </div>
                  <div className="flex min-h-80 flex-col border border-border bg-card p-6 text-card-foreground">
                    <Timer className="size-8" strokeWidth={1.5} aria-hidden="true" />
                    <h2 className="mt-7 text-xl font-semibold">Test a career in 15 minutes</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Try a short, real-world task before deciding where to go.</p>
                    <Button className="mt-auto rounded-none" onClick={startSimulator}>Test now <ArrowRight aria-hidden="true" /></Button>
                  </div>
                </div>
              </div>
            ) : null}

            {step === 'loading' ? (
              <div className="max-w-2xl py-16">
                <Heading step={step} />
                <p className="mt-5 text-lg text-muted-foreground">Turning your experience into your next practical step.</p>
                <div className="mt-10 h-1 overflow-hidden bg-secondary" aria-label="Building career path">
                  <motion.div className="h-full bg-primary" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: reduceMotion ? 0 : 1.8, ease: 'easeInOut' as const }} />
                </div>
              </div>
            ) : null}

            {step === 'simulator' ? (
              <div className="max-w-2xl py-12">
                <Heading step={step} />
                <p className="mt-6 text-lg text-muted-foreground">Your 15-minute career experience will begin here.</p>
                <Button className="mt-9 rounded-none" onClick={() => setStep('career-start')}>Back to starting point</Button>
              </div>
            ) : null}



            {step !== 'signup' && step !== 'loading' && step !== 'simulator' ? <button type="button" onClick={goBack} className="mt-10 text-sm font-semibold underline underline-offset-4">Back</button> : null}
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}