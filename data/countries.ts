export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  format?: string;
  minDigits: number;
  maxDigits: number;
}

export const COUNTRIES: Country[] = [
  // Lusófonos
  { code: "BR", name: "Brasil",             dialCode: "+55",  flag: "🇧🇷", format: "(##) #####-####", minDigits: 10, maxDigits: 11 },
  { code: "PT", name: "Portugal",           dialCode: "+351", flag: "🇵🇹", format: "### ### ###",     minDigits: 9,  maxDigits: 9  },
  { code: "AO", name: "Angola",             dialCode: "+244", flag: "🇦🇴", format: "### ### ###",     minDigits: 9,  maxDigits: 9  },
  { code: "MZ", name: "Moçambique",         dialCode: "+258", flag: "🇲🇿", format: "## ### ####",     minDigits: 9,  maxDigits: 9  },
  { code: "CV", name: "Cabo Verde",         dialCode: "+238", flag: "🇨🇻", format: "### ## ##",       minDigits: 7,  maxDigits: 7  },
  { code: "GW", name: "Guiné-Bissau",       dialCode: "+245", flag: "🇬🇼", format: "### ####",        minDigits: 7,  maxDigits: 7  },
  { code: "TL", name: "Timor-Leste",        dialCode: "+670", flag: "🇹🇱", format: "#### ####",       minDigits: 7,  maxDigits: 8  },
  { code: "ST", name: "São Tomé e Príncipe",dialCode: "+239", flag: "🇸🇹", format: "### ####",        minDigits: 7,  maxDigits: 7  },
  // Américas
  { code: "US", name: "Estados Unidos",     dialCode: "+1",   flag: "🇺🇸", format: "(###) ###-####",  minDigits: 10, maxDigits: 10 },
  { code: "CA", name: "Canadá",             dialCode: "+1",   flag: "🇨🇦", format: "(###) ###-####",  minDigits: 10, maxDigits: 10 },
  { code: "AR", name: "Argentina",          dialCode: "+54",  flag: "🇦🇷", format: "## ####-####",    minDigits: 10, maxDigits: 10 },
  { code: "CL", name: "Chile",              dialCode: "+56",  flag: "🇨🇱", format: "# #### ####",     minDigits: 9,  maxDigits: 9  },
  { code: "CO", name: "Colômbia",           dialCode: "+57",  flag: "🇨🇴", format: "### ### ####",    minDigits: 10, maxDigits: 10 },
  { code: "MX", name: "México",             dialCode: "+52",  flag: "🇲🇽", format: "## #### ####",    minDigits: 10, maxDigits: 10 },
  { code: "UY", name: "Uruguai",            dialCode: "+598", flag: "🇺🇾", format: "## ### ###",      minDigits: 8,  maxDigits: 8  },
  { code: "PY", name: "Paraguai",           dialCode: "+595", flag: "🇵🇾", format: "### ### ###",     minDigits: 9,  maxDigits: 9  },
  // Europa
  { code: "GB", name: "Reino Unido",        dialCode: "+44",  flag: "🇬🇧", format: "#### ######",     minDigits: 10, maxDigits: 10 },
  { code: "FR", name: "França",             dialCode: "+33",  flag: "🇫🇷", format: "# ## ## ## ##",   minDigits: 9,  maxDigits: 9  },
  { code: "DE", name: "Alemanha",           dialCode: "+49",  flag: "🇩🇪", format: "### #######",     minDigits: 10, maxDigits: 11 },
  { code: "ES", name: "Espanha",            dialCode: "+34",  flag: "🇪🇸", format: "### ### ###",     minDigits: 9,  maxDigits: 9  },
  { code: "IT", name: "Itália",             dialCode: "+39",  flag: "🇮🇹", format: "### ### ####",    minDigits: 9,  maxDigits: 10 },
  // Ásia / Oceânia
  { code: "JP", name: "Japão",              dialCode: "+81",  flag: "🇯🇵", format: "##-####-####",    minDigits: 10, maxDigits: 10 },
  { code: "CN", name: "China",              dialCode: "+86",  flag: "🇨🇳", format: "### #### ####",   minDigits: 11, maxDigits: 11 },
  { code: "IN", name: "Índia",              dialCode: "+91",  flag: "🇮🇳", format: "##### #####",     minDigits: 10, maxDigits: 10 },
  { code: "AU", name: "Austrália",          dialCode: "+61",  flag: "🇦🇺", format: "### ### ###",     minDigits: 9,  maxDigits: 9  },
];

export const DEFAULT_COUNTRY_CODE = "BR";
