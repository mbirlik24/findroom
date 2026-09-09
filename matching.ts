import type { DesiredDormInfo, Listing, SpecificDormInfo } from './types';

export const dormsMatch = (
  specific: SpecificDormInfo,
  desired: DesiredDormInfo,
): boolean => {
  const capacityMatches = desired.capacity === 'any'
    || (desired.capacity === 'multiple'
      ? !desired.preferredCapacities?.length
        || desired.preferredCapacities.includes(specific.capacity)
      : desired.capacity === specific.capacity);

  const campusMatches = desired.campus === 'any'
    || (desired.campus === 'multiple'
      ? !desired.preferredCampuses?.length
        || desired.preferredCampuses.includes(specific.campus)
      : desired.campus === specific.campus);

  return (desired.gender === 'any' || desired.gender === specific.gender)
    && campusMatches
    && capacityMatches
    && (desired.bunkBed === 'any' || desired.bunkBed === specific.bunkBed);
};

export const listingsMatch = (first: Listing, second: Listing): boolean =>
  dormsMatch(first.currentDorm, second.desiredDorm)
  && dormsMatch(second.currentDorm, first.desiredDorm);

export const findDormSwapMatches = (
  listings: Listing[],
  listing: Listing = listings[0],
): Listing[] => listing
  ? listings.filter(candidate => candidate.id !== listing.id && listingsMatch(listing, candidate))
  : [];

