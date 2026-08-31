import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  profileData: jsonb('profile_data'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const diaryEntries = pgTable('diary_entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  entryId: text('entry_id').notNull().unique(),
  cropName: text('crop_name').notNull(),
  plotName: text('plot_name').notNull(),
  activityType: text('activity_type').notNull(),
  date: text('date').notNull(),
  time: text('time'),
  notes: text('notes').notNull(),
  quantity: integer('quantity'),
  unit: text('unit'),
  chemicalUsed: text('chemical_used'),
  cost: integer('cost'),
  imageUrl: text('image_url'),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const cropScans = pgTable('crop_scans', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  scanId: text('scan_id').notNull().unique(),
  cropName: text('crop_name').notNull(),
  diseaseName: text('disease_name').notNull(),
  severity: text('severity').notNull(),
  confidenceScore: integer('confidence_score').notNull(),
  scanData: jsonb('scan_data').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  diaryEntries: many(diaryEntries),
  cropScans: many(cropScans),
}));

export const diaryEntriesRelations = relations(diaryEntries, ({ one }) => ({
  author: one(users, {
    fields: [diaryEntries.userId],
    references: [users.id],
  }),
}));

export const cropScansRelations = relations(cropScans, ({ one }) => ({
  author: one(users, {
    fields: [cropScans.userId],
    references: [users.id],
  }),
}));
