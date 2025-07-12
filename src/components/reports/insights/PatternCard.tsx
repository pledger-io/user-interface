import React from "react";
import { Badge } from "primereact/badge";
import { SpendingPattern } from "../../../types/types";
import DateComponent from "../../../components/format/date.component";
import { i10n } from "../../../config/prime-locale";
import { getPatternTypeLabel } from "./utils";

interface PatternCardProps {
  pattern: SpendingPattern;
}

/**
 * Component for displaying a single pattern card
 */
const PatternCard: React.FC<PatternCardProps> = ({ pattern }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <Badge 
          value={getPatternTypeLabel(pattern.type)} 
          className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full" 
        />
        <span className="text-sm text-gray-500">
          <DateComponent date={pattern.detectedDate} />
        </span>
      </div>
      <h3 className="font-medium text-lg mb-2">{pattern.category}</h3>
      <div className="mt-2 flex items-center">
        <span className="text-sm text-gray-500 mr-2">{i10n('pattern.confidence')}:</span>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-green-600 h-2.5 rounded-full" 
            style={{ width: `${pattern.confidence * 100}%` }}
          ></div>
        </div>
        <span className="ml-2 text-sm font-medium">{Math.round(pattern.confidence * 100)}%</span>
      </div>

      {/* Metadata section */}
      {pattern.metadata && Object.keys(pattern.metadata).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">{i10n('pattern.metadata') || 'Metadata'}</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(pattern.metadata).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-xs text-gray-500">{i10n('pattern.metadata.' + key)}</span>
                <span className="text-sm">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatternCard;
