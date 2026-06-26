import axios from 'axios';

const valClient = axios.create({
  baseURL: 'https://valorant-api.com/v1',
});

export const getAgents = async () => {
  const response = await valClient.get('/agents?isPlayableCharacter=true');
  return response.data.data;
};

export const getAgentByUuid = async (uuid) => {
  const response = await valClient.get(`/agents/${uuid}`);
  return response.data.data;
};

export const getMaps = async () => {
  const response = await valClient.get('/maps');
  return response.data.data;
};

export const getMapByUuid = async (uuid) => {
  const response = await valClient.get(`/maps/${uuid}`);
  return response.data.data;
};

export const getCompetitiveTiers = async () => {
  const response = await valClient.get('/competitivetiers');
  // Usually the last one is the most recent episode's tiers
  const tiers = response.data.data[response.data.data.length - 1].tiers;
  return tiers;
};

// Map UUIDs to specific items locally to avoid fetching repeatedly
let agentMap = null;
export const getAgentMap = async () => {
  if (agentMap) return agentMap;
  const agents = await getAgents();
  agentMap = {};
  agents.forEach(agent => {
    agentMap[agent.uuid] = agent;
  });
  return agentMap;
}

let mapsMap = null;
export const getMapsMap = async () => {
  if (mapsMap) return mapsMap;
  const maps = await getMaps();
  mapsMap = {};
  maps.forEach(map => {
    mapsMap[map.mapUrl] = map; // Match API often uses mapUrl instead of uuid
  });
  return mapsMap;
}
