export type PaidFeatureType = 'bank-sync' | 'csv-upload' | 'chart-types';

interface PaidFeature {
  label: string;
  feature: PaidFeatureType;
}

export const PaidFeatures: PaidFeature[] = [
  { label: 'Bank syncing', feature: 'bank-sync' },
  { label: 'CSV upload', feature: 'csv-upload' },
  { label: 'Different chart types', feature: 'chart-types' },
]