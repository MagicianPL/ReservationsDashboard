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

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getReservationStatusesForChange = (currentStatus: ReservationStatus | undefined): ReservationStatus[] => {
  switch (currentStatus) {
    case 'Reserved':
      return ['Canceled', 'Due In'];
    case 'Due In':
      return ['Canceled', 'No Show', 'In House'];
    case 'In House':
      return ['Checked Out'];
      case 'Checked Out':
        return ['In House'];
    case 'Canceled':
      return ['Reserved'];
    default:
      return [];
  }
}