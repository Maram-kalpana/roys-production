-- Soft-delete support: preserve bookings, booking_payments, and monthly payment history
-- when a customer is removed from the Customers list.
ALTER TABLE customers
  MODIFY COLUMN status ENUM('checked-in', 'checked-out', 'deleted') DEFAULT 'checked-in';
