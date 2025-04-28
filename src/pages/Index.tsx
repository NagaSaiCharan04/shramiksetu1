import { useJobs, Job, JobFilters } from "@/hooks/useJobs";
import { useState } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import JobPostingForm from "@/components/JobPostingForm";
import JobSearchForm from "@/components/JobSearchForm";
import JobListings from "@/components/JobListings";

const Index = () => {
  const [mode, setMode] = useState<"hiring" | "searching">("searching");
  const [filters, setFilters] = useState<JobFilters>({
    keyword: "",
    location: "",
    jobType: "",
    experience: "",
    salaryRange: [0, 300000],
  });

  const { data: jobs = [], isLoading, error } = useJobs(filters);

  const handleSearch = (f: JobFilters) => setFilters(f);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Header mode={mode} setMode={setMode} />
        <main className="container mx-auto fade-in">
          {mode === "hiring" ? (
            <JobPostingForm />
          ) : (
            <>
              <JobSearchForm onSearch={handleSearch} />
              <JobListings jobs={jobs} loading={isLoading} error={error} />
            </>
          )}
        </main>
      </div>
    </LanguageProvider>
  );
};

export default Index;
