export interface QueryResult<T = Record<string, unknown>> { rows: T[]; rowCount?: number | null; }
export interface SqlDatabase { query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<QueryResult<T>>; }
