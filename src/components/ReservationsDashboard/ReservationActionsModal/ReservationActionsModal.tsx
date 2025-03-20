import React from 'react';
import './ReservationActionsModal.css';
import Modal from '../../Modal/Modal';
import { Reservation } from '../../../types/reservation';

interface ReservationActionsModalProps {
    onClose: () => void;
    reservation: Reservation | null;
};

const ReservationActionsModal: React.FC<ReservationActionsModalProps> = ({ onClose, reservation }) => {
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
                <button className="res-action-button">Edytuj</button>
                <button className="res-action-button delete-button">Usuń</button>
            </div>
        </Modal>
    );
};

export default ReservationActionsModal; 