import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbMenu from "../../components/breadcrumb/breadcrumb-menu.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import YearMonthComponent from "../../components/layout/dropdown/year-month.component";
import DateRangeService from "../../service/date-range.service";
import { Card } from "primereact/card";
import { TabView, TabPanel } from "primereact/tabview";
import { i10n } from "../../config/prime-locale";
import StatisticalRepository from "../../core/repositories/statistical-repository";
import { SpendingInsight, SpendingPattern } from "../../types/types";

// Import extracted components
import LoadingComponent from "../../components/reports/insights/LoadingComponent";
import SummarySection from "../../components/reports/insights/SummarySection";
import InsightFilters from "../../components/reports/insights/InsightFilters";
import PatternFilters from "../../components/reports/insights/PatternFilters";
import InsightCard from "../../components/reports/insights/InsightCard";
import PatternCard from "../../components/reports/insights/PatternCard";
import { i10nWithFallback } from "../../components/reports/insights/utils";

function SpendingInsightsPage() {
  const [range, _] = useState(DateRangeService.currentYear())
  const { year = range.year(), month = range.month() } = useParams()
  const navigate = useNavigate()
  const [insights, setInsights] = useState<SpendingInsight[]>([])
  const [patterns, setPatterns] = useState<SpendingPattern[]>([])
  const [loading, setLoading] = useState(true)

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [insightTypeFilter, setInsightTypeFilter] = useState<string | null>(null)
  const [insightSeverityFilter, setInsightSeverityFilter] = useState<string | null>(null)
  const [insightScoreFilter, setInsightScoreFilter] = useState<number>(0)
  const [patternTypeFilter, setPatternTypeFilter] = useState<string | null>(null)
  const [patternConfidenceFilter, setPatternConfidenceFilter] = useState<number>(0)

  // Filtered data
  const [filteredInsights, setFilteredInsights] = useState<SpendingInsight[]>([])
  const [filteredPatterns, setFilteredPatterns] = useState<SpendingPattern[]>([])

  const parsedYear = parseInt(year as string)
  const parsedMonth = parseInt(month as string)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      StatisticalRepository.insights(parsedYear, parsedMonth),
      StatisticalRepository.patterns(parsedYear, parsedMonth)
    ]).then(([insightsData, patternsData]) => {
      setInsights(insightsData)
      setPatterns(patternsData)
      setLoading(false)
    }).catch(error => {
      console.error("Error fetching spending data:", error)
      setLoading(false)
    })
  }, [parsedYear, parsedMonth])

  // Filter insights based on search term and filters
  useEffect(() => {
    const filtered = insights.filter(insight => {
      // Text search (case insensitive)
      const matchesSearch = searchTerm === "" || 
        insight.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insight.message.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType = insightTypeFilter === null || insight.type === insightTypeFilter;

      // Severity filter
      const matchesSeverity = insightSeverityFilter === null || insight.severity === insightSeverityFilter;

      // Score filter
      const matchesScore = insight.score * 100 >= insightScoreFilter;

      return matchesSearch && matchesType && matchesSeverity && matchesScore;
    });

    setFilteredInsights(filtered);
  }, [insights, searchTerm, insightTypeFilter, insightSeverityFilter, insightScoreFilter]);

  // Filter patterns based on search term and filters
  useEffect(() => {
    const filtered = patterns.filter(pattern => {
      // Text search (case insensitive)
      const matchesSearch = searchTerm === "" || 
        pattern.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType = patternTypeFilter === null || pattern.type === patternTypeFilter;

      // Confidence filter
      const matchesConfidence = pattern.confidence * 100 >= patternConfidenceFilter;

      return matchesSearch && matchesType && matchesConfidence;
    });

    setFilteredPatterns(filtered);
  }, [patterns, searchTerm, patternTypeFilter, patternConfidenceFilter]);

  const onDateChanged = ({ year = parsedYear, month = parsedMonth }) => {
    navigate(`/reports/spending-insight/${ year }/${ month }`)
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setInsightTypeFilter(null);
    setInsightSeverityFilter(null);
    setInsightScoreFilter(0);
    setPatternTypeFilter(null);
    setPatternConfidenceFilter(0);
  }

  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.title.reports.default'/>
      <BreadCrumbItem label='page.reports.insights.title'/>
      <BreadCrumbMenu>
        <div className='inline-flex'>
          <YearMonthComponent
            selected={ { year: parsedYear, month: parsedMonth } }
            onChange={ ({ year, month }) => onDateChanged({ year, month }) }/>
        </div>
      </BreadCrumbMenu>
    </BreadCrumbs>

    <div className='px-2 flex flex-col gap-2 mt-4'>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <Card title={i10n('page.reports.insights.title')}>
            <p className="mb-4">{i10n('page.reports.insights.description')}</p>
            <SummarySection insights={insights} patterns={patterns} />
          </Card>

          {/* TabView for both mobile and desktop */}
          <div>
            <TabView className="mt-4">
              <TabPanel header={i10n('page.reports.insights.insights')}>
                <div className="p-3">
                  {/* Search and filter panel for insights */}
                  <InsightFilters 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    insightTypeFilter={insightTypeFilter}
                    setInsightTypeFilter={setInsightTypeFilter}
                    insightSeverityFilter={insightSeverityFilter}
                    setInsightSeverityFilter={setInsightSeverityFilter}
                    insightScoreFilter={insightScoreFilter}
                    setInsightScoreFilter={setInsightScoreFilter}
                    resetFilters={resetFilters}
                  />

                  {filteredInsights.length === 0 ? (
                    <p className="text-center py-4 text-gray-500">
                      {insights.length === 0 
                        ? i10n('page.reports.insights.no_insights') 
                        : i10nWithFallback('page.reports.insights.no_matching_insights')}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {filteredInsights.map((insight, index) => (
                        <InsightCard key={index} insight={insight} />
                      ))}
                    </div>
                  )}
                </div>
              </TabPanel>
              <TabPanel header={i10n('page.reports.insights.patterns')}>
                <div className="p-3">
                  {/* Search and filter panel for patterns */}
                  <PatternFilters 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    patternTypeFilter={patternTypeFilter}
                    setPatternTypeFilter={setPatternTypeFilter}
                    patternConfidenceFilter={patternConfidenceFilter}
                    setPatternConfidenceFilter={setPatternConfidenceFilter}
                    resetFilters={resetFilters}
                  />

                  {filteredPatterns.length === 0 ? (
                    <p className="text-center py-4 text-gray-500">
                      {patterns.length === 0 
                        ? i10n('page.reports.insights.no_patterns') 
                        : i10nWithFallback('page.reports.insights.no_matching_patterns')}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {filteredPatterns.map((pattern, index) => (
                        <PatternCard key={index} pattern={pattern} />
                      ))}
                    </div>
                  )}
                </div>
              </TabPanel>
            </TabView>
          </div>
        </>
      )}
    </div>
  </>
}

export default SpendingInsightsPage;