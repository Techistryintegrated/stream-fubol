import { BetaAnalyticsDataClient } from '@google-analytics/data';

const PROPERTY_ID = process.env.GA_PROPERTY_ID; // e.g., 123456789
const KEY_FILE =
  process.env.GA_CREDENTIALS_PATH ||
  'config/regal-yew-464802-e2-1cd7c7715756.json';

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFile: KEY_FILE,
});

export async function getGA4AvgWatchTime(): Promise<number | null> {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    metrics: [{ name: 'averageSessionDuration' }],
    dimensions: [{ name: 'pagePath' }],
    dimensionFilter: {
      filter: {
        fieldName: 'pagePath',
        stringFilter: { value: '/stream', matchType: 'BEGINS_WITH' },
      },
    },
  });
  if (response.rows && response.rows.length > 0) {
    const avgSec = Number(response.rows[0].metricValues?.[0]?.value ?? 0);
    return Math.round(avgSec / 60); // in minutes
  }
  return null;
}

export async function getGA4ActiveStreams(): Promise<number | null> {
  const [response] = await analyticsDataClient.runRealtimeReport({
    property: `properties/${PROPERTY_ID}`,
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'activeUsers' }],
    dimensionFilter: {
      filter: {
        fieldName: 'pagePath',
        stringFilter: { value: '/stream', matchType: 'BEGINS_WITH' },
      },
    },
  });
  if (response.rows && response.rows.length > 0) {
    return Number(response.rows[0].metricValues?.[0]?.value ?? 0);
  }
  return null;
}
