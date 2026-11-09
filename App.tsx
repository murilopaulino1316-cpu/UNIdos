import { ReactNode, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, ArrowUpRight, CheckCircle2, Heart, MapPin, Plus, Search, Shield, Users, Home, Minus, FileText } from 'lucide-react-native';
import Logo from './src/components/Logo';
import SmartImage from './src/components/SmartImage';
import PropertyCard from './src/components/PropertyCard';
import PropertyDetail from './src/components/PropertyDetail';
import { PROPERTIES, campusById } from './src/data/properties';
import {
  BENEFITS, CITIES, DEFAULT_FILTERS, FAQ, Filters, NAV_LINKS, QUICK_FILTERS, QuickFilter, STEPS,
} from './src/data/content';
import SearchScreen from './src/components/SearchScreen';
import { matchesFilters, summaryOf } from './src/lib/filter';
import { C, shadow } from './src/theme';

const Eyebrow = ({ children, color = C.navy }: { children: ReactNode; color?: string }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
    <Text style={{ fontSize: 12, fontWeight: '800', letterSpacing: 1.5, color, textTransform: 'uppercase', flexShrink: 1 }}>{children}</Text>
  </View>
);

const Chip = ({ label, active, onPress, dark }: { label: string; active: boolean; onPress: () => void; dark?: boolean }) => (
  <Pressable onPress={onPress} style={[s.chip, active && (dark ? s.chipDark : s.chipSky)]}>
    <Text style={[s.chipText, active && { color: dark ? '#fff' : C.navy }]}>{label}</Text>
  </Pressable>
);

const Btn = ({ label, onPress, light }: { label: string; onPress: () => void; light?: boolean }) => (
  <Pressable onPress={onPress} style={[s.btn, light && { backgroundColor: 'transparent', borderWidth: 2, borderColor: C.navy }]}>
    <Text style={[s.btnText, light && { color: C.navy }]}>{label}</Text>
    <ArrowUpRight size={18} color={light ? C.navy : '#fff'} />
  </Pressable>
);

