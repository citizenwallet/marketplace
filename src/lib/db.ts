import { Pool, PoolClient, QueryResultRow } from "pg";
import format from "pg-format";
import fs from "fs";

type ErrorType = {
  message: string;
  shortMessage?: string;
};

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.POSTGRES_SSL === "true",
  port: 5432,
});

export let client: PoolClient;

export async function dbconnect() {
  if (!client) {
    client = await pool.connect();
  }
  return client;
}

export const dbclose = function () {
  if (!client) return;

  // @ts-ignore
  client.end();
};

type Primitive = string | number | boolean | undefined | null;

function sqlTemplate(
  strings: TemplateStringsArray,
  ...values: Primitive[]
): [string, Primitive[]] {
  if (!isTemplateStringsArray(strings) || !Array.isArray(values)) {
    throw new Error(
      "It looks like you tried to call `sql` as a function. Make sure to use it as a tagged template.\n" +
        "\tExample: sql`SELECT * FROM users`, not sql('SELECT * FROM users')"
    );
  }

  let result = strings[0] ?? "";

  for (let i = 1; i < strings.length; i++) {
    result += `$${i}${strings[i] ?? ""}`;
  }

  return [result, values];
}

function isTemplateStringsArray(
  strings: unknown
): strings is TemplateStringsArray {
  return (
    Array.isArray(strings) && "raw" in strings && Array.isArray(strings.raw)
  );
}

export async function sql<O extends QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: Primitive[]
) {
  const [query, params] = sqlTemplate(strings, ...values);
  return pool.query<O>(query, params);
}

export async function dbreset() {
  if (!client) throw new Error("db not connected");
  if (process.env.NODE_ENV !== "test") throw new Error("not in test mode");
  if (process.env.POSTGRES_DATABASE?.indexOf("_test") === -1)
    throw new Error("Can only be used on a test database");
  const ddl = fs.readFileSync("./db.ddl.sql", "utf8");
  try {
    await client.query(ddl);
  } catch (e) {
    throw new Error("Error resetting database: " + (e as ErrorType).message);
  }
}

export const db: any = {
  delete: async function (table: string, id: number) {
    await dbconnect();
    const res = await client.query(`DELETE FROM ${table} WHERE id='${id}'`);
    return res;
  },
  insert: async function (table: string, data: any) {
    // console.log(">>> lib/db.insert", table, data);
    await dbconnect();
    delete data.id;
    const keys = Object.keys(data);
    const values = Object.values(data);
    const text = `INSERT INTO ${table}("${keys.join('", "')}") VALUES(${keys
      .map((_, i) => "$" + (i + 1))
      .join(", ")}) RETURNING *`;
    const query = format(text, ...values);
    try {
      const res = await client.query(query, values);
      return res;
    } catch (e) {
      console.log(">>> query", query);
      console.log("!!! error", e);
    }
  },
  select: async function (
    table: string,
    fields: string[],
    where?: undefined | { string: any },
    options?: undefined | any
  ) {
    await dbconnect();
    let query = `SELECT ${
      typeof fields === "string" ? fields : fields.join(", ")
    } FROM ${table}`;

    if (where && Object.keys(where).length > 0) {
      query += ` WHERE ${Object.keys(where)
        .map((key, i) => `"${key}"=%L`)
        .join(" AND ")}`;
      query = format(query, ...Object.values(where));
    }

    if (options && options.limit) {
      query += ` LIMIT ${parseInt(options.limit, 10)}`;
    }

    return await client.query(query);
  },
  update: async function (table: string, data: any) {
    if (!data.id) throw new Error("data.id is required");
    const keys = [],
      values = [];

    for (const [key, value] of Object.entries(data)) {
      if (key === "id") continue;
      if (value === "undefined") continue;
      keys.push(key);
      values.push(value);
    }

    const text = `UPDATE ${table} SET ${keys
      .map((key, i) => `"${key}"=%L`)
      .join(", ")} WHERE id='${data.id}' RETURNING *`;

    const query = format(text, ...values);
    // console.log(">>> update query", query, "values", values);
    try {
      const res = await client.query(query);
      return res;
    } catch (e) {
      console.log("!!! error", e);
    }
  },
};
