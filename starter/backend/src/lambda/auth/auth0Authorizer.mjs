import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

export async function handler(event) {
  try {

    logger.info(`[auth] received request: ${event.authorizationToken}`)

    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJKsUxgBw8bAQ4MA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1iN3h4eDZxcm95b3R6NG84LnVzLmF1dGgwLmNvbTAeFw0yNDA0MjYx
MjQwMzVaFw0zODAxMDMxMjQwMzVaMCwxKjAoBgNVBAMTIWRldi1iN3h4eDZxcm95
b3R6NG84LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBALFKuF0FPSNiBtQu8jSKy6SdXVNh4HeibedbprNDlspToJzXQj4Ea8W0tFaU
NN3/0plbX2KX7vDGJksWF2qWAaxp0JBFPpgqfQrsxb/vMRu61sCFwODxF7tICExB
is+mlgol4A0OA3fkZ08DDaPVt9QJNqRIeGI0qo55utpH5z0jJu7ZoMrmVBtYvrMd
kysjW5qzobaSaoI8McgWiPdP8J/S2/43ML4RT6Y6yTwvn1N3UKzzVD1+sn5J6LfV
J0FNFmgBZmABr1ZG2t6FfCG8UjhLw75K1V/E8uuRUxnbzFp4i3W3efBn6k3rex8B
FIN5btzrdSW/wWkC6yQfGZGzfzMCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUAbJJ7gtWf035A7o5cwg3R2OggPgwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQCEuVWXanTdvIl2xsNskmf4cWZ6p1/sXZNdzXqlI5EX
66YHq1VJz732s5Xf90AD5ZaDM+LE9DRtzwu2V7OYJet00jgBWcjvSu/6bq2sF0ID
X+zG1yVFGhqpOxaBElrcUOG9CJY0CPadnA2rCM+BSSxWd+xwskcgEgOy1oQpVVmF
JVkQ2eqM9JtM0bbvaizdjtVoNHSA5EGCzLdV6wfhNUS9zyi/yIKRbrjAg6WP4z3i
7lU00pF52tKl+1KnV+JhL3jyPVs6te4gRLYJ8TyObiqDZ3MWZdHnqigNKrjKEozH
zNTKhul5HmX3Nn68OpxPeEtByY2/RCqjPWK2qe2yUzN7
-----END CERTIFICATE-----`;

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
  const jwt = jsonwebtoken.decode(token, { complete: true })
  return jwt;
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
