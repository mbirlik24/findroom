import { listingsMatch } from './matching.ts';
import type { Analytics, Listing, RoommateSearch } from './types';

export const isListingOwnedBy = (
  listing: Pick<Listing, 'userId'> | null | undefined,
  userId: string | null | undefined,
): boolean => Boolean(listing?.userId && userId && listing.userId === userId);

export const calculateAnalytics = (
  listings: Listing[],
  roommateSearches: RoommateSearch[] = [],
  referenceDate = new Date(),
): Analytics => {
  const dormCounts = new Map<string, number>();
  const matchesByDate = new Map<string, number>();
  const listingCountsByDate = new Map<string, number>();
  const matchTimes: number[] = [];

  for (const item of listings) {
    const dormKey = `${item.currentDorm.campus} - ${item.currentDorm.capacity}`;
    dormCounts.set(dormKey, (dormCounts.get(dormKey) ?? 0) + 1);
    const date = item.createdAt.slice(0, 10);
    listingCountsByDate.set(date, (listingCountsByDate.get(date) ?? 0) + 1);
  }

  for (let first = 0; first < listings.length; first += 1) {
    for (let second = first + 1; second < listings.length; second += 1) {
      if (!listingsMatch(listings[first], listings[second])) continue;
      const firstTime = Date.parse(listings[first].createdAt);
      const secondTime = Date.parse(listings[second].createdAt);
      const matchTime = Math.max(firstTime, secondTime);
      const matchDate = new Date(matchTime).toISOString().slice(0, 10);
      matchesByDate.set(matchDate, (matchesByDate.get(matchDate) ?? 0) + 1);
      matchTimes.push(Math.abs(firstTime - secondTime) / 60000);
    }
  }

  const dailyActivity = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(referenceDate);
    date.setUTCDate(date.getUTCDate() - (6 - offset));
    const dateKey = date.toISOString().slice(0, 10);
    return {
      date: dateKey,
      listings: listingCountsByDate.get(dateKey) ?? 0,
      matches: matchesByDate.get(dateKey) ?? 0,
    };
  });

  const activeStudents = new Set<string>();
  for (const item of [...listings, ...roommateSearches]) {
    const identity = item.userId
      ? `user:${item.userId}`
      : `contact:${item.contactInfo.trim().toLocaleLowerCase('tr-TR')}`;
    activeStudents.add(identity);
  }

  return {
    totalListings: listings.length,
    totalUsers: activeStudents.size,
    successfulSwaps: 0,
    averageMatchTime: matchTimes.length
      ? Math.round(matchTimes.reduce((sum, value) => sum + value, 0) / matchTimes.length)
      : 0,
    popularDorms: [...dormCounts.entries()]
      .map(([dorm, count]) => ({ dorm, count }))
      .sort((left, right) => right.count - left.count),
    dailyActivity,
    userActivity: [],
  };
};

export const runOptimisticMutation = async ({
  apply,
  persist,
  rollback,
}: {
  apply: () => void;
  persist: () => Promise<void>;
  rollback: () => void;
}): Promise<void> => {
  apply();
  try {
    await persist();
  } catch (error) {
    rollback();
    throw error;
  }
};
