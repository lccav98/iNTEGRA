
export type TabType = 'registro' | 'mapa' | 'ayuda' | 'perfil';

export interface DocumentState {
  identityScanned: boolean;
  cpfScanned: boolean;
  identityName?: string;
  cpfNumber?: string;
}

export interface RegistrationFormData {
  phone: string;
  healthLinked: boolean;
  interiorizationMode: 'individual' | 'familiar';
}
