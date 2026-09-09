import test from 'node:test';
import assert from 'node:assert/strict';
import { Capacity, Campus, Gender, type Listing } from './types.ts';
import {
  calculateAnalytics,
  isListingOwnedBy,
  runOptimisticMutation,
} from './appLogic.ts';

const listing = (id: string, userId: string, capacity: Capacity, desired: Capacity): Listing => ({
  id,
  userId,
  contactInfo: `${id}@example.com`,
  currentDorm: {
    gender: Gender.Female,
    campus: Campus.Main,
    capacity,
    bunkBed: false,
  },
  currentDormDetails: '',
  desiredDorm: {
    gender: Gender.Female,
    campus: Campus.Main,
    capacity: desired,
    bunkBed: false,
  },
  createdAt: '2026-09-09T10:00:00.000Z',
});

test('ownership requires the authenticated user id', () => {
  const item = listing('listing-1', 'user-1', Capacity.One, Capacity.Two);

  assert.equal(isListingOwnedBy(item, 'user-1'), true);
  assert.equal(isListingOwnedBy(item, 'user-2'), false);
  assert.equal(isListingOwnedBy(item, null), false);
});

test('analytics counts real reciprocal matches without double counting', () => {
  const listings = [
    listing('one', 'user-1', Capacity.One, Capacity.Two),
    listing('two', 'user-2', Capacity.Two, Capacity.One),
    listing('three', 'user-3', Capacity.Three, Capacity.Four),
  ];

  const analytics = calculateAnalytics(listings, [], new Date('2026-09-09T12:00:00.000Z'));

  assert.equal(analytics.totalListings, 3);
  assert.equal(analytics.totalUsers, 3);
  assert.equal(analytics.dailyActivity.at(-1)?.matches, 1);
  assert.equal(analytics.successfulSwaps, 0);
});

test('active students include unique roommate seekers', () => {
  const listings = [listing('one', 'user-1', Capacity.One, Capacity.Two)];
  const roommateSearches = [
    {
      id: 'roommate-1',
      userId: 'user-1',
      name: 'Bir',
      contactInfo: 'bir@example.com',
      campus: Campus.Main,
      building: 'A',
      roomNumber: '1',
      createdAt: '2026-09-09T10:00:00.000Z',
    },
    {
      id: 'roommate-2',
      userId: 'user-2',
      name: 'İki',
      contactInfo: 'iki@example.com',
      campus: Campus.Main,
      building: 'A',
      roomNumber: '1',
      createdAt: '2026-09-09T10:00:00.000Z',
    },
  ];

  const analytics = calculateAnalytics(
    listings,
    roommateSearches,
    new Date('2026-09-09T12:00:00.000Z'),
  );

  assert.equal(analytics.totalUsers, 2);
});

test('failed optimistic mutation restores the prior state', async () => {
  const events: string[] = [];

  await assert.rejects(() => runOptimisticMutation({
    apply: () => events.push('apply'),
    persist: async () => { throw new Error('offline'); },
    rollback: () => events.push('rollback'),
  }), /offline/);

  assert.deepEqual(events, ['apply', 'rollback']);
});
