import axios from 'axios';

const riotAsiaClient = axios.create({
  baseURL: '/riot-asia',
});

const riotApClient = axios.create({
  baseURL: '/riot-ap',
});

// Use interceptor to attach key from localStorage dynamically
const addAuthHeader = (config) => {
  const apiKey = localStorage.getItem('riotApiKey') || '';
  config.headers['X-Riot-Token'] = apiKey;
  return config;
};

riotAsiaClient.interceptors.request.use(addAuthHeader);
riotApClient.interceptors.request.use(addAuthHeader);

export const getAccountByRiotId = async (gameName, tagLine) => {
  try {
    const response = await riotAsiaClient.get(`/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching account:', error);
    throw error;
  }
};

export const getMatchlist = async (puuid) => {
  try {
    const response = await riotApClient.get(`/val/match/v1/matchlists/by-puuid/${puuid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching matchlist:', error);
    throw error;
  }
};

export const getMatchDetails = async (matchId) => {
  try {
    const response = await riotApClient.get(`/val/match/v1/matches/${matchId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching match details:', error);
    throw error;
  }
};

export const getLeaderboard = async () => {
  try {
    // We need an actId. Let's assume we can fetch the latest act or pass it. 
    // For now, we'll implement a function to get content to find the active act.
    const actId = await getActiveActId();
    if (!actId) throw new Error("No active act found");
    const response = await riotApClient.get(`/val/ranked/v1/leaderboards/by-act/${actId}?size=500`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

const getActiveActId = async () => {
  try {
    const response = await riotApClient.get('/val/content/v1/contents');
    const acts = response.data.acts;
    // Find the act that is active and is not a "null" act (often there's a competitive act)
    const activeAct = acts.find(act => act.isActive && act.type === 'act');
    return activeAct ? activeAct.id : null;
  } catch (error) {
    console.error('Error fetching content/acts:', error);
    return null;
  }
};
