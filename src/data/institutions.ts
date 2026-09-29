export const institutions = [
  { id: 'ug', name: 'University of Ghana', region: 'Greater Accra' },
  { id: 'upsa', name: 'UPSA', region: 'Greater Accra' },
  { id: 'gimpa', name: 'GIMPA', region: 'Greater Accra' },
  { id: 'atu', name: 'Accra Technical University', region: 'Greater Accra' },
  { id: 'central', name: 'Central University', region: 'Greater Accra' },
  { id: 'valley-view', name: 'Valley View', region: 'Greater Accra' },
  { id: 'knust', name: 'KNUST', region: 'Ashanti' },
  { id: 'ktu-kumasi', name: 'Kumasi Technical University', region: 'Ashanti' },
  { id: 'ucc', name: 'University of Cape Coast', region: 'Central' },
  { id: 'uew', name: 'UEW', region: 'Central' },
  { id: 'cctu', name: 'Cape Coast Technical University', region: 'Central' },
  { id: 'ashesi', name: 'Ashesi University', region: 'Eastern' },
  { id: 'ktu-koforidua', name: 'Koforidua Technical University', region: 'Eastern' },
  { id: 'ttu', name: 'Takoradi Technical University', region: 'Western' },
  { id: 'umat', name: 'UMaT', region: 'Western' },
  { id: 'htu', name: 'Ho Technical University', region: 'Volta' },
  { id: 'uhas', name: 'UHAS', region: 'Volta' },
  { id: 'uds', name: 'UDS', region: 'Northern' },
  { id: 'tatu', name: 'Tamale Technical University', region: 'Northern' },
  { id: 'uenr', name: 'UENR', region: 'Bono' },
  { id: 'stu', name: 'Sunyani Technical University', region: 'Bono' },
  { id: 'bolgatu', name: 'Bolgatanga Technical University', region: 'Upper East' },
] as const;

export const regions = [...new Set(institutions.map((institution) => institution.region))];
export function institutionName(id: string) {
  return institutions.find((institution) => institution.id === id)?.name ?? id;
}
