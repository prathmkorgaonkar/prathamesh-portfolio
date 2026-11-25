import axiosInstance from "./axiosInstance";

export interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalExperiences: number;
  totalContacts: number;
  unreadContacts: number;
}

export interface RecentContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    statistics: DashboardStats;
    recentContacts: RecentContact[];
  };
}

export const getDashboardStats = async (): Promise<DashboardResponse> => {
  const response = await axiosInstance.get<DashboardResponse>(
    "/dashboard/stats"
  );

  return response.data;
};