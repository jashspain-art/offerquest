'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hexagon, Target, Briefcase, FileText, ChevronRight } from 'lucide-react';
import { updateOnboardingProfile, uploadCVAction } from './actions';

const steps = [
  { id: 1, title: 'Basic Intel', icon: Hexagon },
  { id: 2, title: 'Mission Parameters', icon: Target },
  { id: 3, title: 'Target Sectors', icon: Briefcase },
  { id: 4, title: 'Upload Dossier (CV)', icon: FileText },
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
      // 1. Update Profile
      await updateOnboardingProfile({
        location: formData.location,
        jobType: formData.jobType,
        experience: formData.experience,
        workMode: formData.workMode,
        sectors: formData.sectors,
      });

      // 2. Upload CV if exists
      if (formData.cvFile) {
        const cvFormData = new FormData();
        cvFormData.append('file', formData.cvFile);
        await uploadCVAction(cvFormData);
      }

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Mission failure: Could not complete onboarding. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center py-12 px-6">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950/80 to-slate-950 z-0 pointer-events-none" />
      
      <div className="z-10 w-full max-w-3xl mb-12 flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 z-0 rounded-full" />
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
              <motion.div 
                initial={false}
                animate={{ 
                  backgroundColor: isActive || isCompleted ? 'rgb(59 130 246)' : 'rgb(30 41 59)',
                  borderColor: isActive || isCompleted ? 'rgb(59 130 246)' : 'rgb(51 65 85)',
                  scale: isActive ? 1.2 : 1
                }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-lg transition-colors duration-300 ${isActive ? 'shadow-[0_0_20px_rgba(37,99,235,0.4)]' : ''}`}
              >
                <Icon className={`w-5 h-5 ${isActive || isCompleted ? 'text-white' : 'text-slate-400'}`} />
              </motion.div>
              <span className={`text-xs font-bold transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>
                {step.title}
              </span>
            </div>
          )
        })}
      </div>

      <div className="z-10 w-full max-w-xl">
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/50 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Basic Intel</h2>
                <p className="text-slate-400 text-sm">Let&apos;s start with your identity and location.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Target Location</Label>
                  <Input 
                    placeholder="e.g. London, Remote, New York" 
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-slate-950/50 border-slate-800 text-white rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Job Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Full-time', 'Part-time', 'Contract', 'Internship'].map(type => (
                      <div 
                        key={type}
                        onClick={() => setFormData({ ...formData, jobType: type })}
                        className={`p-3 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${formData.jobType === type ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'}`}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Mission Parameters</h2>
                <p className="text-slate-400 text-sm">What kind of experience do you have?</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Experience Level</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Entry Level', 'Mid Level', 'Senior', 'Executive'].map(level => (
                      <div 
                        key={level}
                        onClick={() => setFormData({ ...formData, experience: level })}
                        className={`p-3 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${formData.experience === level ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'}`}
                      >
                        {level}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Work Mode</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Remote', 'Hybrid', 'On-site'].map(mode => (
                      <div 
                        key={mode}
                        onClick={() => setFormData({ ...formData, workMode: mode })}
                        className={`p-3 text-sm rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${formData.workMode === mode ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'}`}
                      >
                        {mode}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Target Sectors</h2>
                <p className="text-slate-400 text-sm">Select the industries you want to conquer.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['Technology', 'Finance', 'Healthcare', 'Consulting', 'Design', 'Marketing', 'Engineering', 'Web3'].map(sector => (
                  <div 
                    key={sector}
                    onClick={() => {
                      const newSectors = formData.sectors.includes(sector)
                        ? formData.sectors.filter(s => s !== sector)
                        : [...formData.sectors, sector];
                      setFormData({ ...formData, sectors: newSectors });
                    }}
                    className={`p-3 text-sm rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${formData.sectors.includes(sector) ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'}`}
                  >
                    {sector}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Upload Dossier</h2>
                <p className="text-slate-400 text-sm">Upload your CV. Our AI will parse your skills to find the best missions.</p>
              </div>
              
              <div className="border-2 border-dashed border-slate-700 bg-slate-950/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <FileText className="w-12 h-12 text-slate-500 mb-4" />
                <Label htmlFor="cv-upload" className="mb-2 text-blue-400 cursor-pointer hover:text-blue-300 font-medium">
                  Click to browse
                </Label>
                <span className="text-slate-500 text-sm">or drag and drop your PDF/DOCX</span>
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
                  <div className="mt-4 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {formData.cvFile.name}
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
              {error}
            </motion.div>
          )}

          <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-800">
            {currentStep > 1 ? (
               <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={handlePrev}>
                Back
               </Button>
            ) : <div />}
            
            {currentStep < steps.length ? (
              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
                Next Step <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={completeOnboarding} 
                className="bg-green-600 hover:bg-green-500 text-white rounded-xl px-6 shadow-[0_0_20px_rgba(22,163,74,0.3)]"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Analyzing Dossier...' : 'Complete Registration'}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
