import test from 'node:test';
import assert from 'node:assert/strict';
import { Capacity, Campus, Gender } from './types.ts';
import { dormsMatch, findDormSwapMatches } from './matching.ts';

const current = (capacity: Capacity) => ({
  gender: Gender.Female,
  campus: Campus.Main,
  capacity,
  bunkBed: false,
});

test('matches one of several preferred capacities', () => {
  assert.equal(dormsMatch(current(Capacity.Two), {
    gender: Gender.Female,
    campus: Campus.Main,
    capacity: 'multiple',
    preferredCapacities: [Capacity.Two, Capacity.Three],
    bunkBed: false,
  }), true);
});

test('matches one of several preferred campuses', () => {
  assert.equal(dormsMatch(current(Capacity.Two), {
    gender: Gender.Female,
    campus: 'multiple',
    preferredCampuses: [Campus.Main, Campus.West],
    capacity: Capacity.Two,
    bunkBed: false,
  }), true);

  assert.equal(dormsMatch(current(Capacity.Two), {
    gender: Gender.Female,
    campus: 'multiple',
    preferredCampuses: [Campus.West],
    capacity: Capacity.Two,
    bunkBed: false,
  }), false);
});

test('requires both users to want each other dorms', () => {
  const listings = [
    {
      id: 'one', contactInfo: 'one', currentDorm: current(Capacity.One),
      currentDormDetails: '', createdAt: new Date().toISOString(),
      desiredDorm: { gender: Gender.Female, campus: Campus.Main, capacity: Capacity.Two, bunkBed: false },
    },
    {
      id: 'two', contactInfo: 'two', currentDorm: current(Capacity.Two),
      currentDormDetails: '', createdAt: new Date().toISOString(),
      desiredDorm: { gender: Gender.Female, campus: Campus.Main, capacity: Capacity.One, bunkBed: false },
    },
  ];

  assert.deepEqual(findDormSwapMatches(listings).map(listing => listing.id), ['two']);
});

