import React from "react";
import { Badge } from "primereact/badge";
import { SpendingInsight } from "../../../types/types";
import DateComponent from "../../../components/format/date.component";
import { i10n } from "../../../config/prime-locale";
import { getSeverityClass, getInsightTypeLabel } from "./utils";

interface InsightCardProps {
  insight: SpendingInsight;
}

/**
 * Component for displaying a single insight card
 */
const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <Badge 
          value={getInsightTypeLabel(insight.type)} 
          className={`${getSeverityClass(insight.severity)} px-2 py-1 text-xs font-medium rounded-full`} 
        />
        <span className="text-sm text-gray-500">
          <DateComponent date={insight.detectedDate} />
        </span>
      </div>
      <h3 className="font-medium text-lg mb-2">{insight.category}</h3>
      <p className="text-gray-700 mb-3">{i10n(insight.message)}</p>
      <div className="mt-2 flex items-center">
        <span className="text-sm text-gray-500 mr-2">{i10n('insight.score')}:</span>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${Math.round(insight.score * 100)}%` }}
          ></div>
        </div>
        <span className="ml-2 text-sm font-medium">{Math.round(insight.score * 100)}%</span>
      </div>

      {/* Metadata section */}
      {insight.metadata && Object.keys(insight.metadata).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">{i10n('insight.metadata') || 'Metadata'}</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(insight.metadata).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-xs text-gray-500">{i10n('insight.metadata.' + key)}</span>
                <span className="text-sm">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightCard;
