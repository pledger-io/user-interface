import { InputIcon } from "primereact/inputicon";
import React from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Slider } from "primereact/slider";
import { Button } from "primereact/button";
import { getPatternTypeOptions, i10nWithFallback } from "./utils";
import { IconField } from "primereact/iconfield";

interface PatternFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  patternTypeFilter: string | null;
  setPatternTypeFilter: (value: string | null) => void;
  patternConfidenceFilter: number;
  setPatternConfidenceFilter: (value: number) => void;
  resetFilters: () => void;
}

/**
 * Component for filtering patterns
 */
const PatternFilters: React.FC<PatternFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  patternTypeFilter,
  setPatternTypeFilter,
  patternConfidenceFilter,
  setPatternConfidenceFilter,
  resetFilters
}) => {
  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex flex-col md:flex-row gap-3 mb-3">
        <div className="flex-1">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search"/>
            <InputText 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder={i10nWithFallback('search')}
              className="w-full"
            />
          </IconField>
        </div>
        <div className="flex-1">
          <Dropdown
            value={patternTypeFilter}
            options={getPatternTypeOptions()}
            onChange={(e) => setPatternTypeFilter(e.value)}
            placeholder={i10nWithFallback('filter.by.type')}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1">
          <label htmlFor="confidence-filter" className="block mb-1">
            {i10nWithFallback('filter.by.confidence')}: {patternConfidenceFilter}%
          </label>
          <Slider 
            id="confidence-filter"
            value={patternConfidenceFilter} 
            onChange={(e) => setPatternConfidenceFilter(e.value as number)} 
            className="w-full" 
            step={5}
            max={100}
          />
        </div>
        <Button 
          icon="pi pi-filter-slash" 
          label={i10nWithFallback('reset.filters')} 
          className="p-button-outlined" 
          onClick={resetFilters}
        />
      </div>
    </div>
  );
};

export default PatternFilters;