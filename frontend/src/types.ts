export type Role = 'student' | 'recruiter' | 'admin';
export const STATUSES = ['Applied', 'Shortlisted', 'Interview', 'Offered', 'Rejected'] as const;
export type Status = (typeof STATUSES)[number];

export interface AuthUser { id: string; name: string; email: string; role: Role }
export interface Job {
  _id: string; title: string; company: string; location: string; type: 'Job' | 'Internship';
  mode: 'Onsite' | 'Remote' | 'Hybrid'; salary: string; description: string; skills: string[];
  createdAt: string; applicants?: number; postedBy?: { name: string; company: string } | string;
}
export interface Application {
  _id: string; status: Status; coverNote: string; createdAt: string;
  job: Pick<Job, '_id' | 'title' | 'company' | 'location' | 'type'>;
}
export interface Applicant {
  _id: string; status: Status; coverNote: string; createdAt: string;
  student: { name: string; email: string; headline: string; skills: string[]; education: string; resumeUrl: string };
}
export interface Analytics {
  role: Role; total: number; status: Partial<Record<Status, number>>;
  saved?: number; jobs?: number; students?: number; recruiters?: number;
}
export interface Profile {
  name: string; email: string; headline: string; bio: string; education: string; skills: string[]; company: string; resumeUrl: string;
}
