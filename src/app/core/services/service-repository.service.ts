import { Injectable } from '@angular/core';

import {
  CATEGORIES,
  DEFAULT_APPLICATION_SUMMARY,
  DEFAULT_ELIGIBILITY_STATE,
  DEPARTMENTS,
  GROUPS,
  HOME_BANNERS,
  QUICK_ACTIONS,
  SERVICES,
} from '../data/mock-data';
import {
  ApplicationSummary,
  BannerItem,
  Category,
  Department,
  EligibilityState,
  QuickAction,
  SearchResults,
  ServiceAction,
  ServiceFilters,
  ServiceGroup,
  ServiceItem,
} from '../models/service.models';

@Injectable({ providedIn: 'root' })
export class ServiceRepositoryService {
  getCategories(): Category[] {
    return CATEGORIES;
  }

  getDepartments(): Department[] {
    return DEPARTMENTS;
  }

  getGroups(): ServiceGroup[] {
    return GROUPS;
  }

  getServicesRaw(): ServiceItem[] {
    return SERVICES;
  }

  getQuickActions(): QuickAction[] {
    return QUICK_ACTIONS;
  }

  getHomeBanners(): BannerItem[] {
    return HOME_BANNERS;
  }

  getDefaultApplicationSummary(): ApplicationSummary {
    return DEFAULT_APPLICATION_SUMMARY;
  }

  getDefaultEligibilityState(): EligibilityState {
    return DEFAULT_ELIGIBILITY_STATE;
  }

  getCategoryById(id: string | null | undefined): Category | undefined {
    if (!id) {
      return undefined;
    }

    return CATEGORIES.find((category) => category.id === id);
  }

  getDepartmentById(id: string | null | undefined): Department | undefined {
    if (!id) {
      return undefined;
    }

    return DEPARTMENTS.find((department) => department.id === id);
  }

  getGroupById(id: string | null | undefined): ServiceGroup | undefined {
    if (!id) {
      return undefined;
    }

    return GROUPS.find((group) => group.id === id);
  }

  getServiceById(id: string | null | undefined): ServiceItem | undefined {
    if (!id) {
      return undefined;
    }

    return SERVICES.find((service) => service.id === id);
  }

  getGroupsByCategory(categoryId: string): ServiceGroup[] {
    return GROUPS.filter((group) => group.categoryId === categoryId);
  }

  getGroupsByDepartment(departmentId: string): ServiceGroup[] {
    return GROUPS.filter((group) => group.departmentIds.includes(departmentId));
  }

  getDepartmentsForCategory(categoryId: string): Department[] {
    const departmentIds = new Set(
      GROUPS.filter((group) => group.categoryId === categoryId).flatMap((group) => group.departmentIds),
    );

    return DEPARTMENTS.filter((department) => departmentIds.has(department.id));
  }

  getCategoriesForDepartment(departmentId: string): Category[] {
    const categoryIds = new Set(
      SERVICES.filter((service) => service.departmentId === departmentId).map((service) => service.categoryId),
    );

    return CATEGORIES.filter((category) => categoryIds.has(category.id));
  }

  getServices(filters: ServiceFilters = {}): ServiceItem[] {
    return SERVICES.filter((service) => {
      if (filters.categoryId && service.categoryId !== filters.categoryId) {
        return false;
      }

      if (filters.departmentId && service.departmentId !== filters.departmentId) {
        return false;
      }

      if (filters.groupId && service.groupId !== filters.groupId) {
        return false;
      }

      if (filters.mode && service.mode !== filters.mode) {
        return false;
      }

      if (typeof filters.samagraEnabled === 'boolean' && service.samagraEnabled !== filters.samagraEnabled) {
        return false;
      }

      if (filters.action && !service.actionsAvailable.includes(filters.action)) {
        return false;
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.trim().toLowerCase();
        const group = this.getGroupById(service.groupId);
        const department = this.getDepartmentById(service.departmentId);
        const category = this.getCategoryById(service.categoryId);

        const searchableValue = [
          service.serviceName,
          service.shortDescription,
          group?.name,
          department?.name,
          category?.nameHindi,
          category?.nameEnglish,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!searchableValue.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }

  searchAll(query: string): SearchResults {
    const sanitizedQuery = query.trim().toLowerCase();
    if (!sanitizedQuery) {
      return {
        services: [],
        categories: [],
        departments: [],
      };
    }

    return {
      services: SERVICES.filter((service) => {
        return `${service.serviceName} ${service.shortDescription}`.toLowerCase().includes(sanitizedQuery);
      }),
      categories: CATEGORIES.filter((category) => {
        return `${category.nameHindi} ${category.nameEnglish} ${category.description}`
          .toLowerCase()
          .includes(sanitizedQuery);
      }),
      departments: DEPARTMENTS.filter((department) => {
        return `${department.name} ${department.description}`.toLowerCase().includes(sanitizedQuery);
      }),
    };
  }

  getActionCountForContext(
    action: ServiceAction,
    context: { categoryId?: string; departmentId?: string; groupId?: string },
  ): number {
    return this.getServices({
      categoryId: context.categoryId,
      departmentId: context.departmentId,
      groupId: context.groupId,
      action,
    }).length;
  }
}

