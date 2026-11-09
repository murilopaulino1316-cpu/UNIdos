import { ComponentType, ReactNode, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Check, ChevronDown, ChevronUp, Info, Search, SlidersHorizontal } from 'lucide-react-native';
import Logo from './Logo';
import { CAMPUSES } from '../data/properties';
import { BUDGET_OPTIONS, DISTANCE_OPTIONS, DEFAULT_FILTERS, Filters, KINDS } from '../data/content';
import { budgetLabel } from '../lib/filter';
import { C } from '../theme';

interface Opt { id: string; label: string }
const norm = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const CITIES = Array.from(new Set(CAMPUSES.map((c) => c.city)));

const monthOptions = (): Opt[] => {
  const now = new Date();
  const out: Opt[] = [{ id: '', label: 'Qualquer mês' }];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const l = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    out.push({ id: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: l.charAt(0).toUpperCase() + l.slice(1) });
  }
  return out;
};

function Dropdown({ value, options, onSelect, searchable, searchPlaceholder, icon: Icon = ChevronDown }: {
  value: string; options: Opt[]; onSelect: (id: string) => void; searchable?: boolean; searchPlaceholder?: string;
  icon?: ComponentType<{ size?: number; color?: string }>;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const shown = useMemo(() => (q ? options.filter((o) => norm(o.label).includes(norm(q))) : options), [q, options]);
  const close = () => { setOpen(false); setQ(''); };
  return (
    <View style={s.box}>
      {open && searchable ? (
        <View style={s.boxHead}>
          <Search size={18} color={C.mute} />
          <TextInput autoFocus value={q} onChangeText={setQ} placeholder={searchPlaceholder} placeholderTextColor={C.mute} style={s.searchInput} />
          <Pressable onPress={close} hitSlop={10}><ChevronUp size={18} color={C.navy} /></Pressable>
        </View>
      ) : (
        <Pressable onPress={() => (open ? close() : setOpen(true))} style={s.boxHead}>
          <Text style={s.boxText}>{options.find((o) => o.id === value)?.label ?? ''}</Text>
          {open ? <ChevronUp size={18} color={C.navy} /> : <Icon size={18} color={C.navy} />}
        </Pressable>
      )}
      {open && (
        <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={s.list}>
          {shown.map((o) => {
            const on = o.id === value;
            return (
              <Pressable key={o.id} onPress={() => { onSelect(o.id); close(); }} style={[s.row, on && { backgroundColor: C.sky }]}>
                <View style={[s.radio, on && s.radioOn]}>{on && <View style={s.radioDot} />}</View>
                <Text style={[s.rowText, on && { fontWeight: '700' }]}>{o.label}</Text>
              </Pressable>
            );
          })}
          {shown.length === 0 && <Text style={{ padding: 14, color: C.mute }}>Nenhum resultado.</Text>}
        </ScrollView>
      )}
    </View>
  );
}

const OptChip = ({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) => (
  <Pressable onPress={onPress} style={[s.chip, on && s.chipOn]}>
    {on && <Check size={15} color="#fff" />}
    <Text style={[s.chipText, on && { color: '#fff', fontWeight: '700' }]}>{label}</Text>
  </Pressable>
);

const CheckRow = ({ label, hint, on, onPress }: { label: string; hint?: string; on: boolean; onPress: () => void }) => (
  <Pressable onPress={onPress} style={s.cbRow}>
    <View style={[s.cb, on && s.cbOn]}>{on && <Check size={14} color="#fff" />}</View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 16, color: C.navy }}>{label}</Text>
      {hint && <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{hint}</Text>}
    </View>
  </Pressable>
);

const MoneyInput = ({ label, value, placeholder, onChange }: { label: string; value: number | null; placeholder: string; onChange: (v: number | null) => void }) => (
  <View style={{ flex: 1 }}>
    <Text style={s.label}>{label}</Text>
    <TextInput style={s.input} keyboardType="number-pad" placeholder={placeholder} placeholderTextColor={C.navy}
      value={value === null ? '' : `R$ ${value.toLocaleString('pt-BR')}`}
      onChangeText={(t) => { const d = t.replace(/\D/g, ''); onChange(d ? Number(d) : null); }} />
  </View>
);

