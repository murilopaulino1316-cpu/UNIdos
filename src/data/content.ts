import { Wallet, MapPin, Coffee, GraduationCap, Scale, MessageCircle, KeyRound } from "lucide-react-native";
import type { CityName } from "../types";

export interface City {
  id: string;
  name: CityName;
  abbr: string;
  subtitle: string;
  desc: string;
  tags: string[];
  transport: string;
  image: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const KINDS = ['Quarto individual', 'Quarto compartilhado', 'República', 'Studio', 'Apartamento'] as const;
export type Kind = (typeof KINDS)[number];

export interface Filters {
  city: string;
  campusId: string;
  minBudget: number | null;
  maxBudget: number | null;
  maxDistance: number | null;
  moveDate: string;
  kind: Kind | 'any';
  furnished: boolean;
  billsIncluded: boolean;
  pets: boolean;
}


export const FEATURED_CAMPUSES = ['usp-butanta', 'unicamp-barao', 'unesp-bauru', 'ufabc-sa'];

export const CITIES: City[] = [
  {
    id: 'sp',
    name: 'São Paulo',
    abbr: 'SP',
    subtitle: 'USP, Mackenzie, PUC-SP, UNIFESP e mais',
    desc: 'Butantã e Rio Pequeno para a Cidade Universitária; Higienópolis, Consolação e Perdizes para o centro expandido. Compare o trajeto e o custo total, não só o aluguel.',
    tags: ['Butantã', 'Perdizes', 'Higienópolis', 'Vila Mariana'],
    transport: 'Metrô, CPTM e ônibus conectam os principais campi. Confira a estação mais próxima do seu prédio de aula.',
    image: 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'campinas',
    name: 'Campinas',
    abbr: 'CPS',
    subtitle: 'UNICAMP, PUC-Campinas',
    desc: 'Barão Geraldo concentra a vida universitária. O caminho real ajuda a decidir entre ir a pé, de bike ou de ônibus.',
    tags: ['Barão Geraldo', 'Cidade Universitária', 'Cambuí'],
    transport: 'Ônibus municipais e linhas internas atendem o campus. Consulte os horários noturnos.',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bauru',
    name: 'Bauru',
    abbr: 'BRU',
    subtitle: 'UNESP, USP (Odontologia), FATEC',
    desc: 'Vargem Limpa e arredores do campus reúnem repúblicas e quartos com preços mais acessíveis que na capital.',
    tags: ['Vargem Limpa', 'Jardim Infante Dom Henrique', 'Centro'],
    transport: 'Linhas de ônibus ligam o centro ao campus. Muita gente vai de bike ou a pé.',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'saocarlos',
    name: 'São Carlos',
    abbr: 'SCA',
    subtitle: 'UFSCar, USP São Carlos',
    desc: 'Cidade com alma universitária. Jardim Bandeirantes e Cidade Jardim ficam no caminho da UFSCar; o centro atende bem a USP.',
    tags: ['Jardim Bandeirantes', 'Cidade Jardim', 'Centro'],
    transport: 'Ônibus circulares atendem os campi. Avalie subidas e o trajeto à noite.',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80',
  },
];

export const FAQ: FaqItem[] = [
  {
    q: 'A UNIdus faz parte de alguma universidade?',
    a: 'Não. Somos uma plataforma independente voltada a estudantes atuais e ingressantes das faculdades paulistas. Não somos um site oficial nem representamos USP, UNICAMP, UNESP, UFSCar, UFABC ou qualquer outra instituição.',
  },
  {
    q: 'Ainda não saiu a lista de aprovados. Já posso procurar moradia?',
    a: 'Pode, e é uma boa ideia. Entre a lista da Fuvest, Comvest, Vunesp ou do SiSU e a matrícula costuma haver pouco tempo. Salve seus favoritos, compare bairros e converse com repúblicas antes, assim você só fecha quando tiver a vaga confirmada.',
  },
  {
    q: 'O valor do anúncio inclui as contas?',
    a: 'Depende do anúncio. Mostramos o aluguel e, ao lado, a estimativa de contas (luz, água, internet, gás e condomínio). Quando aparece “contas inclusas”, confirme com o anunciante o que de fato está incluído.',
  },
  {
    q: 'Preciso de fiador para alugar?',
    a: 'Muitos quartos e repúblicas não pedem fiador e trabalham com caução (geralmente 1 a 3 meses) ou seguro-fiança. Em apartamentos por imobiliária, o fiador ou seguro é mais comum. Cada anúncio informa as garantias aceitas.',
  },
  {
    q: 'E a moradia estudantil oficial das universidades?',
    a: 'Universidades como USP (CRUSP), UNICAMP, UNESP e UFSCar têm programas próprios de moradia e permanência estudantil, com editais e critérios socioeconômicos. Vale se inscrever neles também; a UNIdus é uma alternativa complementar no mercado privado.',
  },
  {
    q: 'Como saber se uma república combina comigo?',
    a: 'Pergunte sobre rotina, visitas, divisão de tarefas, festas, silêncio em semana de provas e como as contas são divididas. Se possível, visite e converse com os moradores antes de decidir.',
  },
  {
    q: 'O que conferir antes de fechar o aluguel?',
    a: 'Visite o imóvel (ou peça uma chamada de vídeo), confira o contrato, quem é o proprietário, o valor total do mês, o trajeto até o campus à noite e nunca pague sinal sem ter visto o lugar e o documento.',
  },
];

export const BUDGET_OPTIONS = [
  { value: 800, label: 'Até R$ 800' },
  { value: 1200, label: 'Até R$ 1.200' },
  { value: 1500, label: 'Até R$ 1.500' },
  { value: 2000, label: 'Até R$ 2.000' },
];

export const DISTANCE_OPTIONS = [
  { value: 1, label: 'Até 1 km' },
  { value: 2, label: 'Até 2 km' },
  { value: 3, label: 'Até 3 km' },
  { value: 5, label: 'Até 5 km' },
];

export const QUICK_FILTERS = ['Todos os campi', 'São Paulo', 'Campinas', 'Bauru', 'São Carlos', 'Santo André', 'Até R$ 1.000'] as const;
export type QuickFilter = (typeof QUICK_FILTERS)[number];

export const DEFAULT_FILTERS: Filters = {
  city: 'all', campusId: 'all', minBudget: null, maxBudget: null, maxDistance: null, moveDate: '',
  kind: 'any', furnished: false, billsIncluded: false, pets: false,
};

export const brl = (v: number) => `R$ ${v.toLocaleString('pt-BR')}`;
export const km = (v: number) => `${v.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} km`;

export const NAV_LINKS = [
  { href: '#moradias', label: 'Encontrar moradia' },
  { href: '#republicas', label: 'Repúblicas' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#cidades', label: 'Cidades' },
  { href: '#faq', label: 'Dúvidas' },
];

export const BENEFITS = [
  {
    icon: Wallet,
    title: 'Seu bolso vem primeiro',
    text: 'Compare aluguel, condomínio e contas. Um valor que cabe no mês vale mais que um preço que esconde despesas.',
    tag: 'Orçamento de verdade',
  },
  {
    icon: MapPin,
    title: 'Menos perrengue no caminho',
    text: 'Considere o campus, os mercados e o transporte do bairro. A melhor distância também depende da sua rotina.',
    tag: 'Praticidade no dia a dia',
  },
  {
    icon: Coffee,
    title: 'Um começo com companhia',
    text: 'Encontre repúblicas e colegas que entendem a vida universitária, do primeiro semestre à semana de provas.',
    tag: 'Comunidade universitária',
  },
];

export const STEPS = [
  {
    icon: GraduationCap,
    title: 'Defina campus e orçamento',
    text: 'Escolha onde vai estudar e quanto pode gastar por mês, já contando as contas.',
  },
  {
    icon: Scale,
    title: 'Compare custo e trajeto',
    text: 'Coloque lado a lado aluguel, contas, distância e transporte até o seu prédio de aula.',
  },
  {
    icon: MessageCircle,
    title: 'Converse e visite',
    text: 'Fale com anunciantes e moradores, tire dúvidas e visite o lugar (ou faça uma chamada de vídeo).',
  },
  {
    icon: KeyRound,
    title: 'Feche com segurança',
    text: 'Leia o contrato, confirme garantias e só pague depois de ver o imóvel. Aí é pegar a chave.',
  },
];

