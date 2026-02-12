import { readCollection, writeCollection } from '@/lib/dataStore';

export type BookingRequestInput = {
  name: string;
  email?: string;
  phone?: string;
  eventType: string;
  eventDate?: string;
  city?: string;
  message?: string;
};

export type BookingRequest = BookingRequestInput & {
  id: string;
  createdAt: string;
};

const bookingsFile = 'booking-requests.json';

const readBookings = async (): Promise<BookingRequest[]> => {
  return readCollection<BookingRequest>(bookingsFile);
};

const writeBookings = async (requests: BookingRequest[]) => {
  await writeCollection<BookingRequest>(bookingsFile, requests);
};

export const listBookingRequests = async () => {
  const requests = await readBookings();

  return requests.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const createBookingRequest = async (input: BookingRequestInput) => {
  const requests = await readBookings();

  const booking: BookingRequest = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  requests.push(booking);
  await writeBookings(requests);

  return booking;
};