const Section = ({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) => (
  <View style={s.section}>
    <Text style={s.h}>{title}</Text>
    {sub && <Text style={s.sub}>{sub}</Text>}
    {children}
  </View>
);

interface Props { initial: Filters; onApply: (f: Filters) => void; onClose: () => void }

export default function SearchScreen({ initial, onApply, onClose }: Props) {
  const [d, setD] = useState<Filters>(initial);
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setD((x) => ({ ...x, [k]: v }));
  const months = useMemo(monthOptions, []);

  const cityOpts: Opt[] = [{ id: 'all', label: 'Todas as cidades de SP' }, ...CITIES.map((c) => ({ id: c, label: c }))];
  const campusOpts: Opt[] = [{ id: 'all', label: 'Todos os campi' },
    ...CAMPUSES.filter((c) => d.city === 'all' || c.city === d.city).map((c) => ({ id: c.id, label: c.label }))];
  const campusLabel = d.campusId === 'all' ? 'Todos os campi' : CAMPUSES.find((c) => c.id === d.campusId)?.label;

  const pickCity = (city: string) => setD((x) => {
    const stays = x.campusId === 'all' || CAMPUSES.find((c) => c.id === x.campusId)?.city === city || city === 'all';
    return { ...x, city, campusId: stays ? x.campusId : 'all' };
  });

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'bottom']}>
        <View style={s.top}>
          <Pressable onPress={onClose} style={s.back} accessibilityLabel="Voltar"><ArrowLeft size={20} color={C.navy} /></Pressable>
          <Logo height={36} />
          <Pressable onPress={() => setD(DEFAULT_FILTERS)} hitSlop={10}><Text style={{ fontWeight: '700', color: C.navy }}>Limpar</Text></Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 30 }} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <SlidersHorizontal size={16} color={C.navy} />
            <Text style={{ fontSize: 12, fontWeight: '800', letterSpacing: 1.2, color: C.navy }}>BUSCAR MORADIA</Text>
          </View>
          <Text style={s.title}>Onde você vai estudar?</Text>
          <Text style={[s.sub, { fontSize: 16, marginBottom: 22 }]}>Seu orçamento é o ponto de partida.</Text>

          <Text style={s.label}>Cidade</Text>
          <Dropdown value={d.city} options={cityOpts} onSelect={pickCity} />
          <Text style={[s.label, { marginTop: 16 }]}>Universidade ou campus</Text>
          <Dropdown key={d.city} value={d.campusId} options={campusOpts} onSelect={(id) => set('campusId', id)} searchable searchPlaceholder="Buscar universidade ou campus" />
          <Text style={s.hint}>Explore diferentes universidades ou escolha seu campus.</Text>

          <Section title="Quanto cabe no seu mês?" sub="Considere aluguel + condomínio + contas.">
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
              <MoneyInput label="Mínimo" placeholder="R$ 0" value={d.minBudget} onChange={(v) => set('minBudget', v)} />
              <MoneyInput label="Máximo" placeholder="Sem limite" value={d.maxBudget} onChange={(v) => set('maxBudget', v)} />
            </View>
            <View style={s.chips}>
              {BUDGET_OPTIONS.map((o) => <OptChip key={o.value} label={o.label} on={d.maxBudget === o.value} onPress={() => set('maxBudget', o.value)} />)}
              <OptChip label="Sem limite" on={d.maxBudget === null} onPress={() => set('maxBudget', null)} />
            </View>
            <View style={s.info}>
              <Info size={18} color={C.navy} style={{ marginTop: 1 }} />
              <Text style={{ flex: 1, fontSize: 14, color: '#1e3a5f', lineHeight: 20 }}>Compare o total mensal estimado. Confirme com quem anuncia quais despesas estão incluídas.</Text>
            </View>
          </Section>

          <Section title="Perto do seu campus" sub="Distância máxima. O trajeto também importa.">
            <View style={s.chips}>
              {DISTANCE_OPTIONS.map((o) => <OptChip key={o.value} label={o.label.replace('Até ', '')} on={d.maxDistance === o.value} onPress={() => set('maxDistance', o.value)} />)}
              <OptChip label="Qualquer distância" on={d.maxDistance === null} onPress={() => set('maxDistance', null)} />
            </View>
            <Text style={[s.label, { marginTop: 18 }]}>Quando pretende se mudar?</Text>
            <Dropdown value={d.moveDate} options={months} onSelect={(id) => set('moveDate', id)} icon={Calendar} />
          </Section>

          <Section title="Como você quer morar?" sub="Escolha o que combina com a sua rotina.">
            <View style={s.chips}>
              <OptChip label="Tanto faz" on={d.kind === 'any'} onPress={() => set('kind', 'any')} />
              {KINDS.map((k) => <OptChip key={k} label={k} on={d.kind === k} onPress={() => set('kind', k)} />)}
            </View>
            <Text style={[s.h, { marginTop: 26 }]}>O que é importante para você?</Text>
            <Text style={s.sub}>Preferências opcionais, sem seleção inicial.</Text>
            <View style={{ gap: 18, marginTop: 14 }}>
              <CheckRow label="Mobiliado" on={d.furnished} onPress={() => set('furnished', !d.furnished)} />
              <CheckRow label="Contas incluídas" hint="Confira quais despesas entram no valor." on={d.billsIncluded} onPress={() => set('billsIncluded', !d.billsIncluded)} />
              <CheckRow label="Aceita pets" on={d.pets} onPress={() => set('pets', !d.pets)} />
            </View>
          </Section>
        </ScrollView>

        <View style={s.footer}>
          <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 10 }}>
            {campusLabel} · {d.city === 'all' ? 'Todas as cidades' : d.city} · {budgetLabel(d)}
          </Text>
          <Pressable onPress={() => onApply(d)} style={s.cta}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Ver moradias</Text>
            <Search size={18} color="#fff" />
          </Pressable>
          <Text style={{ fontSize: 11, color: C.mute, textAlign: 'center', marginTop: 10 }}>Anúncios ilustrativos. Confirme custos e trajetos.</Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.line },
  back: { width: 40, height: 40, borderRadius: 10, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 31, fontWeight: '800', color: C.navy, lineHeight: 36, marginBottom: 6 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 8 },
  hint: { fontSize: 12, color: '#64748b', marginTop: 10 },
  sub: { fontSize: 14, color: '#64748b' },
  h: { fontSize: 20, fontWeight: '700', color: C.navy, marginBottom: 4 },
  section: { borderTopWidth: 1, borderTopColor: C.line, marginTop: 24, paddingTop: 24 },
  box: { backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 12, overflow: 'hidden' },
  boxHead: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, minHeight: 50 },
  boxText: { flex: 1, fontSize: 16, color: C.navy },
  searchInput: { flex: 1, fontSize: 15, color: C.navy, paddingVertical: 12 },
  list: { maxHeight: 330, borderTopWidth: 1, borderTopColor: C.soft },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 13 },
  rowText: { fontSize: 16, color: C.navy },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center' },
  radioOn: { backgroundColor: C.navy, borderColor: C.navy },
  radioDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingHorizontal: 14, height: 50, fontSize: 16, color: C.navy },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 99, borderWidth: 1, borderColor: C.line, backgroundColor: '#f1f1ee' },
  chipOn: { backgroundColor: C.navy, borderColor: C.navy },
  chipText: { fontSize: 14, color: '#64748b' },
  info: { flexDirection: 'row', gap: 10, backgroundColor: '#e6eefb', borderRadius: 12, padding: 14, marginTop: 18 },
  cbRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  cb: { width: 22, height: 22, borderRadius: 5, borderWidth: 1.5, borderColor: '#94a3b8', alignItems: 'center', justifyContent: 'center', marginTop: 1, backgroundColor: '#fff' },
  cbOn: { backgroundColor: C.navy, borderColor: C.navy },
  footer: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: '#fff' },
  cta: { backgroundColor: C.navy, borderRadius: 12, height: 52, flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' },
});
