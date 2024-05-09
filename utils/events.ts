import 'server-only'
import { getCurrentUser } from './users'
import { db } from '@/db/db'
import { and, count, eq, ne, not } from 'drizzle-orm'
import { events, rsvps } from '@/db/schema'

export const getEventsForDashboard = async () => {
  const user = await getCurrentUser()

  const data = await db
    .select({
      rsvps: count(rsvps.id),
      name: events.name,
      startDate: events.startOn,
      status: events.status,
      id: events.id,
    })
    .from(events)
    .leftJoin(rsvps, eq(rsvps.eventId, events.id))
    .where(and(eq(events.createdById, user.id), ne(rsvps.status, 'not-going')))
    .execute()

  return data ?? []
}
