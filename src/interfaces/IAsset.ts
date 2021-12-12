export interface IAsset {
  id: string;
  lat: number;
  lng: number;
}

export interface IDBAsset {
  [id: string]: {
    id: string;
    lat: number;
    lng: number;
  };
}
