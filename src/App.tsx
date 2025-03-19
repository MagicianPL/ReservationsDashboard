import { useState, useEffect, useMemo } from 'react'
import './App.css'
import ReservationBoard from './components/ReservationsDashboard/ReservationBoard'
import Header from './components/Header/Header'
import { Reservation } from './types/reservation'
import reservationsData from './data/reservations.json'
import { mapResponseObjectToReservation } from './utils/reservationUtils'
import { BrowserRouter, Route, Routes } from 'react-router'
import CreateReservation from './components/CreateReservation/CreateReservation'

interface HomePageProps {
  loading: boolean;
  reservations: Reservation[];
};

const HomePage: React.FC<HomePageProps> = ({ loading, reservations }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {loading ? (
          <div className="loading">Ładowanie danych rezerwacji...</div>
        ) : (
          <ReservationBoard reservations={reservations} />
        )}
      </main>
    </div>
  );
};

function App() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  const reservedRooms = useMemo(() => {
    const roomNumbers = reservations.map(reservation => reservation.roomNumber);
    return new Set(roomNumbers);
  }, [reservations]);

  useEffect(() => {
    setTimeout(() => {
      try {
        const validReservations = reservationsData.map(mapResponseObjectToReservation);
        setReservations(validReservations);
      } catch (error) {
        console.error('Błąd podczas przetwarzania danych rezerwacji:', error);
      } finally {
        setLoading(false);
      }
    }, 800)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage loading={loading} reservations={reservations} />} />
        <Route path="/add" element={<CreateReservation reservations={reservations} setReservations={setReservations} reservedRooms={reservedRooms} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
