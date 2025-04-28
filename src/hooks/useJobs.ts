
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// TypeScript type for Job (aligned with DB schema)
export interface Job {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  salary_min: number;
  salary_max: number;
  experience: string;
  skills: string[];
  company_name: string;
  contact: string;
  deadline: string; // in ISO format
  created_at: string; // in ISO format
}

export interface PostJobInput {
  title: string;
  description: string;
  type: string;
  location: string;
  salary_min: number;
  salary_max: number;
  experience: string;
  skills: string[];
  company_name: string;
  contact: string;
  deadline: Date;
}

export interface JobFilters {
  keyword?: string;
  location?: string;
  jobType?: string;
  experience?: string;
  salaryRange?: [number, number];
}

function buildJobQuery(filters: JobFilters) {
  let query = supabase.from("jobs").select("*");
  
  // Apply filter conditions based on provided filters
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    // Use parenthesized filter group for OR conditions on keyword searches
    query = query.or(`title.ilike.%${kw}%,skills.cs.{${kw}}`);
  }
  
  if (filters.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }
  
  if (filters.jobType) {
    query = query.eq("type", filters.jobType);
  }
  
  if (filters.experience) {
    query = query.eq("experience", filters.experience);
  }
  
  if (filters.salaryRange && filters.salaryRange.length === 2) {
    query = query.gte("salary_min", filters.salaryRange[0]).lte("salary_max", filters.salaryRange[1]);
  }
  
  // Always order by most recent
  query = query.order("created_at", { ascending: false });
  return query;
}

// Fetch jobs with optional filters
export function useJobs(filters: JobFilters) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      let query = buildJobQuery(filters);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Job[];
    }
  });
}

// Post a new job
export function usePostJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: PostJobInput) => {
      const { error } = await supabase
        .from("jobs")
        .insert([
          {
            title: input.title,
            description: input.description,
            type: input.type,
            location: input.location,
            salary_min: input.salary_min,
            salary_max: input.salary_max,
            experience: input.experience,
            skills: input.skills,
            company_name: input.company_name,
            contact: input.contact,
            deadline: input.deadline.toISOString().substring(0, 10), // yyyy-mm-dd
          }
        ]);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    }
  });
}
