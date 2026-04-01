export type ServiceMode = 'Online' | 'Portal' | 'Assisted';

export type ServiceAction = 'Apply' | 'Track' | 'Download' | 'Receipt';

export interface Category {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  icon: string;
  description: string;
  serviceCount: number;
}

export interface Department {
  id: string;
  name: string;
  categoryIds: string[];
  description: string;
}

export interface ServiceGroup {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  departmentIds: string[];
  icon: string;
}

export interface ServiceItem {
  id: string;
  serviceName: string;
  shortDescription: string;
  categoryId: string;
  groupId: string;
  departmentId: string;
  mode: ServiceMode;
  samagraEnabled: boolean;
  actionsAvailable: ServiceAction[];
  isTrackAvailable: boolean;
  isDownloadAvailable: boolean;
  eligibilityPoints: string[];
  requiredDocuments: string[];
  processSteps: string[];
  timeline: string;
  helpContact: string;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: ServiceAction;
}

export interface ApplicationSummary {
  totalSubmitted: number;
  pending: number;
  approved: number;
  rejected: number;
  readyForDownload: number;
}

export interface EligibilityState {
  isMockLoggedIn: boolean;
  citizenName: string;
  samagraId: string;
  eligibleSchemeCount: number;
}

export interface ServiceFilters {
  categoryId?: string;
  departmentId?: string;
  groupId?: string;
  searchQuery?: string;
  mode?: ServiceMode;
  samagraEnabled?: boolean;
  action?: ServiceAction;
}

export interface SearchResults {
  services: ServiceItem[];
  categories: Category[];
  departments: Department[];
}

