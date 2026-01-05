// Centralized exports for all config
export {
  EHR_RESOURCES,
  getResourcesForEhr,
  formatResourceOption,
  getAllDocumentTypes,
  getDocumentTypesForEhr,
  getAllEhrDocumentTypeCombinations,
  getAllEhrNames
} from './ehrResources';

export { getDependenciesForDocumentType } from './resourceDependencies';

export { resourceSections } from './resourceSections';
export { templateHierarchy } from './templateHierarchy';
