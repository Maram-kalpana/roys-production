import { Avatar, Chip, Divider } from '@mui/material'
import { Mail, Phone, MapPin, CreditCard, Calendar } from 'lucide-react'
import { formatCurrency, formatDate, getImageSrc } from '../utils/helpers'

const ProfileCard = ({ customer, booking }) => (
  <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
    <div className="gradient-royal p-6 text-white text-center">
      <Avatar src={getImageSrc(customer.photo)} alt={customer.name} sx={{ width: 96, height: 96, mx: 'auto', border: '4px solid rgba(255,255,255,0.3)' }} />
      <h2 className="mt-4 text-xl font-semibold font-[Poppins]">{customer.name}</h2>
      <Chip label={customer.status} size="small" sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', textTransform: 'capitalize' }} />
    </div>
    <div className="p-6 space-y-4">
      <InfoRow icon={Phone} label="Phone" value={customer.phone} />
      <InfoRow icon={Mail} label="Email" value={customer.email} />
      <InfoRow icon={MapPin} label="Address" value={`${customer.address}, ${customer.city}, ${customer.state}`} />
      {customer.roomNumber && (
        <InfoRow icon={Calendar} label="Room / Bed" value={`Room ${customer.roomNumber} · Bed ${customer.bedNumber}`} />
      )}
      {booking && (
        <>
          <Divider />
          <InfoRow icon={CreditCard} label="Total Amount" value={formatCurrency(booking.totalAmount)} />
          <InfoRow icon={CreditCard} label="Balance" value={formatCurrency(booking.balanceAmount)} highlight={booking.balanceAmount > 0} />
        </>
      )}
    </div>
  </div>
)

const InfoRow = ({ icon: Icon, label, value, highlight }) => (
  <div className="flex items-start gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-sm font-medium ${highlight ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>
    </div>
  </div>
)

export default ProfileCard
