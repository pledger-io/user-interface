import { i10n } from "../../../config/prime-locale";

/**
 * Get the CSS class for a severity level
 */
export const getSeverityClass = (severity: string) => {
  switch (severity) {
    case 'ALERT': return 'bg-red-100 text-red-800'
    case 'WARNING': return 'bg-yellow-100 text-yellow-800'
    case 'INFO': default: return 'bg-blue-100 text-blue-800'
  }
}

/**
 * Get a human-readable label for an insight type
 */
export const getInsightTypeLabel = (type: string) => {
  switch (type) {
    case 'UNUSUAL_AMOUNT': return i10n('insight.type.unusual_amount')
    case 'UNUSUAL_FREQUENCY': return i10n('insight.type.unusual_frequency')
    case 'UNUSUAL_MERCHANT': return i10n('insight.type.unusual_merchant')
    case 'UNUSUAL_TIMING': return i10n('insight.type.unusual_timing')
    case 'POTENTIAL_DUPLICATE': return i10n('insight.type.potential_duplicate')
    case 'BUDGET_EXCEEDED': return i10n('insight.type.budget_exceeded')
    case 'SPENDING_SPIKE': return i10n('insight.type.spending_spike')
    case 'UNUSUAL_LOCATION': return i10n('insight.type.unusual_location')
    default: return type
  }
}

/**
 * Get a human-readable label for a pattern type
 */
export const getPatternTypeLabel = (type: string) => {
  switch (type) {
    case 'RECURRING_MONTHLY': return i10n('pattern.type.recurring_monthly')
    case 'RECURRING_WEEKLY': return i10n('pattern.type.recurring_weekly')
    case 'SEASONAL': return i10n('pattern.type.seasonal')
    case 'INCREASING_TREND': return i10n('pattern.type.increasing_trend')
    case 'DECREASING_TREND': return i10n('pattern.type.decreasing_trend')
    default: return type
  }
}

/**
 * Get insight type options for dropdown
 */
export const getInsightTypeOptions = () => {
  const types = ['UNUSUAL_AMOUNT', 'UNUSUAL_FREQUENCY', 'UNUSUAL_MERCHANT', 'UNUSUAL_TIMING', 
                'POTENTIAL_DUPLICATE', 'BUDGET_EXCEEDED', 'SPENDING_SPIKE', 'UNUSUAL_LOCATION'];
  return types.map(type => ({
    label: getInsightTypeLabel(type),
    value: type
  }));
}

/**
 * Get pattern type options for dropdown
 */
export const getPatternTypeOptions = () => {
  const types = ['RECURRING_MONTHLY', 'RECURRING_WEEKLY', 'SEASONAL', 'INCREASING_TREND', 'DECREASING_TREND'];
  return types.map(type => ({
    label: getPatternTypeLabel(type),
    value: type
  }));
}

/**
 * Get severity options for dropdown
 */
export const getSeverityOptions = () => {
  return [
    { label: i10n('severity.alert'), value: 'ALERT' },
    { label: i10n('severity.warning'), value: 'WARNING' },
    { label: i10n('severity.info'), value: 'INFO' }
  ];
}

/**
 * Fallback translations for new filter-related text
 */
export const i10nWithFallback = (key: string) => {
  const fallbacks: Record<string, string> = {
    'search': 'Search',
    'filter.by.type': 'Filter by type',
    'filter.by.severity': 'Filter by severity',
    'filter.by.score': 'Minimum score',
    'filter.by.confidence': 'Minimum confidence',
    'reset.filters': 'Reset filters',
    'page.reports.insights.no_matching_insights': 'No insights match your filters',
    'page.reports.insights.no_matching_patterns': 'No patterns match your filters',
    'severity.alert': 'Alert',
    'severity.warning': 'Warning',
    'severity.info': 'Info'
  };

  const translation = i10n(key);
  // If the translation is the same as the key, it means it's not translated
  return translation === key ? fallbacks[key] || key : translation;
}