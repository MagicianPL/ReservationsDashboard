import React, { useMemo, useRef } from 'react';
import { Reservation, ReservationsMap, ReservationStatus } from '../../types/reservation';
import ReservationCard from './ReservationCard/ReservationCard';
import './ReservationBoard.css';
import ReservationActionsModal from './ReservationActionsModal/ReservationActionsModal';

interface ReservationBoardProps {
  reservations: Reservation[];
  reservationsMap: ReservationsMap;
  setReservationsMap: React.Dispatch<React.SetStateAction<ReservationsMap>>;
}

const ReservationBoard: React.FC<ReservationBoardProps> = ({ reservations, reservationsMap, setReservationsMap }) => {

  const groupedReservations = useMemo(() => {
    const groups: Record<ReservationStatus, Reservation[]> = {
      'Reserved': [],
      'Due In': [],
      'In House': [],
      'Due Out': [],
      'Checked Out': [],
      'Canceled': [],
      'No Show': []
    };

    reservations.forEach(reservation => {
      groups[reservation.status].push(reservation);
    });

    return groups;
  }, [reservations]);

  const statusColors: Record<ReservationStatus, string> = {
    'Reserved': '#3498db',
    'Due In': '#2ecc71',
    'In House': '#9b59b6',
    'Due Out': '#f39c12',
    'Checked Out': '#7f8c8d',
    'Canceled': '#e74c3c',
    'No Show': '#c0392b'
  };

  const [actionModalIsVisible, setActionModalIsVisible] = React.useState(false);
  const reservationForActions = useRef<Reservation>(null);

  const toggleActionsModal = (reservation: Reservation) => {
    if (actionModalIsVisible) {
      reservationForActions.current = null;
    } else {
      reservationForActions.current = reservation;
    }
    setActionModalIsVisible(prevState => !prevState);
  };

  const closeActionsModal = () => {
    setActionModalIsVisible(false);
    reservationForActions.current = null;
  };

  const handleDeleteReservation = (reservationId: string) => {
    const updatedReservationsMap = { ...reservationsMap };
    delete updatedReservationsMap[reservationId];
    setReservationsMap(updatedReservationsMap);
    closeActionsModal();
  };

  return (
    <div className="reservation-board">
      {Object.entries(groupedReservations).map(([status, reservationList]) => (
          <div key={status} className="status-column">
            <div 
              className="status-header" 
            style={{ backgroundColor: statusColors[status as ReservationStatus] }}
            >
              <h2>{status}</h2>
              <span className="reservation-count">{reservationList.length}</span>
            </div>
            <div className="reservation-list">
              {reservationList.map(reservation => (
                <ReservationCard 
                  key={reservation.id} 
                  reservation={reservation} 
                  statusColor={statusColors[reservation.status]}
                  toggleActionsModal={toggleActionsModal}
                />
              ))}
              {reservationList.length === 0 && (
                <div className="empty-status">Brak rezerwacji</div>
              )}
            </div>
          </div>
      ))}
     { actionModalIsVisible && <ReservationActionsModal onClose={closeActionsModal} reservation={reservationForActions.current} deleteReservation={handleDeleteReservation} /> }
    </div>
  );
};

export default ReservationBoard; 