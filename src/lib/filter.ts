import type { Property } from '../types';
import { campusById } from '../data/properties';
import { Filters, Kind, brl } from '../data/content';

const KIND_MATCH: Record<Kind, (p: Property) => boolean> = {
  'Quarto individual': (p) => p.tag === 'Quarto individual',
  'Quarto compartilhado': (p) => /compartilhado/i.test(p.type),
  'República': (p) => p.tag === 'Quarto em república',
  'Studio': (p) => p.tag === 'Kitnet / Studio',
  'Apartamento': (p) => p.tag === 'Apartamento',
};

const isFurnished = (p: Property) => p.features.some((f) => /mobiliad/i.test(f)) || /mobiliad/i.test(p.type);
const acceptsPets = (p: Property) => p.features.some((f) => /pets/i.test(f)) || p.houseRoutine?.pets === true;

export const matchesFilters = (p: Property, f: Filters): boolean => {
  const campus = campusById(p.campusId);
  if (f.city !== 'all' && campus?.city !== f.city) return false;
  if (f.campusId !== 'all' && p.campusId !== f.campusId) return false;
  if (f.minBudget !== null && p.price < f.minBudget) return false;
  if (f.maxBudget !== null && p.price > f.maxBudget) return false;
  if (f.maxDistance !== null && p.distanceKm > f.maxDistance) return false;
  if (f.kind !== 'any' && !KIND_MATCH[f.kind](p)) return false;
  if (f.furnished && !isFurnished(p)) return false;
  if (f.billsIncluded && p.estimatedBills > 0) return false;
  if (f.pets && !acceptsPets(p)) return false;
  return true;
};

export const budgetLabel = (f: Pick<Filters, 'minBudget' | 'maxBudget'>) =>
  f.minBudget !== null && f.maxBudget !== null ? `${brl(f.minBudget)} a ${brl(f.maxBudget)}`
  : f.maxBudget !== null ? `até ${brl(f.maxBudget)}`
  : f.minBudget !== null ? `a partir de ${brl(f.minBudget)}`
  : 'Sem limite';

export const summaryOf = (f: Filters): string[] => [
  f.campusId !== 'all' ? campusById(f.campusId)?.label : f.city !== 'all' ? f.city : null,
  f.minBudget !== null || f.maxBudget !== null ? budgetLabel(f) : null,
  f.maxDistance !== null ? `até ${f.maxDistance} km` : null,
  f.moveDate ? `mudança em ${f.moveDate.slice(5)}/${f.moveDate.slice(0, 4)}` : null,
  f.kind !== 'any' ? f.kind : null,
  f.furnished ? 'Mobiliado' : null,
  f.billsIncluded ? 'Contas incluídas' : null,
  f.pets ? 'Aceita pets' : null,
].filter(Boolean) as string[];
