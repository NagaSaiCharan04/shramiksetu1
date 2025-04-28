import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { toast } from "sonner";
import { usePostJob } from "@/hooks/useJobs";

const JobPostingForm = () => {
  const { t } = useLanguage();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState([50000, 100000]);
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const postJob = usePostJob();

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(currentSkill.trim())) {
        setSkills([...skills, currentSkill.trim()]);
      }
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const jobData = {
      title: jobTitle,
      description: jobDescription,
      type: jobType,
      location,
      salary_min: salaryRange[0],
      salary_max: salaryRange[1],
      experience,
      skills,
      company_name: companyName,
      contact: contactInfo,
      deadline: deadline ? deadline : new Date(),
    };
    try {
      await postJob.mutateAsync(jobData);
      toast.success(t("success"), {
        description: t("jobPostingSuccess"),
      });
      setJobTitle("");
      setJobDescription("");
      setJobType("");
      setLocation("");
      setSalaryRange([50000, 100000]);
      setExperience("");
      setSkills([]);
      setCompanyName("");
      setContactInfo("");
      setDeadline(undefined);
    } catch (err: any) {
      toast.error(t("error"), {
        description: err?.message || "Something went wrong.",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <h2 className="text-2xl font-bold mb-6">{t('postJobTitle')}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="jobTitle" className="block mb-1 font-medium">
              {t('jobTitle')}*
            </label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder={t('jobTitlePlaceholder')}
              required
            />
          </div>
          
          <div>
            <label htmlFor="jobDescription" className="block mb-1 font-medium">
              {t('jobDescription')}*
            </label>
            <Textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={t('jobDescriptionPlaceholder')}
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="jobType" className="block mb-1 font-medium">
                {t('jobType')}*
              </label>
              <Select value={jobType} onValueChange={setJobType} required>
                <SelectTrigger>
                  <SelectValue placeholder={t('jobType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">{t('fullTime')}</SelectItem>
                  <SelectItem value="part-time">{t('partTime')}</SelectItem>
                  <SelectItem value="freelance">{t('freelance')}</SelectItem>
                  <SelectItem value="internship">{t('internship')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="location" className="block mb-1 font-medium">
                {t('location')}*
              </label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('locationPlaceholder')}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              {t('salaryRange')}*
            </label>
            <div className="pt-6 px-4">
              <Slider
                defaultValue={[50000, 100000]}
                max={300000}
                step={5000}
                value={salaryRange}
                onValueChange={(values) => setSalaryRange(values as number[])}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span>{t('currencySymbol')}{salaryRange[0].toLocaleString()}</span>
              <span>{t('currencySymbol')}{salaryRange[1].toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="experience" className="block mb-1 font-medium">
                {t('experience')}*
              </label>
              <Select value={experience} onValueChange={setExperience} required>
                <SelectTrigger>
                  <SelectValue placeholder={t('experience')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">{t('experienceLevel1')}</SelectItem>
                  <SelectItem value="1-3">{t('experienceLevel2')}</SelectItem>
                  <SelectItem value="3-5">{t('experienceLevel3')}</SelectItem>
                  <SelectItem value="5+">{t('experienceLevel4')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="companyName" className="block mb-1 font-medium">
                {t('companyName')}*
              </label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={t('companyNamePlaceholder')}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="skills" className="block mb-1 font-medium">
              {t('skills')}*
            </label>
            <div className="mb-2">
              <Input
                id="skills"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder={t('skillsPlaceholder')}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div 
                  key={skill} 
                  className="bg-secondary flex items-center px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="contactInfo" className="block mb-1 font-medium">
              {t('contactInfo')}*
            </label>
            <Input
              id="contactInfo"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder={t('contactInfoPlaceholder')}
              required
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block mb-1 font-medium">
              {t('deadline')}*
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button type="submit" className="w-full">
          {t('submitJobPosting')}
        </Button>
      </form>
    </div>
  );
};

export default JobPostingForm;
