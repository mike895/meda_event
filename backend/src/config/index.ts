const jwtSecret = process.env.JWT_SECRET;
const omdbApiKey = process.env.OMDB_API_KEY;
const authMicroserviceBaseUrl = process.env.AUTH_MICROSERVICE_BASE_URL;
let webClientHostedUrl = process.env.WEB_CLIENT_URL;
const socketServerToken = process.env.SOCKET_SERVER_TOKEN;

if (process.env.NODE_ENV !== 'production') {
  webClientHostedUrl = 'http://localhost:3000';
}
export {
  jwtSecret,
  omdbApiKey,
  authMicroserviceBaseUrl,
  webClientHostedUrl,
  socketServerToken,
};
