import { pgTable, serial, varchar } from "drizzle-orm/pg-core";



export const clientes = pgTable("clientes", {

  id: serial("id").primaryKey(),

  cnpj: varchar("cnpj", { length: 14 }).notNull().unique(),

  nome: varchar("nome", { length: 100 }).notNull(),

  nomeFantasia: varchar("nome_fantasia", { length: 100 }),

  cep: varchar("cep", { length: 10 }),

  logradouro: varchar("logradouro", { length: 10 }),

  bairro: varchar("bairro", { length: 100 }),

  cidade: varchar("cidade", { length: 100 }),

  uf: varchar("uf", { length: 2 }),

  complemento: varchar("complemento", { length: 100 }),

  email: varchar("email", { length: 100 }),

  telefone: varchar("telefone", { length: 15 }),

});

