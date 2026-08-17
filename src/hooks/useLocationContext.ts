export type LocationStatus =
  | 'idle'
  | 'loading'
  | 'granted'
  | 'denied'
  | 'error'
  | 'unsupported';

export interface LocationContextValue {
  status: LocationStatus;
  regionLabel: string;
  locationCopy: string;
}

export function getLocationCopy(_status?: LocationStatus, region = '의정부시'): string {
  return `현재 위치 기준 · ${region}`;
}

export function useLocationContext(): LocationContextValue {
  const regionLabel = '의정부시';
  const status: LocationStatus = 'idle';

  return {
    status,
    regionLabel,
    locationCopy: getLocationCopy(status, regionLabel),
  };
}
