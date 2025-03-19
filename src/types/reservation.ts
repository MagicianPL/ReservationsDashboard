export type ReservationStatus = 
  | 'Reserved' 
  | 'Due In' 
  | 'In House' 
  | 'Due Out' 
  | 'Checked Out' 
  | 'Canceled' 
  | 'No Show';

export interface Reservation {
  id: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  status: ReservationStatus;
  roomNumber?: string;
  notes?: string;
  email?: string;
} 

export interface ReservationResponse {
  id: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  roomNumber?: string;
  notes?: string;
  email?: string;
}