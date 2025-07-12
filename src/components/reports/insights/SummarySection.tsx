import React from "react";
import { SpendingInsight, SpendingPattern } from "../../../types/types";
import { i10n } from "../../../config/prime-locale";
import { getSeverityClass } from "./utils";

interface SummarySectionProps {
  insights: SpendingInsight[];
  patterns: SpendingPattern[];
}

/**
 * Component that displays a summary of insights and patterns
 */
const SummarySection: React.FC<SummarySectionProps> = ({ insights, patterns }) => {
  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">{i10n('page.reports.insights.insights')} ({insights.length})</h3>
          {insights.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {['ALERT', 'WARNING', 'INFO'].map(severity => {
                const count = insights.filter(i => i.severity === severity).length;
                if (count === 0) return null;
                return (
                  <div key={severity} className={`${getSeverityClass(severity)} px-3 py-1 rounded-full text-sm flex items-center`}>
                    <span>{severity.charAt(0) + severity.slice(1).toLowerCase()}</span>
                    <span className="ml-1 font-bold">{count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">{i10n('page.reports.insights.no_insights')}</p>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">{i10n('page.reports.insights.patterns')} ({patterns.length})</h3>
          {patterns.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {['RECURRING_MONTHLY', 'RECURRING_WEEKLY', 'SEASONAL', 'INCREASING_TREND', 'DECREASING_TREND'].map(type => {
                const count = patterns.filter(p => p.type === type).length;
                if (count === 0) return null;
                return (
                  <div key={type} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                    <span>{type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}</span>
                    <span className="ml-1 font-bold">{count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">{i10n('page.reports.insights.no_patterns')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummarySection;