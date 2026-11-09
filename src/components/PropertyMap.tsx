import { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { GraduationCap, Home } from 'lucide-react-native';
import type { Amenity, AmenityType, Campus, Property } from '../types';
import { boundsCenteredOn, formatDistance, midpoint, walkingMinutes } from '../lib/geo';
import { AMENITY_META, AMENITY_ORDER } from './amenityMeta';
import { C } from '../theme';

const Pin = ({ color, size = 34, children }: { color: string; size?: number; children: React.ReactNode }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, borderWidth: 2.5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </View>
);

interface Props { property: Property; campus?: Campus; amenities: Amenity[]; loading: boolean }

export default function PropertyMap({ property, campus, amenities, loading }: Props) {
  const ref = useRef<MapView>(null);
  const [hidden, setHidden] = useState<Set<AmenityType>>(new Set());
  const toggle = (t: AmenityType) => setHidden((p) => { const n = new Set(p); n.has(t) ? n.delete(t) : n.add(t); return n; });

  const points = useMemo(() => boundsCenteredOn(property.coords,
    [...(campus ? [campus.coords] : []), ...amenities.map((a) => a.coords)]).map(([latitude, longitude]) => ({ latitude, longitude })),
    [property, campus, amenities]);
  const fit = () => ref.current?.fitToCoordinates(points, { edgePadding: { top: 60, right: 50, bottom: 50, left: 50 }, animated: false });
  const present = AMENITY_ORDER.filter((t) => amenities.some((a) => a.type === t));
  const [lat, lng] = property.coords;
  const mid = campus ? midpoint(property.coords, campus.coords) : null;

  return (
    <View>
      <View style={s.mapBox}>
        <MapView ref={ref} style={StyleSheet.absoluteFill} initialRegion={{ latitude: lat, longitude: lng, latitudeDelta: 0.02, longitudeDelta: 0.02 }} onMapReady={fit} key={points.length}>
          {campus && (
            <>
              <Polyline coordinates={[{ latitude: lat, longitude: lng }, { latitude: campus.coords[0], longitude: campus.coords[1] }]} strokeColor={C.navy} strokeWidth={3} lineDashPattern={[8, 8]} />
              <Marker coordinate={{ latitude: campus.coords[0], longitude: campus.coords[1] }} title={campus.label} description={`${formatDistance(property.distanceKm)} · ~${walkingMinutes(property.distanceKm)} min a pé`}>
                <Pin color={C.amber}><GraduationCap size={17} color="#fff" /></Pin>
              </Marker>
              {mid && (
                <Marker coordinate={{ latitude: mid[0], longitude: mid[1] }} tracksViewChanges={false}>
                  <View style={s.dist}><Text style={s.distText}>{formatDistance(property.distanceKm)}</Text></View>
                </Marker>
              )}
            </>
          )}
          {amenities.filter((a) => !hidden.has(a.type)).map((a) => {
            const { Icon, color, label } = AMENITY_META[a.type];
            return (
              <Marker key={a.osmUrl ?? `${a.type}-${a.name}`} coordinate={{ latitude: a.coords[0], longitude: a.coords[1] }} title={a.name}
                description={`${label} · ${formatDistance(a.distanceKm)} · ~${walkingMinutes(a.distanceKm)} min a pé`}>
                <Pin color={color} size={28}><Icon size={14} color="#fff" /></Pin>
              </Marker>
            );
          })}
          <Marker coordinate={{ latitude: lat, longitude: lng }} title={property.title} description={property.neighborhood}>
            <Pin color={C.navy} size={42}><Home size={20} color="#fff" /></Pin>
          </Marker>
        </MapView>
        {loading && <View style={s.loading}><Text style={{ fontSize: 12, color: C.text }}>Buscando pontos por perto…</Text></View>}
      </View>
      <View style={s.legend}>
        {present.map((t) => {
          const { Icon, color, label } = AMENITY_META[t];
          const off = hidden.has(t);
          return (
            <Pressable key={t} onPress={() => toggle(t)} style={[s.chip, { backgroundColor: off ? C.soft : color + '22', opacity: off ? 0.6 : 1 }]}>
              <Icon size={14} color={off ? C.mute : color} />
              <Text style={{ fontSize: 12, fontWeight: '600', color: off ? C.mute : color }}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  mapBox: { height: 340, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: C.line },
  dist: { backgroundColor: C.navy, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, borderWidth: 2, borderColor: '#fff' },
  distText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  loading: { position: 'absolute', bottom: 10, alignSelf: 'center', backgroundColor: '#fffffff2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 99 },
});
