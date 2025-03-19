import React from 'react';
import Header from '../Header/Header';
import '../../App.css';
import './CreateReservation.css';
import { getTodayDateForDateInput } from '../../utils/dateFormatters';
import { Reservation } from '../../types/reservation';
import { emailRegex } from '../../utils/reservationUtils';
import { useNavigate } from 'react-router';

interface CreateReservationProps {
    reservations: Reservation[];
    setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
    reservedRooms: Set<string | undefined>;
}

const CreateReservation: React.FC<CreateReservationProps> = ({ reservations, setReservations, reservedRooms }) => {
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

        if (formState.roomNumber && reservedRooms.has(formState.roomNumber)) {
            setFormError('Pokój o podanym numerze jest już zarezerwowany.');
            return;
        }

        // Create new reservation and set it to a state
        const status = getTodayDateForDateInput() === formState.arrivalDate ? 'Due In' : 'Reserved';
        const newReservation: Reservation = {
            id: `res-${reservations.length + 1}`,
            guestName: `${formState.firstName} ${formState.lastName}`,
            checkInDate: formState.arrivalDate,
            checkOutDate: formState.departureDate,
            status,
            roomNumber: formState.roomNumber,
            notes: formState.notes,
            email: formState.email,
        };
        setReservations(prevState => [...prevState, newReservation]);
        navigate('/');
    };


    return (
        <div className="app-container">
            <Header />
            <main className="main-content">
                <h1 className='page-title'>Dodaj rezerwację</h1>
                <form onSubmit={handleFormSubmit}>
                    <div className='form-content'>
                        <label>
                            Imię*:
                            <input type="text" className='form-input' name='firstName' value={formState.firstName} onChange={e => handleInputChange(e)} />
                        </label>
                        <label>
                            Nazwisko*:
                            <input type="text" className='form-input' name='lastName' value={formState.lastName} onChange={e => handleInputChange(e)} />
                        </label>
                        <label>
                            Data przyjazdu*:
                            <input type="date" className='form-input' name='arrivalDate' value={formState.arrivalDate} onChange={e => handleInputChange(e)} min={getTodayDateForDateInput()} />
                        </label>
                        <label>
                            Data wyjazdu*:
                            <input type="date" className='form-input' name='departureDate' value={formState.departureDate} onChange={e => handleInputChange(e)} min={formState.arrivalDate || undefined} />
                        </label>
                        <label>
                            Numer pokoju:
                            <input type="number" className='form-input' name='roomNumber' value={formState.roomNumber} onChange={e => handleInputChange(e)} />
                        </label>
                        <label>
                            Notatka:
                            <input type="text" className='form-input' name='notes' value={formState.notes} onChange={e => handleInputChange(e)} />
                        </label>
                        <label>
                            Adres e-mail:
                            <input type="email" className='form-input' name='email' value={formState.email} onChange={e => handleInputChange(e)} />
                        </label>
                        <p className='form-error'>{formError}</p>
                        <button type="submit">Dodaj rezerwację</button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default CreateReservation; 