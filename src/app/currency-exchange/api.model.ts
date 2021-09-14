export interface Api {
  urlNew: string;
  urlCurrency: string;
}

export interface Currency {
  rate: number;
  exchangedate: string;
}

export interface BigCurrency {
  cc: string;
  txt: string;
}
