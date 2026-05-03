import { getNotesCount, getWeeklyNotesCount, getTagsCount, getCategoriesCount, getRecentNotes, getTags } from "../repositories/dashboard.repository.js";

const buildDashboardSummary = async (userId: string) => {

  const [
    totalNotes,
    notesThisWeek,
    totalTags,
    totalCategories,
    recentNotes,
    tags
  ] = await Promise.all([
        getNotesCount(userId),
        getWeeklyNotesCount(userId),
        getTagsCount(userId),
        getCategoriesCount(userId),
        getRecentNotes(userId),
        getTags(userId)
  ]);

    return {
        stats: {
            totalNotes,
            notesThisWeek,
            totalTags,
            totalCategories,
        },
        recentNotes: recentNotes,
        latestNote: recentNotes[0] || null,
        tags: tags,
    };

}

export default {
    buildDashboardSummary
};