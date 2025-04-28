import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Loader } from "lucide-react";

import type { Job } from "@/hooks/useJobs";

interface JobListingsProps {
  jobs: Job[];
  loading?: boolean;
  error?: any;
}

const JobListings = ({ jobs, loading, error }: JobListingsProps) => {
  const { t } = useLanguage();
  const [openJobId, setOpenJobId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 flex items-center justify-center">
        <Loader className="animate-spin w-7 h-7 mr-2 text-primary" />
        <p className="text-center py-10">{t("loading") || "Loading jobs..."}</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <p className="text-center text-destructive py-10">
          {t("error") || "Failed to load jobs."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {jobs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">{t("noJobsFound") || "No jobs match your criteria."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="w-full">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>
                      {job.company_name} • {job.location}
                    </CardDescription>
                  </div>
                  <div className="mt-2 md:mt-0 text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {t(
                      job.type === "full-time"
                        ? "fullTime"
                        : job.type === "part-time"
                        ? "partTime"
                        : job.type === "freelance"
                        ? "freelance"
                        : "internship"
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-gray-600 mb-4">
                  {job.description}
                </p>
                <div className="flex flex-col sm:flex-row justify-between text-sm">
                  <span className="mb-2 sm:mb-0">
                    {t("salaryRange")}: {t("currencySymbol")}
                    {job.salary_min?.toLocaleString?.()}
                    {" - "}
                    {t("currencySymbol")}
                    {job.salary_max?.toLocaleString?.()} {t("perYear")}
                  </span>
                  <span>
                    {t("applicationDeadline")}:{" "}
                    {format(new Date(job.deadline), "MMM dd, yyyy")}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {t("postedOn")}{" "}
                  {format(
                    new Date(job.created_at ?? Date.now()),
                    "MMM dd, yyyy"
                  )}
                </span>
                <Dialog
                  open={openJobId === job.id}
                  onOpenChange={(open) => setOpenJobId(open ? job.id : null)}
                >
                  <DialogTrigger asChild>
                    <Button>{t("applyNow")}</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{job.title}</DialogTitle>
                      <DialogDescription>
                        {job.company_name} • {job.location}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-1">
                          {t("contactEmployer")}
                        </h4>
                        <p>{job.contact}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">
                          {t("jobDescription")}
                        </h4>
                        <p className="text-gray-600">{job.description}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;
