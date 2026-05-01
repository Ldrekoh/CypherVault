import { relations } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const keyTypeEnum = pgEnum("key_type", ["primary", "recovery"]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ─────────────────────────────────────────────────────────────────────────────
// TABLES MÉTIER
// ─────────────────────────────────────────────────────────────────────────────

// 1. Coffre-fort des clés
//    Lié à user.id (text) — id séparé pour supporter la rotation de clés
export const userKeys = pgTable(
  "user_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    publicKey: text("public_key").notNull(),
    encryptedPrivateKey: text("encrypted_private_key").notNull(),
    recoveryHash: text("recovery_hash").notNull(),
    salt: text("salt").notNull(),
    // "primary" | "recovery"
    keyType: keyTypeEnum("key_type").notNull().default("primary"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("user_keys_userId_idx").on(table.userId)],
);

// 2. Dossiers (déclaré avant vault_items — évite la ref circulaire)
export const folders = pgTable(
  "folders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").notNull().default("#4c51bf"), // Couleur par défaut
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("folders_userId_idx").on(table.userId),
    index("folders_deletedAt_idx").on(table.deletedAt),
  ],
);

// 3. Entrées du coffre (métadonnées)
//    title / websiteUrl en clair → recherche côté serveur possible.
//    Si confidentialité des métadonnées requise : les déplacer dans
//    vault_secrets et gérer un index de recherche chiffré séparé.
export const vaultItems = pgTable(
  "vault_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    folderId: uuid("folder_id").references((): AnyPgColumn => folders.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    websiteUrl: text("website_url"),
    isFavorite: boolean("is_favorite").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("vault_items_userId_idx").on(table.userId),
    index("vault_items_folderId_idx").on(table.folderId),
    index("vault_items_deletedAt_idx").on(table.deletedAt),
  ],
);

// 4. Secrets chiffrés
//    userId dénormalisé → autorisation sans JOIN sur vault_items
export const vaultSecrets = pgTable(
  "vault_secrets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => vaultItems.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // Payload PGP chiffré : { login, password, notes, totp, ... }
    encryptedPayload: text("encrypted_payload").notNull(),
    payloadVersion: integer("payload_version").notNull().default(1),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("vault_secrets_itemId_idx").on(table.itemId),
    index("vault_secrets_userId_idx").on(table.userId),
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),

  // Relations métier
  keys: many(userKeys),
  folders: many(folders),
  vaultItems: many(vaultItems),
  vaultSecrets: many(vaultSecrets),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// Métier
export const userKeysRelations = relations(userKeys, ({ one }) => ({
  user: one(user, { fields: [userKeys.userId], references: [user.id] }),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  user: one(user, { fields: [folders.userId], references: [user.id] }),
  items: many(vaultItems),
}));

export const vaultItemsRelations = relations(vaultItems, ({ one }) => ({
  user: one(user, { fields: [vaultItems.userId], references: [user.id] }),
  folder: one(folders, {
    fields: [vaultItems.folderId],
    references: [folders.id],
  }),
  secret: one(vaultSecrets, {
    fields: [vaultItems.id],
    references: [vaultSecrets.itemId],
  }),
}));

export const vaultSecretsRelations = relations(vaultSecrets, ({ one }) => ({
  item: one(vaultItems, {
    fields: [vaultSecrets.itemId],
    references: [vaultItems.id],
  }),
  user: one(user, { fields: [vaultSecrets.userId], references: [user.id] }),
}));

export const schema = {
  user,
  session,
  account,
  verification,
  userKeys,
  folders,
  vaultItems,
  vaultSecrets,
  userRelations,
  sessionRelations,
  accountRelations,
  userKeysRelations,
  foldersRelations,
  vaultItemsRelations,
  vaultSecretsRelations,
};
