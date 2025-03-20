import React from 'react';
import './ReservationActionsModal.css';
import Modal from '../../Modal/Modal';
import { Reservation } from '../../../types/reservation';

interface ReservationActionsModalProps {
    onClose: () => void;
    reservation: Reservation | null;
    deleteReservation: (reservationId: string) => void;
};

const ReservationActionsModal: React.FC<ReservationActionsModalProps> = ({ onClose, reservation, deleteReservation }) => {
    const [isSelectedForDeletion, setIsSelectedForDeletion] = React.useState(false);

    const handleDeleteReservationClick = () => {
        if (isSelectedForDeletion) {
            handleDeleteReservation();
            return
        }

        if (!reservation) {
            return;
        }
        setIsSelectedForDeletion(true);
    };

    const handleDeleteReservation = () => {
        if (reservation) {
            deleteReservation(reservation.id);
            onClose();
        } else {
            onClose();
        }
    };

    if (!reservation) {
        return null;
    }

    return (
        <Modal onClose={onClose}>
            <div>
                <p>ID rezerwacji: <span>{reservation.id}</span></p>
                <p>Rezerwacja na: <span>{reservation.guestName}</span></p>
                <p>Przyjazd: <span>{reservation.checkInDate}</span></p>
                <p>Wyjazd: <span>{reservation.checkOutDate}</span></p>
                {!isSelectedForDeletion && <button className="res-action-button">Edytuj</button>}
                {isSelectedForDeletion && <p className="delete-confirmation">Czy na pewno chcesz usunąć tę rezerwację?</p>}
                <button className="res-action-button delete-button" onClick={handleDeleteReservationClick}>Usuń</button>
            </div>
        </Modal>
    );
};

export default ReservationActionsModal; 