export interface TemplateFormatNumber {
  key: string;
  name: string;
  template: {
    thousand_separator: string;
    decimal_separator: string;
    decimal_places: number;
  };
}

export const templateFormatNumber: TemplateFormatNumber[] = [
  {
    key: 'us-format',
    name: 'US FORMAT',
    template: {
      thousand_separator: ",",
      decimal_separator: ".",
      decimal_places: 2,
    }
  },
  {
    key: 'uk-format',
    name: 'UK FORMAT',
    template: {
      thousand_separator: ".",
      decimal_separator: ",",
      decimal_places: 2,
    }
  }
];

export interface NegativeNumberBehavior {
  key: string;
  name: string;
  description: string;
  template: {
    brackets: boolean;
    absoluteValue: boolean;
    color: 'default' | 'danger' | 'danger-brackets';
  };
}


export const negativeNumberBehavior: NegativeNumberBehavior[] = [
  {
    key: "default",
    name: "Default",
    description: "Display negative numbers as they are (e.g., -1000.00).",
    template: {
      brackets:false,
      absoluteValue:false,
      color:"default",
    }
  },
  {
    key: "danger",
    name: "Danger",
    description: "Display negative numbers as they are (e.g., -1000.00).",
    template: {
      brackets:false,
      absoluteValue:false,
      color:"danger",
    }
  },
  {
    key: "danger-brackets",
    name: "Danger Brackets",
    description: "Display negative numbers in brackets (e.g., (1000.00)).",
    template: {
      brackets:true,
      absoluteValue:true,
      color:"danger",
    }
  }
]


