import { ResourceFetcher } from "./interfaces";

export class FetchWrapper implements ResourceFetcher {
  public async fetch<T>(url: string): Promise<T> {
    const request = await fetch(url);
    const response = await request.json();
    if (request.status > 299) {
      throw Error(`Failed to fetch resource: ${request.status} ${response.message}`);
    }
    return response;
  }
}