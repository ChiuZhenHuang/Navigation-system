export interface Action {
  distance: string; // 距離
  place: string; // 地點
  carType: string; // 車種
  oil: string; // 油耗
  time: string;
}

export interface UserRecord {
  action: Action;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  records: UserRecord;
}
