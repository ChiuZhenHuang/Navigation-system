export interface Action {
  distance: string; // 距離
  place: string; // 地點
  carType: string; // 車種
  oil: string; // 油耗
  time: string;
}

export interface ActionResponse {
  action: {
    place: string;
    distance: string;
    carType: string;
    oil: string;
    time: string;
    id?: string;
  };
  timestamp: number;
  id: string;
}

export interface totalRecords {
  email: string;
  id: string;
  name: string;
  records: ActionResponse[];
  totalCount: number;
  totalDistance: number;
  totalOil: number;
  totalTime: number;
  totalPoints: number;
}

export interface TotalRecord {
  totalDistance: string;
  totalOil: string;
  toalCount: number;
}

export interface TaskOptions {
  title: string;
  target: string;
  point: string;
}
