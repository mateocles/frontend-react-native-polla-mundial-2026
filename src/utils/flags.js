// Mapa nombre de selección (inglés) → código de bandera (flagcdn.com).
// flagcdn es gratis y sin API key: https://flagcdn.com/w80/<code>.png
// Soporta subdivisiones del Reino Unido: gb-eng, gb-sct, gb-wls.
const NAME_TO_CODE = {
  Argentina: "ar", Brazil: "br", France: "fr", Germany: "de", Spain: "es",
  Italy: "it", Mexico: "mx", "South Africa": "za", "South Korea": "kr",
  "North Korea": "kp", "Czech Republic": "cz", Portugal: "pt", Netherlands: "nl",
  Belgium: "be", Croatia: "hr", Uruguay: "uy", Colombia: "co", Japan: "jp",
  USA: "us", "United States": "us", Canada: "ca", Morocco: "ma", Senegal: "sn",
  Ghana: "gh", Nigeria: "ng", Cameroon: "cm", Switzerland: "ch", Denmark: "dk",
  Poland: "pl", Sweden: "se", Serbia: "rs", Qatar: "qa", "Saudi Arabia": "sa",
  Iran: "ir", Australia: "au", Ecuador: "ec", Peru: "pe", Chile: "cl",
  Paraguay: "py", "Costa Rica": "cr", Tunisia: "tn", Algeria: "dz", Egypt: "eg",
  "Ivory Coast": "ci", "Côte d'Ivoire": "ci", Greece: "gr", Turkey: "tr",
  "Türkiye": "tr", Austria: "at", Norway: "no", Ukraine: "ua", Russia: "ru",
  Romania: "ro", Hungary: "hu", Slovakia: "sk", Slovenia: "si", Ireland: "ie",
  Iceland: "is", Finland: "fi", Panama: "pa", Honduras: "hn", Jamaica: "jm",
  Venezuela: "ve", Bolivia: "bo", "New Zealand": "nz", China: "cn", Mali: "ml",
  "Burkina Faso": "bf", "DR Congo": "cd", Uzbekistan: "uz", Jordan: "jo",
  Iraq: "iq", UAE: "ae", "United Arab Emirates": "ae", Israel: "il",
  "Cape Verde": "cv", England: "gb-eng", Scotland: "gb-sct", Wales: "gb-wls",
};

// Código de bandera para un nombre de selección (o null si no se conoce).
export function teamCode(name) {
  return name ? NAME_TO_CODE[name] || null : null;
}

// URL de la bandera en flagcdn. width: 40 | 80 | 160 | 320 ...
export function teamFlagUrl(name, width = 80) {
  const code = teamCode(name);
  return code ? `https://flagcdn.com/w${width}/${code}.png` : null;
}
