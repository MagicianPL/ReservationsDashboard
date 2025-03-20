import { useState, useEffect, useMemo } from 'react'
import './App.css'
import ReservationBoard from './components/ReservationsDashboard/ReservationBoard'
import Header from './components/Header/Header'
import { Reservation, ReservationsMap } from './types/reservation'
import reservationsData from './data/reservations.json'
import { mapResponseObjectToReservation } from './utils/reservationUtils'
import { BrowserRouter, Route, Routes } from 'react-router'
import CreateReservation from './components/CreateReservation/CreateReservation'

interface HomePageProps {
  loading: boolean;
  reservations: Reservation[];
  reservationsMap: ReservationsMap;
  setReservationsMap: React.Dispatch<React.SetStateAction<ReservationsMap>>;
};

const HomePage: React.FC<HomePageProps> = ({ loading, reservations, reservationsMap, setReservationsMap }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {loading ? (
          <div className="loading">Ładowanie danych rezerwacji...</div>
        ) : (
          <ReservationBoard reservations={reservations} reservationsMap={reservationsMap} setReservationsMap={setReservationsMap} />
        )}
      </main>
    </div>
  );
};

function App() {
  const [reservationsMap, setReservationsMap] = useState<ReservationsMap>({})
  const reservations = useMemo(() => Object.values(reservationsMap), [reservationsMap])
  const [loading, setLoading] = useState(true)

  const reservedRooms = useMemo(() => {
    const roomNumbers = reservations.map(reservation => reservation.roomNumber);
    return new Set(roomNumbers);
  }, [reservations]);

  useEffect(() => {
    setTimeout(() => {
      try {
        const validReservations = reservationsData.map(mapResponseObjectToReservation);
        const reservationsMap = validReservations.reduce((acc, reservation) => {
          acc[reservation.id] = reservation;
          return acc;
        }, {} as ReservationsMap);
        setReservationsMap(reservationsMap);
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
        <Route path="/" element={<HomePage loading={loading} reservations={reservations} reservationsMap={reservationsMap} setReservationsMap={setReservationsMap} />} />
        <Route path="/add" element={<CreateReservation reservations={reservations} setReservationsMap={setReservationsMap} reservedRooms={reservedRooms} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
