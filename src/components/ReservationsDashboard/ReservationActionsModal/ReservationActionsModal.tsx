import React from 'react';
import './ReservationActionsModal.css';
import Modal from '../../Modal/Modal';
import { Reservation, ReservationsMap } from '../../../types/reservation';
import useReservationActionsModal from '../../../utils/hooks/useReservationActionsModal';

interface ReservationActionsModalProps {
    onClose: () => void;
    reservation: Reservation | null;
    deleteReservation: (reservationId: string) => void;
    reservationsMap: ReservationsMap | null;
    setReservationsMap: React.Dispatch<React.SetStateAction<ReservationsMap | null>>;
};

const ReservationActionsModal: React.FC<ReservationActionsModalProps> = ({ onClose, reservation, deleteReservation, reservationsMap, setReservationsMap }) => {
    const {
        showChangeStatusConfirmation,
        newSelectedStatus,
        handleStatusChangeConfirmation,
        changeReservationStatusProcess,
        statusesForChange,
        getBackgroundStatusColor,
        handleNewStatusClick,
        isSelectedForDeletion,
        reservationIsEditable,
        handleEditButtonClick,
        handleDeleteReservationClick,
        handleChangeReservationStatusClick,
    } = useReservationActionsModal(reservation, deleteReservation, onClose, reservationsMap, setReservationsMap);

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