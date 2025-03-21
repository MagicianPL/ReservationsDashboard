import { useNavigate, useParams } from "react-router";
import { Reservation, ReservationsMap } from "../../types/reservation";
import { useEffect, useState } from "react";
import { emailRegex } from "../reservationUtils";
import { getTodayDateForDateInput } from "../dateFormatters";

const useCreateReservation = (
    reservationsMap: ReservationsMap | null | undefined,
    reservations: Reservation[],
    setReservationsMap: React.Dispatch<React.SetStateAction<ReservationsMap | null>>,
    reservedRooms: Set<string | undefined>,
) => {
    const { reservationId } = useParams();
    const reservationToEdit = (reservationsMap && reservationId) ? reservationsMap[reservationId] : undefined;
    const reservationIsEditable = reservationToEdit?.status === 'Reserved' || reservationToEdit?.status === 'Due In';

    const [formState, setFormState] = useState({
        firstName: '',
        lastName: '',
        arrivalDate: '',
        departureDate: '',
        roomNumber: '',
        notes: '',
        email: '',
    });
    const [formError, setFormError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (reservationToEdit) {
            setFormState({
                firstName: reservationToEdit.guestName.split(' ')[0] || '',
                lastName: reservationToEdit.guestName.split(' ')[1] || '',
                arrivalDate: reservationToEdit.checkInDate || '',
                departureDate: reservationToEdit.checkOutDate || '',
                roomNumber: reservationToEdit.roomNumber || '',
                notes: reservationToEdit.notes || '',
                email: reservationToEdit.email || '',
            });
        }
    }, [reservationsMap]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormState(prevState => ({
            ...prevState,
            [name]: value,
        }))
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError('');

        if (!formState.firstName || !formState.lastName || !formState.arrivalDate || !formState.departureDate) {
            setFormError('Wymagane pola są niewypełnione.');
            return;
        };

        if (formState.email.length && !emailRegex.test(formState.email)) {
            setFormError('Wprowadź poprawny adres e-mail.');
            return;
        }

        if (!reservationId && formState.roomNumber && reservedRooms.has(formState.roomNumber)) {
            setFormError('Pokój o podanym numerze jest już zarezerwowany.');
            return;
        }

        // Create new or update existing reservation
        const status = getTodayDateForDateInput() === formState.arrivalDate ? 'Due In' : 'Reserved';
        const newReservationId = reservationId ? reservationId : `res-${reservations.length + 1}`;
        const newReservation: Reservation = {
            id: newReservationId,
            guestName: `${formState.firstName} ${formState.lastName}`,
            checkInDate: formState.arrivalDate,
            checkOutDate: formState.departureDate,
            status: reservationToEdit ? reservationToEdit.status : status,
            roomNumber: formState.roomNumber,
            notes: formState.notes,
            email: formState.email,
        };
        setReservationsMap(prevState => ({ ...prevState, [newReservationId]: newReservation }));
        navigate('/');
    };

    const navigateToDashboard = () => {
        navigate('/');
    };

    return { reservationId, reservationToEdit, navigateToDashboard, reservationIsEditable, handleFormSubmit, formState, handleInputChange, formError };
};

export default useCreateReservation;