import jwt from 'jsonwebtoken';
//@ts-ignore
import BigCommerce from 'node-bigcommerce';
import { prisma } from './prisma';
import type {
  ApiConfig,
  QueryParams,
  SessionContextProps,
  SessionProps,
} from '../types';

const { API_URL, AUTH_CALLBACK, CLIENT_ID, CLIENT_SECRET, JWT_KEY, LOGIN_URL } =
  process.env;

// Used for internal configuration; 3rd party apps may remove
const apiConfig: ApiConfig = {};
if (API_URL && LOGIN_URL) {
  apiConfig.apiUrl = API_URL;
  apiConfig.loginUrl = LOGIN_URL;
} else {
  throw new Error('Missing API_URL or LOGIN_URL environment variable');
}

// Create BigCommerce instance
// https://github.com/bigcommerce/node-bigcommerce/
const bigcommerce = new BigCommerce({
  logLevel: 'info',
  clientId: CLIENT_ID,
  secret: CLIENT_SECRET,
  callback: AUTH_CALLBACK,
  responseType: 'json',
  headers: { 'Accept-Encoding': '*' },
  apiVersion: 'v3',
  ...apiConfig,
});

const bigcommerceSigned = new BigCommerce({
  secret: CLIENT_SECRET,
  responseType: 'json',
});

export function bigcommerceClient(
  accessToken: string,
  storeHash: string,
  apiVersion = 'v3',
) {
  return new BigCommerce({
    clientId: CLIENT_ID,
    accessToken,
    storeHash,
    responseType: 'json',
    apiVersion,
    ...apiConfig,
  });
}

// Authorizes app on install
export function getBCAuth(query: QueryParams) {
  return bigcommerce.authorize(query);
}

// Verifies app on load/ uninstall
export function getBCVerify({ signed_payload_jwt }: QueryParams) {
  return bigcommerceSigned.verifyJWT(signed_payload_jwt);
}

export async function setSession(session: SessionProps) {
  if (!session) {
    throw new Error('Session is required');
  }
  console.log('session', session);
  const {
    access_token: accessToken,
    scope,
    context,
    owner,
    sub,
    user,
  } = session;

  if (user) {
    const { email, id, username } = user;
    const userData = { email, userId: id, username };
    await prisma.user.upsert({
      where: { userId: id },
      update: userData,
      create: userData,
    });
  }
  if (accessToken && scope && context) {
    const storeHash = context?.split('/')[1] || '';
    const storeData = {
      accessToken,
      scope,
      storeHash,
    };
    await prisma.store.upsert({
      where: { storeHash },
      update: storeData,
      create: storeData,
    });
  }

  if (user && user.id) {
    const contextString = context ?? sub;
    const storeHash = contextString?.split('/')[1] || '';
    const storeUser = await prisma.storeUser.findFirst({
      where: { userId: user.id, storeHash: storeHash },
    });
    // Set admin (store owner) if installing/ updating the app
    // https://developer.bigcommerce.com/api-docs/apps/guide/users
    if (accessToken) {
      // Create a new admin user if none exists
      if (!storeUser) {
        await prisma.storeUser.create({
          data: { isAdmin: true, storeHash, userId: user.id },
        });
      } else if (!storeUser.isAdmin) {
        await prisma.storeUser.update({
          where: { id: storeUser.id },
          data: { isAdmin: true, storeHash, userId: user.id },
        });
      }
    } else {
      // Create a new user if it doesn't exist (non-store owners added here for multi-user apps)
      if (!storeUser) {
        await prisma.storeUser.create({
          data: {
            isAdmin: owner ? owner.id === user.id : false,
            storeHash,
            userId: user.id,
          },
        });
      }
    }
  }
}

export function decodePayload(encodedContext: string) {
  return jwt.verify(encodedContext, JWT_KEY);
}

export function encodePayload({ user, owner, ...session }: SessionProps) {
  const contextString = session?.context ?? session?.sub;
  const context = contextString.split('/')[1] || '';

  return jwt.sign({ context, user, owner }, JWT_KEY, { expiresIn: '24h' });
}

export async function getSession(
  context = '',
): Promise<SessionContextProps | null> {
  if (typeof context !== 'string') return null;
  const { context: storeHash, user } = decodePayload(context);
  const hasUser = await hasStoreUser(storeHash, user?.id);

  // Before retrieving session/ hitting APIs, check user
  if (!hasUser) {
    throw new Error(
      'User is not available. Please login or ensure you have access permissions.',
    );
  }

  const accessToken = (await getStoreToken(storeHash)) || '';

  return { accessToken, storeHash, user };
}

export async function deleteStoreUser({ context, user, sub }: SessionProps) {
  const contextString = context ?? sub;
  const storeHash = contextString?.split('/')[1] || '';
  await prisma.storeUser.deleteMany({
    where: { userId: user.id, storeHash: storeHash },
  });
}

export async function hasStoreUser(storeHash: string, userId: string) {
  if (!storeHash || !userId) return false;

  const storeUser = await prisma.storeUser.findFirst({
    where: { storeHash, userId: +userId },
  });

  return !!storeUser;
}

export async function getStoreToken(storeHash: string) {
  if (!storeHash) return null;

  // Get store access token from database
  const result = await prisma.store.findFirst({
    where: { storeHash },
  });

  return result ? result.accessToken : null;
}

export async function deleteStore({ store_hash: storeHash }: SessionProps) {
  await prisma.store.deleteMany({
    where: { storeHash },
  });
}

export function buildRedirectUrl(url: string, encodedContext: string) {
  const [path, query = ''] = url.split('?');
  const queryParams = new URLSearchParams(`context=${encodedContext}&${query}`);

  return `${path}?${queryParams}`;
}

export async function removeDataStore(session: SessionProps) {
  await deleteStore(session);
  await deleteStoreUser(session);
  return true;
}

export async function logoutUser({ storeHash, user }: SessionContextProps) {
  const session = { context: `store/${storeHash}`, user };
  await deleteStoreUser(session);
}
