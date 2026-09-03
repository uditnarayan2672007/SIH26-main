import { getAccessToken, db, auth } from '../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  cc?: string;
}

export interface ChatSpace {
  name: string;
  displayName: string;
  type: string;
  spaceType?: string;
}

export interface ChatMessagePayload {
  spaceName: string;
  text: string;
}

// Convert RFC 2822 email format to base64url for Gmail API
function encodeEmailRaw(to: string, subject: string, body: string, cc?: string): string {
  const emailLines = [
    `To: ${to}`,
    ...(cc ? [`Cc: ${cc}`] : []),
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    body,
  ];
  const emailString = emailLines.join('\r\n');
  const base64 = btoa(unescape(encodeURIComponent(emailString)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Send an email via the Gmail REST API
 */
export async function sendGmailMessage(payload: EmailPayload): Promise<{ id: string; threadId: string }> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Google Workspace Authentication is required. Please Sign in with Google first.');
  }

  const raw = encodeEmailRaw(payload.to, payload.subject, payload.body, payload.cc);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Gmail API Error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  // Log dispatch to Firestore
  try {
    const dispatchId = `disp_gmail_${Date.now()}`;
    await setDoc(doc(collection(db, 'emergency_dispatches'), dispatchId), {
      id: dispatchId,
      channel: 'GMAIL',
      target: payload.to,
      subject: payload.subject,
      body: payload.body.substring(0, 4000),
      dispatchedAt: new Date().toISOString(),
      dispatchedBy: auth.currentUser?.email || 'Authorized Mine Officer',
      status: 'SENT',
    });
  } catch (firestoreErr) {
    console.warn('Could not record dispatch to Firestore:', firestoreErr);
  }

  return result;
}

/**
 * List Google Chat Spaces accessible by the user
 */
export async function listChatSpaces(): Promise<ChatSpace[]> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Google Workspace Authentication required.');
  }

  const response = await fetch('https://chat.googleapis.com/v1/spaces', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Google Chat API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.spaces || [];
}

/**
 * Post a message to a Google Chat Space
 */
export async function sendChatMessage(spaceName: string, text: string): Promise<any> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Google Workspace Authentication required.');
  }

  const response = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Google Chat API Error: ${response.status}`);
  }

  const result = await response.json();

  // Log dispatch to Firestore
  try {
    const dispatchId = `disp_chat_${Date.now()}`;
    await setDoc(doc(collection(db, 'emergency_dispatches'), dispatchId), {
      id: dispatchId,
      channel: 'GOOGLE_CHAT',
      target: spaceName,
      subject: `Chat Notice: ${text.substring(0, 50)}...`,
      body: text.substring(0, 4000),
      dispatchedAt: new Date().toISOString(),
      dispatchedBy: auth.currentUser?.email || 'Authorized Mine Officer',
      status: 'DELIVERED',
    });
  } catch (firestoreErr) {
    console.warn('Could not record dispatch to Firestore:', firestoreErr);
  }

  return result;
}
