import React from "react";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { ProgressBar } from "primereact/progressbar";
import { i10n } from "../../../config/prime-locale";

/**
 * Component that displays a loading state for the insights page
 */
const LoadingComponent: React.FC = () => {
  return (
    <div className="mt-4">
      <Card title={i10n('page.reports.insights.title')}>
        <div className="flex items-center justify-center p-6">
          <div className="text-center">
            <ProgressBar mode="indeterminate" style={{ height: '6px' }} className="mb-3 w-64" />
            <p className="text-gray-600">{i10n('loading.data')}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="col-span-1">
          <Panel header={i10n('page.reports.insights.insights')}>
            <div className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-24 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
          </Panel>
        </div>
        <div className="col-span-1">
          <Panel header={i10n('page.reports.insights.patterns')}>
            <div className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-24 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;