/**
 * @interface IHasId
 * @description A simple interface to ensure an object has an 'id' property.
 */
export interface IHasId {
  id: number | string;
}

/**
 * @interface IBaseRepository
 * @description A generic interface that defines a standard set of data access operations (CRUD)
 * for any given entity. It uses TypeScript generics to ensure type safety.
 * @template TSelect - The type of the entity as it is returned from the database. It must have an 'id' property.
 * @template TInsert - The type of the data used to insert a new entity into the database.
 */
export interface IBaseRepository<TSelect extends IHasId, TInsert> {
  /**
   * @method save
   * @description Inserts a new entity record into the database.
   * @param {TInsert} data - The data for the new entity.
   */
  save(data: TInsert): Promise<void>;

  /**
   * @method findMany
   * @description Retrieves a list of entities based on search criteria and pagination.
   * @param {object} params - The query parameters.
   * @param {number} [params.page=1] - The current page number.
   * @param {number} [params.limit=10] - The number of results per page.
   * @param {string} [params.search=""] - The search string for the entity's title.
   * @returns {Promise<Array<TSelect>>} A promise that resolves to an array of entities.
   */
  findMany(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<Array<TSelect>>;

  /**
   * @method findById
   * @description Retrieves a single entity by its unique ID.
   * @param {TSelect['id']} id - The ID of the entity to retrieve.
   * @returns {Promise<TSelect | undefined>} A promise that resolves to the found entity or undefined.
   */
  findById(id: TSelect["id"]): Promise<TSelect | undefined>;

  /**
   * @method update
   * @description Updates an existing entity record.
   * @param {TSelect['id']} id - The ID of the entity to update.
   * @param {Partial<Omit<TSelect, "id">>} data - The partial data to update the entity with.
   */
  update(id: TSelect["id"], data: Partial<Omit<TSelect, "id">>): Promise<void>;

  /**
   * @method delete
   * @description Deletes an entity record by its ID.
   * @param {TSelect['id']} id - The ID of the entity to delete.
   */
  delete(id: TSelect["id"]): Promise<void>;
}
