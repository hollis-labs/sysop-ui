/**
 * Widget + chart layer — generic, accessor-driven dashboard primitives.
 * No domain vocabulary lives here; the caller supplies item types + accessors.
 */
export {
  TimeSeriesChart,
  type TimeSeriesChartProps,
  type TimeSeriesSeries,
} from './time-series-chart'
export { DonutChart, type DonutChartProps, type DonutSegment } from './donut-chart'
export { BarMeter, type BarMeterProps, type BarMeterRow } from './bar-meter'
export { ActivityHeatmap, type ActivityHeatmapProps } from './activity-heatmap'
export { HourlyPulse, type HourlyPulseProps } from './hourly-pulse'
export { RecentList, type RecentListProps } from './recent-list'
