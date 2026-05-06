export const cidadesPorEstado: Record<string, string[]> = {
  "AC": ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira"],
  "AL": ["Maceió", "Arapiraca", "Rio Largo", "Delmiro Gouveia", "Palmeira dos Índios"],
  "AP": ["Macapá", "Santana", "Oiapoque", "Laranjal do Jari"],
  "AM": ["Manaus", "Parintins", "Itacoatiara", "Coari", "Tefé"],
  "BA": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Ilhéus", "Jequié", "Lauro de Freitas", "Cruz das Almas"],
  "CE": ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Quixadá", "Iguatu"],
  "DF": ["Brasília", "Taguatinga", "Ceilândia", "Samambaia", "Planaltina"],
  "ES": ["Vitória", "Vila Velha", "Cariacica", "Serra", "Colatina"],
  "GO": ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Trindade"],
  "MA": ["São Luís", "Imperatriz", "Timon", "Bacabal", "Codó"],
  "MT": ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra"],
  "MS": ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Maracaju"],
  "MG": ["Belo Horizonte", "Contagem", "Betim", "Montes Claros", "Juiz de Fora", "Uberlândia", "Governador Valadares", "Ipatinga", "Divinópolis"],
  "PA": ["Belém", "Ananindeua", "Santarém", "Marabá", "Parauapebas"],
  "PB": ["João Pessoa", "Campina Grande", "Patos", "Cabedelo", "Santa Rita"],
  "PR": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Guarapuava"],
  "PE": ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina", "Paulista", "Camaragibe", "Santo Antão"],
  "PI": ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano"],
  "RJ": ["Rio de Janeiro", "Niterói", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "São João de Meriti", "Magé", "Mesquita"],
  "RN": ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Caicó"],
  "RS": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Santa Maria", "Gravataí", "Almeida", "Viamão", "Novo Hamburgo"],
  "RO": ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal"],
  "RR": ["Boa Vista", "Rorainópolis", "Caracaraí", "Mucajaí"],
  "SC": ["Florianópolis", "Joinville", "Blumenau", "Brusque", "Itajaí", "Lages", "Criciúma", "Chapecó"],
  "SP": ["São Paulo", "Campinas", "Santos", "Sorocaba", "Ribeirão Preto", "Piracicaba", "Osasco", "Guarulhos", "Poá", "Diadema", "Mogi das Cruzes", "Bauru", "Araraquara"],
  "SE": ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana"],
  "TO": ["Palmas", "Araguaína", "Gurupi", "Porto Nacional"],
};

export function obterTodasCidades(): string[] {
  const todasCidades = new Set<string>();
  Object.values(cidadesPorEstado).forEach(cidades => {
    cidades.forEach(cidade => todasCidades.add(cidade));
  });
  return Array.from(todasCidades).sort();
}

export function filtrarCidades(termo: string): string[] {
  if (!termo.trim()) {
    return obterTodasCidades();
  }
  
  const termoLower = termo.toLowerCase();
  return obterTodasCidades().filter(cidade => 
    cidade.toLowerCase().includes(termoLower)
  );
}
