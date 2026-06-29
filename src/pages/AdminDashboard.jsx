import { useEffect, useState } from 'react'
import { LogIn, LogOut, Bed, Users, Receipt } from 'lucide-react'
import StatCard from '../components/StatCard'
import PageTransition from '../components/PageTransition'
import { StatCardSkeleton } from '../components/LoadingSkeleton'
import { useHotel, useBookings, useMonthlyPayments } from '../hooks/useStore'
import { computeHotelStats } from '../utils/helpers'
import { computeMonthlyPaymentStats } from '../utils/monthlyPaymentHelpers'
import { motion } from 'framer-motion'

const AdminDashboard = () => {
  const hotel = useHotel()
  const { list: bookings } = useBookings()
  const { tenants } = useMonthlyPayments()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const stats = computeHotelStats(hotel, { list: [] }, { list: bookings })
  const monthlyStats = computeMonthlyPaymentStats(tenants)

  const cards = [
    { title: "Today's Check-ins", value: stats.todayCheckIns, icon: LogIn, color: 'emerald' },
    { title: "Today's Check-outs", value: stats.todayCheckOuts, icon: LogOut, color: 'rose' },
    { title: 'Total Beds', value: stats.totalBeds, icon: Bed, color: 'slate', subtitle: `${stats.occupiedBeds} occ · ${stats.vacantBeds} vac` },
    { title: 'Vacant Beds', value: stats.vacantBeds, icon: Bed, color: 'royal' },
    { title: 'Occupied Beds', value: stats.occupiedBeds, icon: Users, color: 'violet' },
    { title: 'Monthly Tenants', value: monthlyStats.monthlyTenants, icon: Receipt, color: 'royal' },
  ]

  return (
    <PageTransition className="page-container">
        <div className="mb-6">
          <h2 className="section-title">Today's Overview</h2>
          <p className="text-slate-500 mt-1">
            {stats.totalBeds} beds · {stats.occupiedBeds} occupied · {stats.vacantBeds} vacant
          </p>
        </div>

        <div className="dashboard-grid mb-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
            : cards.map((card, i) => (
              <motion.div key={card.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}>
                <StatCard {...card} />
              </motion.div>
            ))}
        </div>
      </PageTransition>
  )
}

export default AdminDashboard
