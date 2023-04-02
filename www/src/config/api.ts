interface ApiConfig {
  wsProtocol: string;
  wsEndpoint: string;
  httpProtocol: string;
  hostName: string;
  port: string;
}

export const getApiConfig = (location: Location): ApiConfig => {
  const apiHost = process.env.API_HOST;
  const apiPort = process.env.API_PORT;

  return {
    wsProtocol: location.protocol.startsWith('https') ? 'wss:' : 'ws:',
    httpProtocol: location.protocol,
    wsEndpoint: 'ws',
    hostName: apiHost || 'http://wrong',
    port: apiPort || '8006'
  };
};
