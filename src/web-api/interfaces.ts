export interface ResourceFetcher {
  fetch<T>(url: string): Promise<T>;
}