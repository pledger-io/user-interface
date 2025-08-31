import { InputIcon } from "primereact/inputicon";
import React from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Slider } from "primereact/slider";
import { Button } from "primereact/button";
import { getInsightTypeOptions, getSeverityOptions, i10nWithFallback } from "./utils";
import { IconField } from "primereact/iconfield";

interface InsightFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  insightTypeFilter: string | null;
  setInsightTypeFilter: (value: string | null) => void;
  insightSeverityFilter: string | null;
  setInsightSeverityFilter: (value: string | null) => void;
  insightScoreFilter: number;
  setInsightScoreFilter: (value: number) => void;
  resetFilters: () => void;
}

/**
 * Component for filtering insights
 */
const InsightFilters: React.FC<InsightFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  insightTypeFilter,
  setInsightTypeFilter,
  insightSeverityFilter,
  setInsightSeverityFilter,
  insightScoreFilter,
  setInsightScoreFilter,
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
        <div className="flex flex-1 gap-2">
          <Dropdown
            value={insightTypeFilter}
            options={getInsightTypeOptions()}
            onChange={(e) => setInsightTypeFilter(e.value)}
            placeholder={i10nWithFallback('filter.by.type')}
            className="w-full"
          />
          <Dropdown
            value={insightSeverityFilter}
            options={getSeverityOptions()}
            onChange={(e) => setInsightSeverityFilter(e.value)}
            placeholder={i10nWithFallback('filter.by.severity')}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1">
          <label htmlFor="score-filter" className="block mb-1">
            {i10nWithFallback('filter.by.score')}: {insightScoreFilter}%
          </label>
          <Slider 
            id="score-filter"
            value={insightScoreFilter} 
            onChange={(e) => setInsightScoreFilter(e.value as number)} 
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

export default InsightFilters;