export default function App() {
  const scroll = useRef<ScrollView>(null);
  const ys = useRef<Record<string, number>>({});
  const at = (id: string) => (e: LayoutChangeEvent) => { ys.current[id] = e.nativeEvent.layout.y; };
  const go = (id: string) => scroll.current?.scrollTo({ y: Math.max(0, (ys.current[id] ?? 0) - 4), animated: true });

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [quick, setQuick] = useState<QuickFilter>('Todos os campi');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const toggleFav = (id: string) => setFavorites((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const resetAll = () => { setFilters(DEFAULT_FILTERS); setQuick('Todos os campi'); };

  const results = useMemo(() => PROPERTIES.filter((p) => {
    if (!matchesFilters(p, filters)) return false;
    if (quick === 'Até R$ 1.000') return p.price <= 1000;
    if (quick !== 'Todos os campi') return campusById(p.campusId)?.city === quick;
    return true;
  }), [filters, quick]);

  const summary = summaryOf(filters);

  const open = PROPERTIES.find((p) => p.id === openId) ?? null;
  const search = (f: Filters) => { setFilters(f); setQuick('Todos os campi'); setSearchOpen(false); setTimeout(() => go('moradias'), 350); };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <View style={s.header}>
          <Pressable onPress={() => go('topo')}><Logo height={38} /></Pressable>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingLeft: 12 }}>
            {NAV_LINKS.map((l) => (
              <Pressable key={l.href} onPress={() => go(l.href.slice(1))} style={s.nav}><Text style={s.navText}>{l.label}</Text></Pressable>
            ))}
          </ScrollView>
        </View>

        <ScrollView ref={scroll} showsVerticalScrollIndicator={false}>
          <View onLayout={at('topo')} style={s.sec}>
            <Eyebrow>Para quem está chegando, para quem já é de casa</Eyebrow>
            <Text style={s.h1}>Sua vida na universidade começa com um lugar para chamar de <Text style={{ color: C.blue }}>seu.</Text></Text>
            <Text style={s.lead}>Quartos, repúblicas e apartamentos perto da USP, UNICAMP, UNESP, UFSCar, UFABC, Mackenzie, PUC-SP e outras faculdades paulistas, de acordo com o seu orçamento e estilo de vida.</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 22 }}>
              <CheckCircle2 size={20} color={C.blue} />
              <Text style={{ flex: 1, fontWeight: '500', color: C.navy }}>Um novo endereço. A mesma comunidade universitária.</Text>
            </View>
            <View style={{ borderRadius: 28, overflow: 'hidden', marginBottom: 22 }}>
              <SmartImage src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80" style={{ height: 300 }} />
              <View style={s.heroBadge}>
                <View style={{ backgroundColor: C.navy, padding: 8, borderRadius: 8 }}><Search size={18} color="#fff" /></View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: C.navy }}>Tem espaço para o seu começo.</Text>
                  <Text style={{ fontSize: 13, color: '#64748b' }}>Perto da aula. Perto de uma nova rotina.</Text>
                </View>
              </View>
            </View>
            <View style={[s.card, { padding: 18, gap: 12 }]}>
              <Text style={{ fontWeight: '700', fontSize: 17, color: C.navy }}>Onde você vai estudar?</Text>
              <Text style={{ fontSize: 14, color: '#64748b' }}>{summary.length ? summary.join(' · ') : 'Seu orçamento é o ponto de partida.'}</Text>
              <Btn label="Buscar moradia" onPress={() => setSearchOpen(true)} />
            </View>
            <View style={{ gap: 10, marginTop: 24 }}>
              {[[FileText, 'Aluguel e contas sem surpresa'], [MapPin, 'Principais campi paulistas no seu radar'], [Users, 'Gente na mesma fase que você']].map(([I, t]: any) => (
                <View key={t} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><I size={16} color="#64748b" /><Text style={{ fontSize: 14, fontWeight: '500', color: '#64748b' }}>{t}</Text></View>
              ))}
            </View>
          </View>

          <View onLayout={at('moradias')} style={s.sec}>
            <Eyebrow>Um endereço possível</Eyebrow>
            <Text style={s.h2}>Moradias perto da faculdade</Text>
            <Text style={[s.lead, { marginBottom: 16 }]}>Do quarto só seu ao apê dividido: compare o que cabe na sua rotina.</Text>

            {summary.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ color: '#64748b', fontSize: 13 }}>Sua busca:</Text>
                {summary.map((t) => <View key={t} style={s.pill}><Text style={{ fontSize: 13, fontWeight: '500', color: C.navy }}>{t}</Text></View>)}
                <Pressable onPress={resetAll}><Text style={{ color: C.blue, fontWeight: '600', fontSize: 13 }}>Limpar busca</Text></Pressable>
              </View>
            )}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 14 }}>
              {QUICK_FILTERS.map((f) => <Chip key={f} dark label={f} active={quick === f} onPress={() => setQuick(f)} />)}
            </ScrollView>

            {results.length > 0 ? (
              <View style={{ gap: 20 }}>
                {results.map((p) => (
                  <PropertyCard key={p.id} property={p} favorite={favorites.has(p.id)} onToggleFavorite={() => toggleFav(p.id)} onOpen={() => setOpenId(p.id)} />
                ))}
              </View>
            ) : (
              <View style={s.empty}>
                <Search size={30} color="#cbd5e1" />
                <Text style={{ fontWeight: '700', fontSize: 17, color: C.navy, marginTop: 8 }}>Nenhuma moradia com esses filtros (ainda).</Text>
                <Text style={{ color: '#64748b', fontSize: 13, marginVertical: 8, textAlign: 'center' }}>Tente ampliar o orçamento, a distância ou ver outros campi.</Text>
                <Pressable onPress={resetAll} style={[s.btn, { alignSelf: 'center' }]}><Text style={s.btnText}>Ver todas as moradias</Text></Pressable>
              </View>
            )}
            {favorites.size > 0 && (
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 16 }}>
                <Heart size={16} color={C.red} fill={C.red} />
                <Text style={{ fontSize: 14, color: C.text }}>{favorites.size} {favorites.size === 1 ? 'moradia salva' : 'moradias salvas'} nos favoritos.</Text>
              </View>
            )}
            <View style={s.note}>
              <Shield size={16} color={C.text} style={{ marginTop: 2 }} />
              <Text style={{ flex: 1, fontSize: 12, color: C.text }}>Anúncios ilustrativos: fotos, valores, composição de moradores e distâncias são exemplos. Confirme custos e trajetos antes de decidir.</Text>
            </View>
          </View>

          <View onLayout={at('republicas')} style={[s.sec, { backgroundColor: C.sand, margin: 16, borderRadius: 28 }]}>
            <Eyebrow>Mais que dividir as contas</Eyebrow>
            <Text style={s.h2}>Encontre sua próxima república</Text>
            <Text style={[s.lead, { marginBottom: 18 }]}>De Barão Geraldo à Vargem Limpa, do Butantã a São Carlos: morar junto deixa o mês mais leve e a chegada menos solitária. Encontre uma casa com a sua cara e pessoas com uma rotina que combina com a sua.</Text>
            <View style={{ borderRadius: 22, overflow: 'hidden', marginBottom: 18 }}>
              <SmartImage src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80" style={{ height: 260 }} />
            </View>
            {[[Home, 'Já existe um lugar para você', 'Vagas em repúblicas tradicionais, mistas, femininas e masculinas.'], [Users, 'Ou uma casa para formar juntos', 'Encontre colegas do seu curso ou campus para buscar e dividir um apê.']].map(([I, t, d]: any) => (
              <View key={t} style={{ flexDirection: 'row', gap: 14, marginBottom: 16 }}>
                <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 12, alignSelf: 'flex-start' }}><I size={22} color={C.navy} /></View>
                <View style={{ flex: 1 }}><Text style={{ fontWeight: '700', fontSize: 17, color: C.navy }}>{t}</Text><Text style={{ fontSize: 14, color: C.text, marginTop: 2 }}>{d}</Text></View>
              </View>
            ))}
            <View style={{ gap: 12, marginTop: 6 }}>
              <Btn label="Explorar repúblicas" onPress={() => { setQuick('Todos os campi'); go('moradias'); }} />
            </View>
          </View>

          <View style={{ backgroundColor: C.navy, paddingVertical: 48, paddingHorizontal: 20 }}>
            <Eyebrow color={C.amber}>A vida além da sala de aula</Eyebrow>
            <Text style={[s.h2, { color: '#fff' }]}>Feito para a vida universitária</Text>
            <Text style={{ color: '#cbd5e1', fontSize: 14, marginBottom: 28 }}>Para calouros, veteranos e quem ainda está esperando a lista de aprovados.</Text>
            {BENEFITS.map(({ icon: I, title, text, tag }) => (
              <View key={title} style={{ marginBottom: 28 }}>
                <View style={s.benefitIcon}><I size={20} color={C.amber} /></View>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 8 }}>{title}</Text>
                <Text style={{ color: '#94a3b8', fontSize: 14, lineHeight: 21, marginBottom: 10 }}>{text}</Text>
                <Text style={{ color: C.amber, fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' }}>{tag}</Text>
              </View>
            ))}
          </View>

          <View onLayout={at('como-funciona')} style={s.sec}>
            <Eyebrow>Passo a passo</Eyebrow>
            <Text style={s.h2}>Da busca à chave</Text>
            <Text style={[s.lead, { marginBottom: 18 }]}>Um caminho simples para sair da aprovação e chegar ao seu novo endereço sem correria.</Text>
            <View style={{ gap: 14 }}>
              {STEPS.map(({ icon: I, title, text }, i) => (
                <View key={title} style={[s.card, { padding: 20 }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
                    <View style={{ backgroundColor: C.sky, padding: 12, borderRadius: 12 }}><I size={22} color={C.navy} /></View>
                    <Text style={{ fontSize: 38, fontWeight: '800', color: C.soft }}>0{i + 1}</Text>
                  </View>
                  <Text style={{ fontWeight: '700', fontSize: 17, color: C.navy, marginBottom: 6 }}>{title}</Text>
                  <Text style={{ fontSize: 14, color: C.text, lineHeight: 21 }}>{text}</Text>
                </View>
              ))}
            </View>
          </View>

          <View onLayout={at('cidades')} style={s.sec}>
            <Eyebrow>Se localiza por aqui</Eyebrow>
            <Text style={s.h2}>Vários campi. Novos caminhos.</Text>
            <Text style={[s.lead, { marginBottom: 18 }]}>Conheça o entorno antes de escolher seu endereço. Seu dia a dia acontece entre a casa e o campus.</Text>
            <View style={{ gap: 20 }}>
              {CITIES.map((c) => (
                <View key={c.id} style={[s.card, { overflow: 'hidden' }]}>
                  <SmartImage src={c.image} style={{ height: 190 }} />
                  <View style={{ padding: 22 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 26, fontWeight: '700', color: C.navy }}>{c.name}</Text>
                      <View style={s.abbr}><Text style={{ fontWeight: '700', fontSize: 12, color: C.navy }}>{c.abbr}</Text></View>
                    </View>
                    <Text style={{ color: '#059669', fontWeight: '500', fontSize: 14, marginVertical: 8 }}>{c.subtitle}</Text>
                    <Text style={{ fontSize: 14, color: C.text, lineHeight: 21, marginBottom: 14 }}>{c.desc}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                      {c.tags.map((t) => <View key={t} style={s.tagPill}><Text style={{ fontSize: 12, fontWeight: '500', color: C.text }}>{t}</Text></View>)}
                    </View>
                    <View style={{ flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: C.soft, paddingTop: 14 }}>
                      <MapPin size={16} color="#b45309" style={{ marginTop: 2 }} />
                      <Text style={{ flex: 1, fontSize: 12, color: '#64748b', lineHeight: 18 }}>{c.transport}</Text>
                    </View>
                    <Pressable onPress={() => { setFilters(DEFAULT_FILTERS); setQuick(c.name as QuickFilter); go('moradias'); }} style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 18 }}>
                      <Text style={{ color: C.blue, fontWeight: '700', fontSize: 14 }}>Ver moradias em {c.name}</Text><ArrowRight size={16} color={C.blue} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
            <View style={s.mintNote}>
              <MapPin size={20} color="#065f46" />
              <Text style={{ flex: 1, color: '#065f46', fontWeight: '500', fontSize: 14 }}>Distância no mapa não conta tudo: visite o bairro, observe iluminação e movimento e teste o caminho de volta da aula.</Text>
            </View>
          </View>

          <View onLayout={at('faq')} style={[s.sec, { borderTopWidth: 1, borderTopColor: C.line }]}>
            <Eyebrow>Antes de fazer as malas</Eyebrow>
            <Text style={s.h2}>Dúvidas de quem está chegando.</Text>
            <Text style={[s.lead, { marginBottom: 12 }]}>Respostas para quem vai estudar em São Paulo, Campinas, Bauru, São Carlos, no ABC ou em outras cidades do estado.</Text>
            {FAQ.map((f, i) => {
              const isOpen = faqOpen === i;
              return (
                <View key={f.q} style={{ borderBottomWidth: 1, borderBottomColor: C.line }}>
                  <Pressable onPress={() => setFaqOpen(isOpen ? null : i)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 18 }}>
                    <Text style={{ flex: 1, fontWeight: '700', fontSize: 16, color: isOpen ? C.blue : C.navy }}>{f.q}</Text>
                    <View style={[s.plus, isOpen && { backgroundColor: C.navy }]}>{isOpen ? <Minus size={16} color="#fff" /> : <Plus size={16} color="#64748b" />}</View>
                  </Pressable>
                  {isOpen && <Text style={{ paddingBottom: 18, fontSize: 14, color: C.text, lineHeight: 22 }}>{f.a}</Text>}
                </View>
              );
            })}
          </View>

          <View style={{ backgroundColor: C.mint, paddingVertical: 56, paddingHorizontal: 20, alignItems: 'center' }}>
            <Eyebrow color="#065f46">Seu lugar nessa nova fase</Eyebrow>
            <Text style={[s.h2, { textAlign: 'center', fontSize: 32 }]}>Seu próximo capítulo tem um endereço.</Text>
            <Text style={{ color: '#334155', fontSize: 15, textAlign: 'center', marginVertical: 14, lineHeight: 22 }}>Para estudantes e ingressantes das faculdades paulistas. Comece pelo seu orçamento e encontre um jeito de morar que combine com você.</Text>
            <Btn label="Encontrar meu lugar" onPress={() => go('topo')} />
            <Text style={{ marginTop: 16, fontSize: 13, color: '#065f46', fontWeight: '500', textAlign: 'center' }}>São Paulo, ABC, Campinas, Bauru, São Carlos e interior.</Text>
          </View>

          <View style={{ backgroundColor: C.navy, padding: 24, paddingBottom: 40 }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 10 }}>Morar bem também faz parte de estudar.</Text>
            <Text style={{ color: '#94a3b8', fontSize: 14, lineHeight: 21, marginBottom: 20 }}>Moradia para a comunidade de estudantes atuais e ingressantes das faculdades do estado de São Paulo.</Text>
            <Text style={{ color: '#94a3b8', fontSize: 12, lineHeight: 18 }}>© 2026 UNIdus. Um lugar para começar.{'\n'}Plataforma independente, sem vínculo oficial com as universidades citadas.</Text>
          </View>
        </ScrollView>

        {searchOpen && <SearchScreen initial={filters} onApply={search} onClose={() => setSearchOpen(false)} />}

        {open && (
          <PropertyDetail property={open} campus={campusById(open.campusId)} favorite={favorites.has(open.id)}
            onToggleFavorite={() => toggleFav(open.id)} onClose={() => setOpenId(null)} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#ffffffe6', borderBottomWidth: 1, borderBottomColor: C.line },
  nav: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 99, backgroundColor: C.soft },
  navText: { fontSize: 13, fontWeight: '600', color: C.navy },
  sec: { paddingHorizontal: 20, paddingVertical: 36 },
  h1: { fontSize: 38, fontWeight: '800', color: C.navy, lineHeight: 42, marginBottom: 16, letterSpacing: -1 },
  h2: { fontSize: 28, fontWeight: '800', color: C.navy, lineHeight: 33, marginBottom: 8 },
  lead: { fontSize: 16, color: C.text, lineHeight: 24, marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 22, borderWidth: 1, borderColor: C.line, ...shadow },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff' },
  chipSky: { backgroundColor: C.sky, borderColor: 'transparent' },
  chipDark: { backgroundColor: C.navy, borderColor: C.navy },
  chipText: { fontSize: 14, fontWeight: '500', color: C.text },
  fieldLabel: { fontSize: 12, color: '#64748b', marginBottom: -6 },
  btn: { backgroundColor: C.navy, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  heroBadge: { position: 'absolute', left: 14, right: 14, bottom: 14, flexDirection: 'row', gap: 12, backgroundColor: '#fffffff2', padding: 14, borderRadius: 16 },
  pill: { backgroundColor: C.sky, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 },
  empty: { backgroundColor: '#fff', borderWidth: 1, borderStyle: 'dashed', borderColor: '#cbd5e1', borderRadius: 20, padding: 28, alignItems: 'center' },
  note: { flexDirection: 'row', gap: 10, backgroundColor: C.sand, padding: 14, borderRadius: 12, marginTop: 24 },
  benefitIcon: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#334155', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  abbr: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' },
  tagPill: { backgroundColor: C.soft, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99 },
  mintNote: { flexDirection: 'row', gap: 12, backgroundColor: '#ecfdf5', padding: 18, borderRadius: 16, marginTop: 22, alignItems: 'center' },
  plus: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' },
});
