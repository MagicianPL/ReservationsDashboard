import { useMemo, useRef, useState } from "react";
import { Reservation, ReservationsMap, ReservationStatus } from "../../types/reservation";
import { getReservationStatusesForChange } from "../reservationUtils";
import { useNavigate } from "react-router";

const useReservationActionsModal = (
    reservation: Reservation | null,
    deleteReservation: (reservationId: string) => void,
    onClose: () => void,
    reservationsMap: ReservationsMap | null,
    setReservationsMap: React.Dispatch<React.SetStateAction<ReservationsMap | null>>,
) => {
    const [isSelectedForDeletion, setIsSelectedForDeletion] = useState(false);
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

    return { showChangeStatusConfirmation, newSelectedStatus, handleStatusChangeConfirmation, changeReservationStatusProcess, statusesForChange, getBackgroundStatusColor, handleNewStatusClick, isSelectedForDeletion, reservationIsEditable, handleEditButtonClick, handleDeleteReservationClick, handleChangeReservationStatusClick };
};

export default useReservationActionsModal;