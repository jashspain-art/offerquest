'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hexagon, Target, Briefcase, FileText, ChevronRight, ChevronLeft, Sparkles, MapPin, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';
import { updateOnboardingProfile, uploadCVAction } from './actions';

const steps = [
  { id: 1, title: 'Identity', icon: ShieldCheck, subtitle: 'Basic Profile' },
  { id: 2, title: 'Strategy', icon: Target, subtitle: 'Mission Goals' },
  { id: 3, title: 'Sectors', icon: Briefcase, subtitle: 'Target Areas' },
  { id: 4, title: 'Dossier', icon: FileText, subtitle: 'CV Analysis' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    location: '',
    jobType: '',
    experience: '',
    workMode: '',
    sectors: [] as string[],
    cvFile: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const completeOnboarding = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await updateOnboardingProfile({
        location: formData.location,
        jobType: formData.jobType,
        experience: formData.experience,
        workMode: formData.workMode,
        sectors: formData.sectors,
      });

      if (formData.cvFile) {
        const cvFormData = new FormData();
        cvFormData.append('file', formData.cvFile);
        await uploadCVAction(cvFormData);
      }

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Mission failure: Could not complete registration. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center py-16 px-6 font-sans">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none -z-0">
        <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-[#2563EB]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[25%] h-[25%] bg-[#6366F1]/5 rounded-full blur-[100px]" />
      </div>
      
      {/* Header */}
      <div className="z-10 mb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
           <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <span className="font-extrabold text-[#111827] text-xl tracking-tighter">
              Offer<span className="text-[#2563EB]">Quest</span>
            </span>
        </div>
        <h1 className="text-3xl font-black text-[#111827] tracking-tight">Mission Briefing</h1>
        <p className="text-[#6B7280] font-medium mt-1">Initialize your profile to deploy AI agents.</p>
      </div>

      {/* Stepper */}
      <div className="z-10 w-full max-w-2xl mb-16 px-4">
        <div className="relative flex justify-between">
          <div className="absolute top-[22px] left-0 w-full h-[2px] bg-[#E5E7EB] z-0" />
          <motion.div 
            className="absolute top-[22px] left-0 h-[2px] bg-[#2563EB] z-0" 
            initial={false}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />

          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center group">
                <motion.div 
                  initial={false}
                  animate={{ 
                    backgroundColor: isActive || isCompleted ? '#2563EB' : '#FFFFFF',
                    borderColor: isActive || isCompleted ? '#2563EB' : '#E5E7EB',
                    scale: isActive ? 1.1 : 1
                  }}
                  className="w-11 h-11 rounded-xl border-2 flex items-center justify-center shadow-sm transition-all duration-300"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#9CA3AF]'}`} />
                  )}
                </motion.div>
                <div className="absolute -bottom-8 whitespace-nowrap text-center">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>
                    {step.title}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Card */}
      <div className="z-10 w-full max-w-xl">
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-[#E5E7EB] rounded-[2rem] p-10 shadow-2xl shadow-black/[0.02]"
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-[#111827] tracking-tight mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-[#2563EB]" /> Identification
                  </h2>
                  <p className="text-[#6B7280] font-medium text-sm">Where are you operating from?</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-[#9CA3AF] ml-1">Target Coordinates (Location)</Label>
                    <div className="relative group">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] group-focus-within:text-[#2563EB]" />
                       <Input 
                        placeholder="e.g. London, San Francisco, Remote" 
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="h-12 pl-11 bg-[#F9FAFB] border-[#E5E7EB] rounded-2xl font-medium focus-visible:ring-4 focus-visible:ring-blue-500/5 focus-visible:border-[#2563EB] transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-[#9CA3AF] ml-1">Job Type Category</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Full-time', 'Part-time', 'Contract', 'Internship'].map(type => (
                        <button 
                          key={type}
                          onClick={() => setFormData({ ...formData, jobType: type })}
                          className={`h-12 rounded-2xl border text-sm font-bold flex items-center justify-center transition-all ${
                            formData.jobType === type 
                              ? 'bg-[#111827] border-[#111827] text-white shadow-lg' 
                              : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#2563EB] hover:text-[#2563EB]'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-[#111827] tracking-tight mb-2 flex items-center gap-2">
                    <Target className="w-6 h-6 text-[#16A34A]" /> Mission Parameters
                  </h2>
                  <p className="text-[#6B7280] font-medium text-sm">Define your experience and operational mode.</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-[#9CA3AF] ml-1">Experience Level</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Entry Level', 'Mid Level', 'Senior', 'Executive'].map(level => (
                        <button 
                          key={level}
                          onClick={() => setFormData({ ...formData, experience: level })}
                          className={`h-12 rounded-2xl border text-sm font-bold flex items-center justify-center transition-all ${
                            formData.experience === level 
                              ? 'bg-[#111827] border-[#111827] text-white shadow-lg' 
                              : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#2563EB] hover:text-[#2563EB]'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-[#9CA3AF] ml-1">Workspace Preference</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Remote', 'Hybrid', 'On-site'].map(mode => (
                        <button 
                          key={mode}
                          onClick={() => setFormData({ ...formData, workMode: mode })}
                          className={`h-12 rounded-2xl border text-[11px] font-black uppercase tracking-tighter flex items-center justify-center transition-all ${
                            formData.workMode === mode 
                              ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-lg shadow-blue-500/10' 
                              : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#2563EB] hover:text-[#2563EB]'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-[#111827] tracking-tight mb-2 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-[#7C3AED]" /> Target Sectors
                  </h2>
                  <p className="text-[#6B7280] font-medium text-sm">Which industries are you aiming to conquer?</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['Technology', 'Finance', 'Healthcare', 'Consulting', 'Design', 'Marketing', 'Engineering', 'Web3'].map(sector => (
                    <button 
                      key={sector}
                      onClick={() => {
                        const newSectors = formData.sectors.includes(sector)
                          ? formData.sectors.filter(s => s !== sector)
                          : [...formData.sectors, sector];
                        setFormData({ ...formData, sectors: newSectors });
                      }}
                      className={`h-12 rounded-2xl border text-sm font-bold flex items-center justify-center transition-all ${
                        formData.sectors.includes(sector) 
                          ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-lg shadow-purple-500/10' 
                          : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#7C3AED] hover:text-[#7C3AED]'
                      }`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-[#111827] tracking-tight mb-2 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-[#F59E0B]" /> Dossier Upload
                  </h2>
                  <p className="text-[#6B7280] font-medium text-sm">Upload your CV. Our AI will analyze your skills to build your rank.</p>
                </div>
                
                <div className="relative border-4 border-dashed border-[#F3F4F6] bg-[#F9FAFB] rounded-[2rem] p-12 flex flex-col items-center justify-center text-center group hover:bg-blue-50 hover:border-blue-100 transition-all duration-500">
                  <div className="w-16 h-16 bg-white rounded-[1.25rem] shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="w-8 h-8 text-[#9CA3AF] group-hover:text-[#2563EB]" />
                  </div>
                  <Label htmlFor="cv-upload" className="font-bold text-[#111827] cursor-pointer mb-2">
                    <span className="text-[#2563EB] underline underline-offset-4 decoration-2">Click to select dossier</span>
                  </Label>
                  <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest">PDF or DOCX max 5MB</p>
                  <Input 
                    id="cv-upload" 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setFormData({ ...formData, cvFile: file });
                    }}
                  />
                  {formData.cvFile && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20">
                      <CheckCircle2 className="w-4 h-4" />
                      {formData.cvFile.name}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              {error}
            </motion.div>
          )}

          <div className="mt-12 flex items-center justify-between pt-8 border-t border-[#F3F4F6]">
            {currentStep > 1 ? (
               <button 
                onClick={handlePrev}
                className="flex items-center gap-2 text-sm font-bold text-[#6B7280] hover:text-[#111827] transition-colors"
               >
                <ChevronLeft className="w-4 h-4" /> Back
               </button>
            ) : <div />}
            
            {currentStep < steps.length ? (
              <Button 
                onClick={handleNext} 
                className="h-12 px-8 bg-[#111827] hover:bg-[#111827]/90 text-white rounded-2xl font-bold shadow-xl shadow-black/5 group"
              >
                Proceed <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button 
                onClick={completeOnboarding} 
                className="h-12 px-8 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 active:scale-95 group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Dossier...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Complete Onboarding <Zap className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
                  </span>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      <p className="mt-12 text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.2em] z-10">OfferQuest Advanced Recruitment Engine v1.0</p>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
