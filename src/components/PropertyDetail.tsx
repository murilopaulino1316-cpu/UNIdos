import { ActivityIndicator, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Check, Cigarette, GraduationCap, Heart, MapPin, Moon, PartyPopper, PawPrint, Receipt, Sparkles, UserPlus, Users, X, ShieldAlert, RefreshCw } from 'lucide-react-native';
import type { ComponentType } from 'react';
import SmartImage from './SmartImage';
import PropertyMap from './PropertyMap';
import { AMENITY_META } from './amenityMeta';
import { ROUTINE_OPTIONS, VIBE_HINT } from '../data/houseRoutine';
import { brl } from '../data/content';
import { formatDistance, walkingMinutes } from '../lib/geo';
import { useNearby } from '../lib/useNearby';
import type { Campus, HouseRoutine, Property } from '../types';
import { C } from '../theme';

const VIBE_BG: Record<HouseRoutine['vibe'], [string, string]> = {
  tranquila: ['#ecfdf5', '#065f46'], equilibrada: [C.sky, C.navy], agitada: ['#fffbeb', '#92400e'],
};

const Item = ({ icon: Icon, label, value }: { icon: ComponentType<{ size?: number; color?: string }>; label: string; value: string }) => (
  <View style={s.item}>
    <View style={s.itemIcon}><Icon size={16} color={C.navy} /></View>
    <View style={{ flex: 1 }}>
      <Text style={s.itemLabel}>{label.toUpperCase()}</Text>
      <Text style={s.itemValue}>{value}</Text>
    </View>
  </View>
);

const Routine = ({ r }: { r: HouseRoutine }) => {
  const [bg, fg] = VIBE_BG[r.vibe];
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={s.h}>ROTINA DA CASA</Text>
      <View style={{ backgroundColor: bg, borderRadius: 12, padding: 14, marginBottom: 14 }}>
        <Text style={{ fontWeight: '700', color: fg, fontSize: 14 }}>
          Casa {ROUTINE_OPTIONS.vibe[r.vibe].toLowerCase()} · {r.residents} {r.residents === 1 ? 'morador' : 'moradores'} · {ROUTINE_OPTIONS.gender[r.gender].toLowerCase()}
        </Text>
        <Text style={{ color: fg, opacity: 0.8, fontSize: 12 }}>{VIBE_HINT[r.vibe]}</Text>
      </View>
      <View style={{ gap: 12 }}>
        <Item icon={Moon} label="Silêncio" value={r.quietHours.trim() || 'Sem horário combinado'} />
        <Item icon={BookOpen} label="Semana de provas" value={r.examWeekSilence ? 'Silêncio reforçado' : 'Rotina normal'} />
        <Item icon={PartyPopper} label="Festas" value={ROUTINE_OPTIONS.parties[r.parties]} />
        <Item icon={UserPlus} label="Visitas" value={ROUTINE_OPTIONS.visits[r.visits]} />
        <Item icon={Sparkles} label="Limpeza" value={ROUTINE_OPTIONS.cleaning[r.cleaning]} />
        <Item icon={Receipt} label="Contas" value={ROUTINE_OPTIONS.bills[r.bills]} />
        <Item icon={Cigarette} label="Fumar" value={ROUTINE_OPTIONS.smoking[r.smoking]} />
        <Item icon={PawPrint} label="Pets" value={r.pets ? 'Tem ou aceita' : 'Não'} />
      </View>
      {!!r.notes.trim() && (
        <View style={{ flexDirection: 'row', gap: 8, backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, marginTop: 12 }}>
          <Users size={16} color={C.mute} style={{ marginTop: 2 }} />
          <Text style={{ flex: 1, fontSize: 14, color: C.text }}>{r.notes}</Text>
        </View>
      )}
      <Text style={{ fontSize: 11, color: C.mute, marginTop: 8 }}>Informado pelo anunciante. Confirme na visita e converse com os moradores.</Text>
    </View>
  );
};

interface Props { property: Property; campus?: Campus; favorite: boolean; onToggleFavorite: () => void; onClose: () => void }

