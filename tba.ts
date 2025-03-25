import type { TBAApiOptions, TBAEvent, TBATeam } from "./tba.types";

export const DEFAULT_TBA_API_URL = "https://www.thebluealliance.com/api/v3";

export class TBAApi {
  private apiKey: string;
  private baseUrl: string;
  private cache: Map<string, { etag: string; data: unknown }>;

  constructor(options: TBAApiOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || DEFAULT_TBA_API_URL;
    this.cache = new Map();
  }

  private async fetch<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const cachedResponse = this.cache.get(url);

    const headers: Record<string, string> = {
      "X-TBA-Auth-Key": this.apiKey,
    };

    if (cachedResponse?.etag) {
      headers["If-None-Match"] = cachedResponse.etag;
    }

    const response = await fetch(url, { headers });

    if (response.status === 304 && cachedResponse) {
      return cachedResponse.data as T;
    }

    if (!response.ok) {
      throw new Error(
        `TBA API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const etag = response.headers.get("ETag");

    if (etag) {
      this.cache.set(url, { etag, data });
    }

    return data as T;
  }

  async getEvent(eventKey: string): Promise<TBAEvent> {
    return this.fetch(`/event/${eventKey}`);
  }

  async getTeamsAtEvent(eventKey: string): Promise<TBATeam[]> {
    return this.fetch<TBATeam[]>(`/event/${eventKey}/teams`);
  }

  async getTeam(teamKey: string): Promise<TBATeam> {
    return this.fetch<TBATeam>(`/team/${teamKey}`);
  }

  async getTeamEvents(teamKey: string, year: number): Promise<TBAEvent[]> {
    return this.fetch<TBAEvent[]>(`/team/${teamKey}/events/${year}`);
  }
}
