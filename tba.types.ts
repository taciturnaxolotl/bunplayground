export interface TBAApiOptions {
  apiKey: string;
  baseUrl?: string;
}

export interface TBAEvent {
  address: string;
  city: string;
  country: string;
  district: null | string;
  division_keys: string[];
  end_date: string;
  event_code: string;
  event_type: number;
  event_type_string: string;
  first_event_code: string;
  first_event_id: null | string;
  gmaps_place_id: string;
  gmaps_url: string;
  key: string;
  lat: number;
  lng: number;
  location_name: string;
  name: string;
  parent_event_key: null | string;
  playoff_type: number;
  playoff_type_string: string;
  postal_code: string;
  short_name: string;
  start_date: string;
  state_prov: string;
  timezone: string;
  webcasts: Array<{
    channel: string;
    type: string;
  }>;
  website: null | string;
  week: number;
  year: number;
}

export interface TBATeam {
  address: string | null;
  city: string;
  country: string;
  gmaps_place_id: string | null;
  gmaps_url: string | null;
  key: string;
  lat: number | null;
  lng: number | null;
  location_name: string | null;
  motto: string | null;
  name: string;
  nickname: string;
  postal_code: string | null;
  rookie_year: number;
  school_name: string;
  state_prov: string;
  team_number: number;
  website: string | null;
}
