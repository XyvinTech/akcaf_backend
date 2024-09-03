require("dotenv").config();
const {
  FIRE_CLIENT_X509_CERT_URL,
  FIRE_AUTH_PROVIDER_X509_CERT_URL,
  FIRE_TOKEN_URI,
  FIRE_AUTH_URI,
  FIRE_CLIENT_EMAIL,
  FIRE_CLIENT_ID,
  FIRE_PROJECT_ID,
  FIRE_PRIVATE_KEY_ID,
  FIRE_PRIVATE_KEY,
} = process.env;
export const serviceAccount = {
  type: "service_account",
  project_id: FIRE_PROJECT_ID,
  private_key_id: FIRE_PRIVATE_KEY_ID,
  private_key: FIRE_PRIVATE_KEY,
  client_email: FIRE_CLIENT_EMAIL,
  client_id: FIRE_CLIENT_ID,
  auth_uri: FIRE_AUTH_URI,
  token_uri: FIRE_TOKEN_URI,
  auth_provider_x509_cert_url: FIRE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: FIRE_CLIENT_X509_CERT_URL,
};
