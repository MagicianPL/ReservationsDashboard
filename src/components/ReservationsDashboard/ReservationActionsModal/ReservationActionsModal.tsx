import React, { useMemo, useRef, useState } from 'react';
import './ReservationActionsModal.css';
import Modal from '../../Modal/Modal';
import { Reservation, ReservationsMap, ReservationStatus } from '../../../types/reservation';
import { useNavigate } from 'react-router';
import { getReservationStatusesForChange } from '../../../utils/reservationUtils';

interface ReservationActionsModalProps {
    onClose: () => void;
    reservation: Reservation | null;
    deleteReservation: (reservationId: string) => void;
    reservationsMap: ReservationsMap | null;
    setReservationsMap: React.Dispatch<React.SetStateAction<ReservationsMap | null>>;
};

const ReservationActionsModal: React.FC<ReservationActionsModalProps> = ({ onClose, reservation, deleteReservation, reservationsMap, setReservationsMap }) => {
    const [isSelectedForDeletion, setIsSelectedForDeletion] = React.useState(false);
    const [changeReservationStatusProcess, setChangeReservationStatusProcess] = useState(false);
    const [showChangeStatusConfirmation, setShowChangeStatusConfirmation] = useState(false);
    const reservationIsEditable = reservation?.status === 'Reserved' || reservation?.status === 'Due In';
    const statusesForChange = useMemo(() => getReservationStatusesForChange(reservation?.status), [reservation]);
    const newSelectedStatus = useRef<string>('');

    const navigate = useNavigate();


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

    const handleEditButtonClick = () => {
        if (reservation) {
            navigate(`/edit/${reservation.id}`);
        }
    };

    const handleChangeReservationStatusClick = () => {
        setChangeReservationStatusProcess(true);
    };

    const getBackgroundStatusColor = useMemo(() => (status: string) => {
        switch (status) {
            case 'Canceled':
                return 'canceled';
            case 'Due In':
                return 'due-in';
            case 'No Show':
                return 'no-show';
            case 'In House':
                return 'in-house';
            case 'Checked Out':
                return 'checked-out';
            case 'Reserved':
                return 'reserved';
            default:
                return '';
        }
    }, [statusesForChange]);

    const handleNewStatusClick = (newStatus: string) => {
        newSelectedStatus.current = newStatus;
        setShowChangeStatusConfirmation(true);
    };

    const handleStatusChangeConfirmation = () => {
        if (!reservation) return;

        const reservationId = reservation.id;
        const updatedReservation: Reservation = { ...reservation, status: newSelectedStatus.current as ReservationStatus };
        const updatedReservationsMap = { ...reservationsMap, [reservationId]: updatedReservation };
        setReservationsMap(updatedReservationsMap);
        onClose();
    };


    if (!reservation) {
        return null;
    }

    // Status change confirmation
    if (showChangeStatusConfirmation) return (
        <Modal onClose={onClose}>
            <div>
                <>
                    <p>Czy na pewno chcesz zmienić status rezerwacji <span>{reservation.id}</span> dla <span>{reservation.guestName}</span>?</p>
                    <p>{`Aktualny status: ${reservation.status}`}</p>
                    <p>{`Nowy status: ${newSelectedStatus.current}`}</p>
                    <button className={`res-action-button change-res-status-button status-button`} onClick={handleStatusChangeConfirmation}>Potwierdzam</button>
                </>
            </div>
        </Modal>
    );

    // Status change in progress
    if (changeReservationStatusProcess) return (
        <Modal onClose={onClose}>
            <div>
                {statusesForChange.length === 0 && (
                    <p>Brak dostępnych statusów do zmiany dla rezerwacji <span>{reservation.id}</span></p>
                )}
                {statusesForChange.length > 0 && (
                    <>
                        <p>Obecny status rezerwacji {reservation.id}: <span>{reservation.status}</span></p>
                        <p>Wybierz nowy status rezerwacji:</p>
                        <div className='statuses-container'>
                            {statusesForChange.map(status => <button className={`res-action-button change-res-status-button status-button ${getBackgroundStatusColor(status)}`} onClick={() => handleNewStatusClick(status)}>{status}</button>)}
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );

    // Info and actions for current reservation
    return (
        <Modal onClose={onClose}>
            <div>
                <p>ID rezerwacji: <span>{reservation.id}</span></p>
                <p>Rezerwacja na: <span>{reservation.guestName}</span></p>
                <p>Przyjazd: <span>{reservation.checkInDate}</span></p>
                <p>Wyjazd: <span>{reservation.checkOutDate}</span></p>
                {!isSelectedForDeletion && reservationIsEditable && <button className="res-action-button" onClick={handleEditButtonClick}>Edytuj</button>}
                {isSelectedForDeletion && <p className="delete-confirmation">Czy na pewno chcesz usunąć tę rezerwację?</p>}
                <button className="res-action-button delete-button" onClick={handleDeleteReservationClick}>Usuń</button>
                <button className="res-action-button change-res-status-button" onClick={handleChangeReservationStatusClick}>Zmień status rezerwacji</button>
            </div>
        </Modal>
    );
};

export default ReservationActionsModal; 