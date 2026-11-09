import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Heart, Map as MapIcon, MapPin } from 'lucide-react-native';
import SmartImage from './SmartImage';
import { campusById } from '../data/properties';
import { brl, km } from '../data/content';
import type { Property } from '../types';
import { C, shadow } from '../theme';

interface Props { property: Property; favorite: boolean; onToggleFavorite: () => void; onOpen: () => void }

export default function PropertyCard({ property: p, favorite, onToggleFavorite, onOpen }: Props) {
  const campus = campusById(p.campusId);
  return (
    <Pressable onPress={onOpen} style={({ pressed }) => [s.card, pressed && { opacity: 0.92 }]} accessibilityRole="button" accessibilityLabel={p.title}>
      <View>
        <SmartImage src={p.image} style={s.img} />
        <View style={s.tag}><Text style={s.tagText}>{p.tag}</Text></View>
        <Pressable onPress={onToggleFavorite} hitSlop={10} style={s.fav} accessibilityLabel={favorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}>
          <Heart size={18} color={favorite ? C.red : C.mute} fill={favorite ? C.red : 'none'} />
        </Pressable>
      </View>
      <View style={{ padding: 18 }}>
        <Text style={s.type}>{p.type}</Text>
        <Text style={s.title}>{p.title}</Text>
        <View style={s.loc}>
          <MapPin size={16} color={C.amber} style={{ marginTop: 2 }} />
          <Text style={s.locText}><Text style={{ fontWeight: '700', color: C.navy }}>{p.neighborhood}</Text> · {km(p.distanceKm)} da {campus?.label}</Text>
        </View>
        <View style={s.priceBox}>
          <Text><Text style={s.price}>{brl(p.price)}</Text><Text style={s.per}> / mês</Text></Text>
          <Text style={s.bills}>{p.estimatedBills > 0 ? `+ ${brl(p.estimatedBills)} estimados em contas` : 'Contas inclusas (confirme com o anunciante)'}</Text>
          <View style={s.btn}><MapIcon size={16} color={C.navy} /><Text style={s.btnText}>Ver detalhes e mapa</Text></View>
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: C.white, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: C.line, ...shadow },
  img: { height: 200, width: '100%' },
  tag: { position: 'absolute', top: 14, left: 14, backgroundColor: '#fffffff2', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99 },
  tagText: { fontSize: 12, fontWeight: '700', color: C.navy },
  fav: { position: 'absolute', top: 14, right: 14, backgroundColor: C.white, padding: 9, borderRadius: 99 },
  type: { fontSize: 12, fontWeight: '500', color: '#64748b', marginBottom: 4 },
  title: { fontSize: 19, fontWeight: '700', color: C.navy, marginBottom: 10 },
  loc: { flexDirection: 'row', gap: 6, marginBottom: 14 },
  locText: { flex: 1, fontSize: 14, color: C.text },
  priceBox: { borderTopWidth: 1, borderTopColor: C.soft, paddingTop: 14 },
  price: { fontSize: 24, fontWeight: '700', color: C.navy },
  per: { fontSize: 14, color: '#64748b' },
  bills: { fontSize: 12, color: C.mute, marginTop: 2 },
  btn: { marginTop: 14, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingVertical: 11 },
  btnText: { fontWeight: '600', fontSize: 14, color: C.navy },
});
