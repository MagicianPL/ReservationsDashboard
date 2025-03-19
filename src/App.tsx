import { useState, useEffect } from 'react'
import './App.css'
import ReservationBoard from './components/ReservationsDashboard/ReservationBoard'
import Header from './components/Header/Header'
import { Reservation } from './types/reservation'
import reservationsData from './data/reservations.json'
import { mapResponseObjectToReservation } from './utils/reservationUtils'

function App() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

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
  )
}

export default App
