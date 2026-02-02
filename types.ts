export interface DigitState {
  thousands: number;
  hundreds: number;
  tens: number;
  ones: number;
}

export type PlaceValue = 'thousands' | 'hundreds' | 'tens' | 'ones';
