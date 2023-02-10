interface ApiConfig {
  wsProtocol: string;
  wsEndpoint: string;
  httpProtocol: string;
  hostName: string;
  port: string;
}

export const getApiConfig = (location: Location): ApiConfig => {
  return {
    wsProtocol: location.protocol.startsWith('https') ? 'wss:' : 'ws:',
    httpProtocol: location.protocol,
    wsEndpoint: 'ws',
    hostName: location.hostname,
    port: '8080'
  };
};
