import axios, { AxiosResponse } from 'axios';
import Redis from 'ioredis';
import pLimit from 'p-limit';

const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
const API_SPORTS_URL = 'https://v3.football.api-sports.io/teams?name=';
const API_KEY = process.env.API_SPORTS_KEY || 'YOUR_API_KEY';
const DEFAULT_BADGE = '/soccerball.svg';

const limit = pLimit(5);

interface ApiSportsTeam {
  team: {
    name: string;
    logo: string;
  };
}

interface ApiSportsResponse {
  results: number;
  response: ApiSportsTeam[];
}

async function getTeamBadge(team: string): Promise<string> {
  if (!team) return DEFAULT_BADGE;
  const cacheKey = `teamBadge:${team.toLowerCase()}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Cache hit: ${team} -> ${cached}`);
      return cached;
    }
  } catch (err: unknown) {
    console.warn(`Redis error for ${team}: ${(err as Error).message}`);
  }

  try {
    const response: AxiosResponse<ApiSportsResponse> = await axios.get(
      `${API_SPORTS_URL}${encodeURIComponent(team)}`,
      {
        headers: { 'x-rapidapi-key': API_KEY },
        timeout: 5000,
      }
    );

    if (response.data.results > 0) {
      const logo = response.data.response[0]?.team?.logo;
      if (logo) {
        console.log(`Found in API-SPORTS: ${team} -> ${logo}`);
        await redis.set(cacheKey, logo, 'EX', 60 * 60 * 24 * 7);
        return logo;
      }
    }

    console.warn(`No logo in API-SPORTS: ${team}`);
  } catch (err: unknown) {
    console.error(`API-SPORTS failed for ${team}: ${(err as Error).message}`);
  }

  return DEFAULT_BADGE;
}

export async function getAllBadges(
  teams: string[]
): Promise<Record<string, string>> {
  const unique = [...new Set(teams)];
  const results: Record<string, string> = {};

  await Promise.all(
    unique.map((team) =>
      limit(async () => {
        results[team] = await getTeamBadge(team);
      })
    )
  );

  return results;
}
