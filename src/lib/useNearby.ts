import { useEffect, useMemo, useState } from 'react';
import type { Amenity, Property } from '../types';
import { fetchNearbyAmenities, toAmenities } from './overpass';
import { snapshotElements } from '../data/poiSnapshot';

type Status = 'loading' | 'ready' | 'error';

export const useNearby = (p: Property) => {
  const [lat, lng] = p.coords;
  const ready = useMemo(() => {
    if (p.storedAmenities) return p.storedAmenities;
    const el = p.source === 'demo' ? snapshotElements(p.id) : null;
    return el ? toAmenities([lat, lng], el) : null;
  }, [p.id, p.source, p.storedAmenities, lat, lng]);

  const [attempt, setAttempt] = useState(0);
  const [live, setLive] = useState<{ status: Status; amenities: Amenity[] }>({ status: 'loading', amenities: [] });

  useEffect(() => {
    if (ready) return;
    let on = true;
    setLive({ status: 'loading', amenities: [] });
    fetchNearbyAmenities([lat, lng])
      .then((amenities) => on && setLive({ status: 'ready', amenities }))
      .catch(() => on && setLive({ status: 'error', amenities: [] }));
    return () => { on = false; };
  }, [ready, lat, lng, attempt]);

  const retry = () => setAttempt((n) => n + 1);
  return ready ? { status: 'ready' as Status, amenities: ready, retry } : { ...live, retry };
};
