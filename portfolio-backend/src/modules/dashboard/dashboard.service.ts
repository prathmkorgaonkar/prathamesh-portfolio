import { AppDataSource } from "../../database/data-source.js";
import { Contact } from "../../database/entities/contact.entity.js";
import { Experience } from "../../database/entities/experience.entity.js";
import { Project } from "../../database/entities/project.entity.js";
import { Skill } from "../../database/entities/skill.entity.js";


const projectRepository = AppDataSource.getRepository(Project);
const skillRepository = AppDataSource.getRepository(Skill);
const experienceRepository = AppDataSource.getRepository(Experience);
const contactRepository = AppDataSource.getRepository(Contact);

export const getDashboardStats = async () => {
  const [
    totalProjects,
    totalSkills,
    totalExperiences,
    totalContacts,
    unreadContacts,
    recentContacts,
  ] = await Promise.all([
    projectRepository.count(),

    skillRepository.count({
      where: { isActive: true },
    }),

    experienceRepository.count(),

    contactRepository.count(),

    contactRepository.count({
      where: { isRead: false },
    }),

    contactRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        isRead: true,
        createdAt: true,
      },
      order: {
        createdAt: "DESC",
      },
      take: 5,
    }),
  ]);

  return {
    statistics: {
      totalProjects,
      totalSkills,
      totalExperiences,
      totalContacts,
      unreadContacts,
    },
    recentContacts,
  };
};