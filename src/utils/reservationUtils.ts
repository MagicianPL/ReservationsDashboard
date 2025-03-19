import { Reservation, ReservationResponse, ReservationStatus } from '../types/reservation';

const isValidStatus = (status: string): status is ReservationStatus => {
  return ['Reserved', 'Due In', 'In House', 'Due Out', 'Checked Out', 'Canceled', 'No Show'].includes(status);
};

export const mapResponseObjectToReservation = (data: ReservationResponse): Reservation => {
  if (!isValidStatus(data.status)) {
    throw new Error(`Nieprawidłowy status rezerwacji: ${data.status}`);
  }
  
  return {
    id: data.id,
    guestName: data.guestName,
    checkInDate: data.checkInDate,
    checkOutDate: data.checkOutDate,
    status: data.status,
    roomNumber: data.roomNumber,
    notes: data.notes,
    email: data.email
  };
}; 