/**
 * Query Builder for IGDB API using Apicalypse format
 *
 * The correct order of clauses is:
 * fields → search → where → sort → limit → offset
 *
 * API restrictions:
 * - sort cannot be used with search (text search orders by relevance)
 * - where conditions are joined with & (AND)
 */

export class IGDBQueryBuilder {
  private fieldsList: string[] = [];
  private searchQuery?: string;
  private whereConditions: string[] = [];
  private sortField?: string;
  private sortDirection?: 'asc' | 'desc';
  private limitValue?: number;
  private offsetValue?: number;

  /**
   * Sets the fields to be returned
   * Supports nested fields using dot notation (e.g., 'cover.image_id')
   */
  fields(fields: string[]): this {
    this.fieldsList = fields;
    return this;
  }

  /**
   * Adds text search by relevance
   * IMPORTANT: When used, sort() will be ignored
   */
  search(query: string): this {
    this.searchQuery = query;
    return this;
  }

  /**
   * Adds a where condition
   * Multiple conditions are joined with & (AND)
   */
  where(condition: string): this {
    this.whereConditions.push(condition);
    return this;
  }

  /**
   * Filters by date range (Unix timestamp)
   */
  whereDateRange(field: string, startTimestamp: number, endTimestamp: number): this {
    this.whereConditions.push(
      `${field} >= ${startTimestamp} & ${field} <= ${endTimestamp}`
    );
    return this;
  }

  /**
   * Filters by minimum rating
   */
  whereMinRating(field: string, minRating: number): this {
    this.whereConditions.push(`${field} >= ${minRating}`);
    return this;
  }

  /**
   * Filters non-null values
   */
  whereNotNull(field: string): this {
    this.whereConditions.push(`${field} != null`);
    return this;
  }

  /**
   * Filters by exact value (with quote escaping)
   */
  whereEquals(field: string, value: string | number): this {
    const escapedValue = typeof value === 'string' ? `"${value}"` : value;
    this.whereConditions.push(`${field} = ${escapedValue}`);
    return this;
  }

  /**
   * Excludes games with adult/pornographic content
   * - Filters games with AO (Adults Only) rating
   * - Filters games with erotic theme
   */
  excludeAdultContent(): this {
    // Excludes erotic theme (theme 42)
    this.whereConditions.push('themes != (42)');
    return this;
  }

  /**
   * Sets sorting
   * NOTE: Will be ignored if search() was used
   */
  sort(field: string, direction: 'asc' | 'desc' = 'desc'): this {
    this.sortField = field;
    this.sortDirection = direction;
    return this;
  }

  /**
   * Sets result limit
   */
  limit(value: number): this {
    this.limitValue = value;
    return this;
  }

  /**
   * Sets offset for pagination
   */
  offset(value: number): this {
    this.offsetValue = value;
    return this;
  }

  /**
   * Builds the Apicalypse query as a string
   */
  build(): string {
    const parts: string[] = [];

    // 1. Fields (required)
    if (this.fieldsList.length > 0) {
      parts.push(`fields ${this.fieldsList.join(', ')};`);
    }

    // 2. Search (optional)
    if (this.searchQuery) {
      parts.push(`search "${this.searchQuery}";`);
    }

    // 3. Where (optional)
    if (this.whereConditions.length > 0) {
      parts.push(`where ${this.whereConditions.join(' & ')};`);
    }

    // 4. Sort (optional, ignored if there's search)
    if (!this.searchQuery && this.sortField && this.sortDirection) {
      parts.push(`sort ${this.sortField} ${this.sortDirection};`);
    }

    // 5. Limit (optional)
    if (this.limitValue !== undefined) {
      parts.push(`limit ${this.limitValue};`);
    }

    // 6. Offset (optional)
    if (this.offsetValue !== undefined) {
      parts.push(`offset ${this.offsetValue};`);
    }

    return parts.join(' ');
  }

  /**
   * Returns whether the query has text search
   */
  hasSearch(): boolean {
    return !!this.searchQuery;
  }

  /**
   * Resets the builder for reuse
   */
  reset(): this {
    this.fieldsList = [];
    this.searchQuery = undefined;
    this.whereConditions = [];
    this.sortField = undefined;
    this.sortDirection = undefined;
    this.limitValue = undefined;
    this.offsetValue = undefined;
    return this;
  }
}

/**
 * Helper to create a new builder
 */
export function createIGDBQuery(): IGDBQueryBuilder {
  return new IGDBQueryBuilder();
}

/**
 * Common fields used in game queries
 */
export const COMMON_GAME_FIELDS = [
  'id',
  'name',
  'slug',
  'cover.image_id',
  'artworks.image_id',
  'first_release_date',
  'rating',
  'aggregated_rating',
  'screenshots.image_id',
  'platforms.name',
  'genres.name',
  'summary',
] as const;

export const DETAILED_GAME_FIELDS = [
  ...COMMON_GAME_FIELDS,
  'storyline',
  'url',
  'involved_companies.company.name',
  'involved_companies.developer',
  'involved_companies.publisher',
  'age_ratings.rating',
  'age_ratings.category',
] as const;
