import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

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

const dataDirectory = path.join(process.cwd(), 'data');
const bookingsFile = path.join(dataDirectory, 'booking-requests.json');

const ensureBookingsFile = async () => {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(bookingsFile, 'utf8');
  } catch {
    await writeFile(bookingsFile, '[]', 'utf8');
  }
};

const readBookings = async (): Promise<BookingRequest[]> => {
  await ensureBookingsFile();

  try {
    const content = await readFile(bookingsFile, 'utf8');
    const parsed = JSON.parse(content);

    return Array.isArray(parsed) ? (parsed as BookingRequest[]) : [];
  } catch {
    return [];
  }
};

const writeBookings = async (requests: BookingRequest[]) => {
  await ensureBookingsFile();
  await writeFile(bookingsFile, JSON.stringify(requests, null, 2), 'utf8');
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
