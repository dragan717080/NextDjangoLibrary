import psycopg2 # type: ignore
from psycopg2.extras import execute_values, RealDictCursor # type: ignore
from django.conf import settings

POSTGRES_CONNECTION = settings.POSTGRES_CONNECTION

class DatabasePostgres:

    def __init__(self):
        self.connection = psycopg2.connect(POSTGRES_CONNECTION)
        self.cursor = self.connection.cursor(cursor_factory=RealDictCursor)

    def insert_one(self, table, data):
        columns = ', '.join(data.keys())
        values = ', '.join(['%s'] * len(data))
        query = f"INSERT INTO {table} ({columns}) VALUES ({values}) RETURNING *;"
        self.cursor.execute(query, list(data.values()))
        self.connection.commit()
        return self.cursor.fetchone()

    def insert_many(self, table, data_list):
        if not data_list:
            return []

        columns = ', '.join(data_list[0].keys())
        values_template = ', '.join(['%s'] * len(data_list[0]))
        query = f"INSERT INTO {table} ({columns}) VALUES ({values_template});"
        execute_values(self.cursor, query, [tuple(data.values()) for data in data_list])
        self.connection.commit()
        return data_list  # PostgreSQL doesn't support RETURNING for batch inserts

    def find_one(self, table, query):
        query_str, values = self._build_query(table, query)
        self.cursor.execute(f"{query_str} LIMIT 1;", values)
        return self.cursor.fetchone()

    def find_all(self, table, query=None):
        query_str, values = self._build_query(table, query)
        self.cursor.execute(query_str, values)
        return self.cursor.fetchall()

    def find_fields(self, table, query, *fields):
        field_str = ', '.join(fields)
        query_str, values = self._build_query(table, query, fields)
        self.cursor.execute(query_str, values)
        return self.cursor.fetchall()

    def update_one(self, table, query, update):
        set_str = ', '.join([f"{k} = %s" for k in update.keys()])
        query_str, query_values = self._build_query(table, query)
        update_values = list(update.values())
        self.cursor.execute(f"{query_str} SET {set_str} RETURNING *;", query_values + update_values)
        self.connection.commit()
        return self.cursor.fetchone()

    def len_all(self, table):
        self.cursor.execute(f"SELECT COUNT(*) FROM {table};")
        return self.cursor.fetchone()['count']

    def delete_one(self, table, query):
        query_str, values = self._build_query(table, query)
        self.cursor.execute(f"DELETE FROM {query_str} RETURNING *;", values)
        self.connection.commit()
        return self.cursor.fetchone()

    def drop_table(self, table):
        self.cursor.execute(f"DROP TABLE IF EXISTS {table} CASCADE;")
        self.connection.commit()
        return True

    def _build_query(self, table, query, fields=None):
        if fields:
            field_str = ', '.join(fields)
        else:
            field_str = '*'

        if not query:
            query_str = f"SELECT {field_str} FROM {table}"
            return query_str, []

        conditions = []
        values = []
        for key, value in query.items():
            conditions.append(f"{key} = %s")
            values.append(value)
        conditions_str = ' AND '.join(conditions)
        query_str = f"SELECT {field_str} FROM {table} WHERE {conditions_str}"

        return query_str, values

    def execute_raw_query(self, query, params=None):
        self.cursor.execute(query, params)
        if query.strip().upper().startswith('SELECT'):
            return self.cursor.fetchall()
        self.connection.commit()
        return True

    def __del__(self):
        self.cursor.close()
        self.connection.close()
