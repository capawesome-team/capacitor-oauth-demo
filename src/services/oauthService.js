import { Capacitor } from '@capacitor/core';
import { Oauth } from '@capawesome-team/capacitor-oauth';

const OAUTH_ISSUER_URL = 'https://capawesome-demo.eu.auth0.com';
const OAUTH_CLIENT_ID = 'gphAhjI8AsYkZBhWy29Kj95NSpPSEFAO';
const OAUTH_SESSION_STORAGE_KEY = 'oauth-demo-session';

const NATIVE_REDIRECT_URL = 'io.capawesome.oauthdemo.app://oauth/callback';
const NATIVE_POST_LOGOUT_REDIRECT_URL =
  'io.capawesome.oauthdemo.app://oauth/logout';
const WEB_REDIRECT_URL = `${window.location.origin}/oauth/callback`;
const WEB_POST_LOGOUT_REDIRECT_URL = `${window.location.origin}/oauth/logout`;

function getRedirectUrl() {
  if (Capacitor.getPlatform() === 'web') {
    return WEB_REDIRECT_URL;
  }
  return NATIVE_REDIRECT_URL;
}

function getPostLogoutRedirectUrl() {
  if (Capacitor.getPlatform() === 'web') {
    return WEB_POST_LOGOUT_REDIRECT_URL;
  }
  return NATIVE_POST_LOGOUT_REDIRECT_URL;
}

function getSession() {
  try {
    const raw = localStorage.getItem(OAUTH_SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}

function saveSession(session) {
  localStorage.setItem(OAUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(OAUTH_SESSION_STORAGE_KEY);
}

export function isAuthenticated() {
  const session = getSession();
  return Boolean(session?.idToken || session?.accessToken);
}

export async function login() {
  const session = await Oauth.login({
    issuerUrl: OAUTH_ISSUER_URL,
    clientId: OAUTH_CLIENT_ID,
    redirectUrl: getRedirectUrl(),
    scopes: ['openid', 'profile', 'email', 'offline_access'],
  });
  saveSession(session);
  return session;
}

export async function handleWebRedirectCallback() {
  if (Capacitor.getPlatform() !== 'web') {
    return null;
  }
  const url = new URL(window.location.href);
  if (!url.searchParams.has('code') && !url.searchParams.has('error')) {
    return null;
  }
  const callbackResult = await Oauth.handleRedirectCallback();
  const currentSession = getSession() || {};
  const session = { ...currentSession, ...callbackResult };
  saveSession(session);
  return session;
}

export async function refreshSession() {
  const session = getSession();
  if (!session?.refreshToken) {
    throw new Error('No refresh token found. Please sign in again.');
  }
  const refreshed = await Oauth.refreshToken({
    issuerUrl: OAUTH_ISSUER_URL,
    clientId: OAUTH_CLIENT_ID,
    refreshToken: session.refreshToken,
  });
  const nextSession = { ...session, ...refreshed };
  saveSession(nextSession);
  return nextSession;
}

export async function getUserProfile() {
  const session = getSession();
  if (!session?.idToken) {
    return { name: null, email: null };
  }

  try {
    const decoded = await Oauth.decodeIdToken({ token: session.idToken });
    const claims = decoded?.payload || null;
    return {
      name: claims?.name || claims?.given_name || claims?.nickname || null,
      email: claims?.email || null,
    };
  } catch (_error) {
    return { name: null, email: null };
  }
}

export async function logout() {
  const session = getSession();
  clearSession();
  if (!session?.idToken) {
    return;
  }
  await Oauth.logout({
    issuerUrl: OAUTH_ISSUER_URL,
    idToken: session.idToken,
    postLogoutRedirectUrl: getPostLogoutRedirectUrl(),
  });
}
