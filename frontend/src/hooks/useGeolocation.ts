import { useEffect, useState } from 'react';

export interface GeoState {
  lat?: number;
  lng?: number;
  error?: string;
  loading: boolean;
}

export function useGeolocation(enabled = true): GeoState {
  const [state, setState] = useState<GeoState>({ loading: enabled });

  useEffect(() => {
    if (!enabled) return;
    if (!('geolocation' in navigator)) {
      setState({ loading: false, error: 'Geolocation not supported' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setState({
          loading: false,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => setState({ loading: false, error: err.message }),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, [enabled]);

  return state;
}