export default function PropertyDetail({ property: p, campus, favorite, onToggleFavorite, onClose }: Props) {
  const nearby = useNearby(p);
  const total = p.price + p.estimatedBills;
  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: C.white }} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View>
            <SmartImage src={p.image} style={{ height: 240 }} />
            <View style={s.tag}><Text style={s.tagText}>{p.tag}</Text></View>
            <Pressable onPress={onClose} style={s.close} hitSlop={8} accessibilityLabel="Fechar"><X size={20} color={C.navy} /></Pressable>
          </View>

          <View style={{ padding: 20 }}>
            <Text style={s.type}>{p.type}</Text>
            <Text style={s.title}>{p.title}</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
              <MapPin size={15} color={C.amber} />
              <Text style={{ fontSize: 13, color: C.text }}>{p.neighborhood}{campus ? ` · ${campus.city}` : ''}</Text>
            </View>
            <Text style={s.desc}>{p.description}</Text>

            <View style={s.chips}>
              {p.features.map((f) => (
                <View key={f} style={s.chip}><Check size={14} color={C.green} /><Text style={s.chipText}>{f}</Text></View>
              ))}
            </View>

            <View style={s.priceBox}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Text><Text style={s.price}>{brl(p.price)}</Text><Text style={{ color: '#64748b' }}> / mês</Text></Text>
                {p.estimatedBills > 0 && <Text style={{ fontSize: 13, color: C.text }}>Total estimado <Text style={{ fontWeight: '700', color: C.navy }}>{brl(total)}</Text></Text>}
              </View>
              <Text style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                {p.estimatedBills > 0 ? `+ ${brl(p.estimatedBills)} estimados em contas (luz, água, internet, gás).` : 'Contas inclusas (confirme com o anunciante).'}
              </Text>
            </View>

            {campus && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <View style={s.campusIcon}><GraduationCap size={20} color={C.amber} /></View>
                <Text style={{ flex: 1, fontSize: 14, color: C.text }}>
                  <Text style={{ fontWeight: '700', color: C.navy }}>{formatDistance(p.distanceKm)}</Text> da {campus.label}
                  <Text style={{ color: C.mute }}> · ~{walkingMinutes(p.distanceKm)} min a pé</Text>
                </Text>
              </View>
            )}

            {p.houseRoutine && <Routine r={p.houseRoutine} />}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={s.h}>NO ENTORNO</Text>
              <Text style={{ fontSize: 11, color: C.mute }}>Fonte: OpenStreetMap</Text>
            </View>
            {nearby.status === 'loading' && (
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                <ActivityIndicator color={C.mute} /><Text style={{ fontSize: 12, color: C.text }}>Buscando no OpenStreetMap… pode levar até 1 minuto.</Text>
              </View>
            )}
            {nearby.status === 'error' && (
              <Pressable onPress={nearby.retry} style={s.errorBox}>
                <Text style={{ flex: 1, fontSize: 13, color: C.text }}>O serviço de mapas está lento agora.</Text>
                <RefreshCw size={16} color={C.blue} /><Text style={{ color: C.blue, fontWeight: '600' }}>Tentar de novo</Text>
              </Pressable>
            )}
            {nearby.status === 'ready' && nearby.amenities.length === 0 && (
              <Text style={s.empty}>Nenhuma academia, mercado, conveniência ou unidade de saúde cadastrada no OpenStreetMap num raio de 1,5 km. Vale conferir o bairro pessoalmente.</Text>
            )}
            {nearby.status === 'ready' && nearby.amenities.map((a) => {
              const { Icon, color, label } = AMENITY_META[a.type];
              return (
                <Pressable key={a.osmUrl ?? `${a.type}-${a.name}`} onPress={() => a.osmUrl && Linking.openURL(a.osmUrl)} style={s.poi}>
                  <View style={[s.poiIcon, { backgroundColor: color }]}><Icon size={16} color="#fff" /></View>
                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={{ fontWeight: '600', fontSize: 14, color: C.navy }}>{a.name}</Text>
                    <Text style={{ fontSize: 12, color: '#64748b' }}>{label}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: '600', fontSize: 14, color: C.navy }}>{formatDistance(a.distanceKm)}</Text>
                    <Text style={{ fontSize: 12, color: C.mute }}>~{walkingMinutes(a.distanceKm)} min</Text>
                  </View>
                </Pressable>
              );
            })}

            <View style={{ height: 16 }} />
            <PropertyMap property={p} campus={campus} amenities={nearby.amenities} loading={nearby.status === 'loading'} />

            <View style={s.demo}>
              <ShieldAlert size={18} color={C.amber} />
              <Text style={{ flex: 1, fontSize: 13, color: '#78350f' }}>
                Este é um anúncio ilustrativo da UNIdus: não existe um anunciante real para receber mensagens. Nunca pague sinal antes de visitar o imóvel e conferir o contrato.
              </Text>
            </View>

            <Pressable onPress={onToggleFavorite} style={[s.favBtn, favorite && { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
              <Heart size={18} color={favorite ? C.red : C.navy} fill={favorite ? C.red : 'none'} />
              <Text style={{ fontWeight: '600', color: favorite ? '#dc2626' : C.navy }}>{favorite ? 'Salvo nos favoritos' : 'Salvar nos favoritos'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  tag: { position: 'absolute', top: 16, left: 16, backgroundColor: '#fffffff2', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99 },
  tagText: { fontSize: 12, fontWeight: '700', color: C.navy },
  close: { position: 'absolute', top: 14, right: 14, width: 40, height: 40, borderRadius: 20, backgroundColor: '#fffffff2', alignItems: 'center', justifyContent: 'center' },
  type: { fontSize: 12, fontWeight: '500', color: '#64748b', marginBottom: 4 },
  title: { fontSize: 26, fontWeight: '700', color: C.navy, marginBottom: 8, lineHeight: 31 },
  desc: { fontSize: 14, lineHeight: 21, color: C.text, marginBottom: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.soft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99 },
  chipText: { fontSize: 12, fontWeight: '500', color: '#334155' },
  priceBox: { backgroundColor: C.bg, borderRadius: 16, padding: 16, marginBottom: 20 },
  price: { fontSize: 26, fontWeight: '700', color: C.navy },
  campusIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center' },
  h: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5, color: C.navy, marginBottom: 12 },
  item: { flexDirection: 'row', gap: 10 },
  itemIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' },
  itemLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, color: '#64748b' },
  itemValue: { fontSize: 14, fontWeight: '500', color: C.navy },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: '#cbd5e1', borderRadius: 12, padding: 14, marginBottom: 12 },
  empty: { backgroundColor: '#f8fafc', padding: 14, borderRadius: 12, fontSize: 13, color: C.text, marginBottom: 12 },
  poi: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.soft },
  poiIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  demo: { flexDirection: 'row', gap: 10, backgroundColor: '#fffbeb', borderRadius: 12, padding: 14, marginTop: 20, marginBottom: 12 },
  favBtn: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingVertical: 13 },
});
