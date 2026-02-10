CREATE TABLE "clientes" (
	"id" serial PRIMARY KEY NOT NULL,
	"cnpj" varchar(14) NOT NULL,
	"nome" varchar(100) NOT NULL,
	"nome_fantasia" varchar(100),
	"cep" varchar(10),
	"logradouro" varchar(10),
	"bairro" varchar(100),
	"cidade" varchar(100),
	"uf" varchar(2),
	"complemento" varchar(100),
	"email" varchar(100),
	"telefone" varchar(15),
	CONSTRAINT "clientes_cnpj_unique" UNIQUE("cnpj")
);
