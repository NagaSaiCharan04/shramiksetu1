
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from "lucide-react";
// Added toast
import { useToast } from "@/components/ui/use-toast";

interface JobSearchFormProps {
  onSearch: (filters: any) => void;
}

const JobSearchForm = ({ onSearch }: JobSearchFormProps) => {
  const { t } = useLanguage();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 300000]);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      keyword,
      location,
      jobType,
      experience,
      salaryRange
    });
    toast({
      title: t("jobSearchUpdated") ?? "Results updated",
      description: t("jobSearchCompletedDesc") ?? "Job results have been updated.",
    });
  };

  const clearFilters = () => {
    setKeyword("");
    setLocation("");
    setJobType("");
    setExperience("");
    setSalaryRange([0, 300000]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <h2 className="text-2xl font-bold mb-6">{t('findJobTitle')}</h2>

      <form onSubmit={handleSearch}>
        <div className="flex flex-col md:flex-row items-stretch gap-4 mb-4">
          <div className="flex-1">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t('keywordSearchPlaceholder')}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('locationPlaceholder')}
              className="w-full"
            />
          </div>
          <Button type="submit" className="flex-shrink-0">
            <Search className="mr-2 h-4 w-4" />
            {t('search')}
          </Button>
        </div>

        <Accordion
          type="single"
          collapsible
          value={showFilters ? "filters" : undefined}
          onValueChange={(val) => setShowFilters(val === "filters")}
        >
          <AccordionItem value="filters">
            <AccordionTrigger className="font-semibold">
              {t('filters')}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div>
                  <label htmlFor="jobType" className="block mb-1 font-medium">
                    {t('jobType')}
                  </label>
                  <Select value={jobType} onValueChange={setJobType}>
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
                  <label htmlFor="experience" className="block mb-1 font-medium">
                    {t('experience')}
                  </label>
                  <Select value={experience} onValueChange={setExperience}>
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

                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium">
                    {t('salaryRange')}
                  </label>
                  <div className="pt-6 px-4">
                    <Slider
                      defaultValue={[0, 300000]}
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
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                >
                  {t('clearFilters')}
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </div>
  );
};

export default JobSearchForm;
