import { ResourceFetcher } from "./interfaces";

export class FetchWrapper implements ResourceFetcher {
  public async fetch<T>(url: string): Promise<T> {
    const request = await fetch(url);
    const response = await request.json();
    return response;
  }
}