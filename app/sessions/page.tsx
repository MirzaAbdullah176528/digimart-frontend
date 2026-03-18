'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../token context/authcontent';

interface User {
  id: string | number;
  username?: string;
  email?: string;
  user_id?: string;
}

interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: number;
  created_at: number;
  active: number;
  subscriptions_avail: number;
  products_bought: number;
  products_added: number;
  products_updated: number;
  ipAddress: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

export default function UserPage() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<'users' | 'sessions'>('users');
  const [selectedUser, setSelectedUser] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/sessions/users`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          }
        });
        const data = await res.json();
        if (data.results) {
          setUsers(data.results);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [getToken]);

  const handleViewSessions = async (userId: string) => {
    setLoading(true);
    setSelectedUser(userId);
    try {
      const res = await fetch(`${BASE_URL}/sessions/search-user`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      if (data.data) {
        setSessions(data.data);
      }
      setView('sessions');
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/sessions/expire`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ id: sessionId, status: 0 }),
      });
      if (res.ok) {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, active: 0 } : s));
      }
    } catch (err) {
    }
  };

  const handleBack = () => {
    setView('users');
    setSessions([]);
    setSelectedUser('');
  };

  return (
    <div style={{ backgroundColor: 'white', color: 'black', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>{view === 'users' ? 'User Management' : `Sessions for ${selectedUser}`}</h1>
      
      {view === 'sessions' && (
        <button onClick={handleBack} style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer', border: '1px solid black', backgroundColor: '#f0f0f0' }}>
          Back to Users
        </button>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : view === 'users' ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>ID</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>Username</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>Email</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>User ID</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, idx) => {
                const identifier = user.user_id || user.username || String(user.id);
                return (
                  <tr key={idx}>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{user.id}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{user.username || 'N/A'}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{user.email || 'N/A'}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{user.user_id || 'N/A'}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <button onClick={() => handleViewSessions(identifier)} style={{ padding: '4px 8px', cursor: 'pointer', border: '1px solid black', backgroundColor: 'white' }}>
                        View Sessions
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>Session ID</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>User ID</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>Token</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>Expires At</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>Created At</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>Active</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>Subscriptions Avail</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>Products Bought</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>Products Added</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>Products Updated</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>IP Address</th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <tr key={session.id}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{session.id}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{session.user_id}</td>
                  <td style={{ border: '1px solid black', padding: '8px', maxWidth: '200px', wordBreak: 'break-all' }}>{session.token}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(session.expires_at * 1000).toLocaleString()}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(session.created_at * 1000).toLocaleString()}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{session.active === 1 ? 'Yes' : 'No'}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{session.subscriptions_avail}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{session.products_bought}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{session.products_added}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{session.products_updated}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{session.ipAddress || 'N/A'}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    {session.active === 1 && (
                      <button onClick={() => handleDeleteSession(session.id)} style={{ padding: '4px 8px', cursor: 'pointer', border: '1px solid black', backgroundColor: '#ffe6e6', color: 'red' }}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>No sessions found for this user.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}