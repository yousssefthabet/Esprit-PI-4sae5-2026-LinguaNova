export interface Cahier {
  idCahier: number;
  nomContexte: string;
  contextType: string;
  userId: number;
}

export interface CahierCreateRequest {
  nomContexte: string;
  contextType: string;
  userId: number;
}
