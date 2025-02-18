export interface Action {
  distance: string; // 距離
  place: string; // 地點
  carType: string; // 車種
  oil: string; // 油耗
}

export interface ActionResponse {
  action: {
    place: string;
    distance: string;
    carType: string;
    oil: string;
    id?: string;
  };
}
