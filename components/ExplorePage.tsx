
import React, { useState, useMemo } from 'react';
import type { Listing, FilterCriteria } from '../types';
import { ListingCard } from './ListingCard';
import { FilterPanel } from './FilterPanel';
import { SearchIcon, PlusCircleIcon } from './icons';

interface ExplorePageProps {
  listings: Listing[];
  myListingId: string | null;
  onDeleteListing?: (listingId: string) => void;
  onCreateRequest?: () => void;
}

const initialFilters: FilterCriteria = {
  gender: 'any',
  campus: 'any',
  capacity: 'any',
  bunkBed: 'any',
};

const dormMatchesFilter = (listing: Listing, filters: FilterCriteria): boolean => {
    const { currentDorm } = listing;
    if (filters.gender !== 'any' && currentDorm.gender !== filters.gender) return false;
    
    // Handle campus filtering with 'multiple' option
    if (filters.campus !== 'any' && filters.campus !== 'multiple' && currentDorm.campus !== filters.campus) return false;
    if (filters.campus === 'multiple' && filters.preferredCampuses && filters.preferredCampuses.length > 0 && !filters.preferredCampuses.includes(currentDorm.campus)) return false;
    
    // Handle capacity filtering with new 'multiple' option
    if (filters.capacity !== 'any' && filters.capacity !== 'multiple' && currentDorm.capacity !== filters.capacity) return false;
    if (filters.capacity === 'multiple' && filters.preferredCapacities && filters.preferredCapacities.length > 0 && !filters.preferredCapacities.includes(currentDorm.capacity)) return false;
    
    if (filters.bunkBed !== 'any' && currentDorm.bunkBed !== filters.bunkBed) return false;
    return true;
};

export const ExplorePage: React.FC<ExplorePageProps> = ({ listings, myListingId, onDeleteListing, onCreateRequest }) => {
  const [filters, setFilters] = useState<FilterCriteria>(initialFilters);

  const handleFilterChange = <K extends keyof FilterCriteria>(key: K, value: FilterCriteria[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const filteredListings = useMemo(() => {
    return listings
      .filter(l => dormMatchesFilter(l, filters));
  }, [listings, filters]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Talebi Olmayan Ziyaretçiler İçin Sade Yönlendirme */}
      {!myListingId ? (
        <div className="bg-white border border-gray-200/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              İstediğin odayı bulamadın mı?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl">
              Kendi talebini oluştur; senin odana geçmek isteyen öğrenciler doğrudan sana ulaşsın.
            </p>
          </div>
          <button
            onClick={onCreateRequest}
            className="whitespace-nowrap px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-medium rounded-lg text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5 flex-shrink-0"
          >
            <PlusCircleIcon className="w-4 h-4" />
            <span>Talep Oluştur</span>
          </button>
        </div>
      ) : (
        /* Kullanıcının zaten talebi varsa sadece düzenle butonu */
        <div className="flex justify-start items-center">
          <button
            onClick={onCreateRequest}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-xs"
          >
            <PlusCircleIcon className="w-4 h-4" />
            <span>Talebimi Düzenle</span>
          </button>
        </div>
      )}

      <FilterPanel filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters}/>

      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {filteredListings.map(listing => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              emphasizeDescription={true}
              isOwnListing={listing.id === myListingId}
              onDeleteListing={onDeleteListing}
              onEditListing={listing.id === myListingId ? onCreateRequest : undefined}
              onCreateRequest={!myListingId ? onCreateRequest : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-center items-center mx-auto w-16 h-16 bg-indigo-100 rounded-full">
              <SearchIcon className="w-8 h-8 text-indigo-600"/>
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-800">Sonuç Bulunamadı</h3>
          <p className="mt-2 text-gray-500">Filtre kriterlerinizi değiştirmeyi veya daha sonra tekrar kontrol etmeyi deneyin.</p>
        </div>
      )}
    </div>
  );
};