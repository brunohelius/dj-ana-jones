import { readCollection, writeCollection } from '@/lib/dataStore';

export type EventSignupInput = {
  eventSlug: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  guestCount: number;
  notes?: string;
};

export type EventSignup = EventSignupInput & {
  id: string;
  createdAt: string;
};

const signupsFile = 'event-signups.json';

const readSignups = async (): Promise<EventSignup[]> => {
  return readCollection<EventSignup>(signupsFile);
};

const writeSignups = async (signups: EventSignup[]) => {
  await writeCollection<EventSignup>(signupsFile, signups);
};

export const listEventSignups = async (eventSlug?: string) => {
  const signups = await readSignups();

  return signups
    .filter((signup) => (eventSlug ? signup.eventSlug === eventSlug : true))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const createEventSignup = async (input: EventSignupInput) => {
  const signups = await readSignups();

  const signup: EventSignup = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  signups.push(signup);
  await writeSignups(signups);

  return signup;
};
