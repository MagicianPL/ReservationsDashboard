import React, { useCallback, useEffect } from 'react';
import Header from '../Header/Header';
import '../../App.css';
import './CreateReservation.css';
import { getTodayDateForDateInput } from '../../utils/dateFormatters';
import { Reservation, ReservationsMap } from '../../types/reservation';
import { emailRegex } from '../../utils/reservationUtils';
import { useNavigate, useParams } from 'react-router';

interface CreateReservationProps {
    reservations: Reservation[];
    setReservationsMap: React.Dispatch<React.SetStateAction<ReservationsMap | null>>;
    reservedRooms: Set<string | undefined>;
    reservationsMap?: ReservationsMap | null;
}

const CreateReservation: React.FC<CreateReservationProps> = ({ reservations, setReservationsMap, reservedRooms, reservationsMap }) => {
    const { reservationId } = useParams();
    const reservationToEdit = (reservationsMap && reservationId) ? reservationsMap[reservationId] : undefined;
    const reservationIsEditable = reservationToEdit?.status === 'Reserved' || reservationToEdit?.status === 'Due In';

    const [formState, setFormState] = React.useState({
        firstName: '',
        lastName: '',
        arrivalDate: '',
        departureDate: '',
        roomNumber: '',
        notes: '',
        email: '',
    });
    const [formError, setFormError] = React.useState('');
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

    const renderContent = useCallback(() => {
        if (reservationId && !reservationsMap) {
            return (
                <p className='info'>Ładowanie danych rezerwacji...</p>
            );
        }

        if (reservationId && reservationsMap && !reservationToEdit) {
            return (
                <>
                    <p className='info form-error'>Nie znaleziono rezerwacji o id: {reservationId}</p>
                    <button className='info-button' onClick={navigateToDashboard}>Wróć do Dashboardu</button>
                </>
            );
        }

        if (reservationId && reservationsMap && reservationToEdit && !reservationIsEditable) {
            return (
                <>
                    <p className='info form-error'>Z powodu statusu rezerwacji nie możesz jej edytować.</p>
                    <button className='info-button' onClick={navigateToDashboard}>Wróć do Dashboardu</button>
                </>
            );
        };

        return (
            <>
                <h1 className='page-title'>{`${reservationId ? 'Edytuj rezerwację' : 'Dodaj rezerwację'}`}</h1>
                <form onSubmit={handleFormSubmit}>
                    <div className='form-content'>
                        <label>
                            Imię*:
                            <input type="text" className='form-input' name='firstName' value={formState.firstName} onChange={handleInputChange} />
                        </label>
                        <label>
                            Nazwisko*:
                            <input type="text" className='form-input' name='lastName' value={formState.lastName} onChange={handleInputChange} />
                        </label>
                        {!reservationId && (
                            <>
                                <label>
                                    Data przyjazdu*:
                                    <input type="date" className='form-input' name='arrivalDate' value={formState.arrivalDate} onChange={handleInputChange} min={getTodayDateForDateInput()} />
                                </label>
                                <label>
                                    Data wyjazdu*:
                                    <input type="date" className='form-input' name='departureDate' value={formState.departureDate} onChange={handleInputChange} min={formState.arrivalDate || undefined} />
                                </label>
                                <label>
                                    Numer pokoju:
                                    <input type="number" className='form-input' name='roomNumber' value={formState.roomNumber} onChange={handleInputChange} />
                                </label>
                            </>
                        )}
                        <label>
                            Notatka:
                            <input type="text" className='form-input' name='notes' value={formState.notes} onChange={handleInputChange} />
                        </label>
                        <label>
                            Adres e-mail:
                            <input type="email" className='form-input' name='email' value={formState.email} onChange={handleInputChange} />
                        </label>
                        <p className='form-error'>{formError}</p>
                        <button type="submit">{`${reservationId ? 'Zapisz' : 'Dodaj rezerwację'}`}</button>
                    </div>
                </form>
            </>
        );
    }, [reservationId, reservationsMap, reservationToEdit, formState, formError]);

    return (
        <div className="app-container">
            <Header />
            <main className="main-content">
                {renderContent()}
            </main>
        </div>
    );
};

export default CreateReservation; 