import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

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

const dataDirectory = path.join(process.cwd(), 'data');
const signupsFile = path.join(dataDirectory, 'event-signups.json');

const ensureSignupsFile = async () => {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(signupsFile, 'utf8');
  } catch {
    await writeFile(signupsFile, '[]', 'utf8');
  }
};

const readSignups = async (): Promise<EventSignup[]> => {
  await ensureSignupsFile();

  try {
    const content = await readFile(signupsFile, 'utf8');
    const parsed = JSON.parse(content);

    return Array.isArray(parsed) ? (parsed as EventSignup[]) : [];
  } catch {
    return [];
  }
};

const writeSignups = async (signups: EventSignup[]) => {
  await ensureSignupsFile();
  await writeFile(signupsFile, JSON.stringify(signups, null, 2), 'utf8');
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
