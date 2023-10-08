export interface PagedResponse<T> {
  totalCount: number
  pageNumber: number
  pageSize: number
  pageOffset: number
  pageTotal: number
  elements: T[]
}
