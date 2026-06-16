export interface Jersey {
  id: string | number
  club?: string
  team?: string
  season?: string
  size?: string
  condition?: string
  price?: number
  description?: string
  desc?: string
  era?: string
  liga?: string
  verified?: boolean
  location?: string
  num?: string
  jersey_photos?: string[]
  code_photo?: string
  badges?: string[]
  status?: string
  user_id?: string
  created_at?: string
}

export const FALLBACK_JERSEYS: Jersey[] = [
  {
    id: 'ajax-1994',
    club: 'Ajax',
    team: 'Ajax',
    season: '1994–95',
    size: 'L',
    condition: 'Meget god stand',
    price: 1800,
    description: 'Klassisk Ajax trøje fra Champions League-sæsonen 1994–95. Autentisk Umbro spillertrøje med nummer 7.',
    era: '90s',
    liga: 'Champions League',
    verified: true,
    location: 'Danmark',
    num: '7',
  }
]

export const CLUBS = [
  'Arsenal','Aston Villa','Birmingham City','Blackburn Rovers','Bolton Wanderers','Burnley',
  'Chelsea','Crystal Palace','Everton','Fulham','Ipswich Town','Leeds United','Leicester City',
  'Liverpool','Manchester City','Manchester United','Middlesbrough','Newcastle United',
  'Norwich City','Nottingham Forest','Portsmouth','Queens Park Rangers','Sheffield Wednesday',
  'Sheffield United','Southampton','Sunderland','Tottenham Hotspur','West Bromwich Albion',
  'West Ham United','Wimbledon','Wolverhampton Wanderers',
  'Atlético de Madrid','Athletic Club','Barcelona','Betis','Celta Vigo',
  'Deportivo de La Coruña','Espanyol','Getafe','Girona','Granada','Málaga','Mallorca',
  'Osasuna','Racing Santander','Rayo Vallecano','Real Madrid','Real Sociedad','Real Zaragoza',
  'Sevilla','Tenerife','Valencia','Valladolid','Villarreal',
  'AC Milan','Atalanta','Bologna','Cagliari','Empoli','Fiorentina','Genoa',
  'Inter Milan','Juventus','Lazio','Napoli','Parma','Roma','Sampdoria',
  'Torino','Udinese','Venezia','Verona',
  'Arminia Bielefeld','Bayer Leverkusen','Bayern München','Borussia Dortmund',
  'Borussia Mönchengladbach','Eintracht Frankfurt','FC Köln','Hamburger SV',
  'Hertha BSC','Hoffenheim','Kaiserslautern','RB Leipzig','Schalke 04',
  'VfB Stuttgart','Werder Bremen','Wolfsburg',
  'Auxerre','Bordeaux','Lens','Lille','Lyon','Marseille','Monaco',
  'Montpellier','Nantes','Nice','Paris Saint-Germain','Reims','Rennes',
  'Saint-Étienne','Strasbourg','Toulouse',
  'AaB','AC Horsens','AGF','Brøndby IF','FC Copenhagen','FC Midtjylland',
  'FC Nordsjælland','FC Roskilde','Hvidovre IF','Lyngby BK','OB','Randers FC',
  'Silkeborg IF','SønderjyskE','Vejle BK','Viborg FF',
].sort((a, b) => a.localeCompare(b, 'da'))

export const COUNTRIES = [
  'Afghanistan','Albanien','Algeriet','Angola','Argentina','Armenien','Australien',
  'Belgien','Bolivia','Bosnien-Hercegovina','Brasilien','Bulgarien',
  'Chile','Colombia','Costa Rica','Côte d\'Ivoire','Kroatien','Cuba',
  'Danmark','Den Dominikanske Republik','Ecuador','Egypten','England',
  'Finland','Frankrig','Ghana','Grækenland','Honduras','Ungarn',
  'Indien','Indonesien','Iran','Irak','Irland','Israel','Italien',
  'Jamaica','Japan','Jordan','Cameroun','Canada','Kasakhstan','Kenya',
  'Kina','Kosovo','Kuwait','Libyen','Marokko','Mexico','Moldavien',
  'Montenegro','Mozambique','Nederlandene','New Zealand','Nigeria',
  'Nordirland','Nordkorea','Norge','Pakistan','Panama','Paraguay',
  'Peru','Polen','Portugal','Rumænien','Rusland','Saudi-Arabien',
  'Schweiz','Scotland','Senegal','Serbien','Slovakiet','Slovenien',
  'Spanien','Sverige','Sydafrika','Sydkorea','Tanzania','Thailand',
  'Trinidad og Tobago','Tjekkiet','Tunesien','Tyrkiet','Tyskland',
  'Uganda','Ukraine','Uruguay','USA','Venezuela','Wales','Zambia','Zimbabwe',
].sort((a, b) => a.localeCompare(b, 'da'))
