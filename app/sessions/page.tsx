'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../token context/authcontent';
import { createApiService } from '@/service/api';

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

export default function UserPage() {
  const { getToken, setToken, isLoading: authLoading, accessToken } = useAuth();
  const router = useRouter();

  const apiServiceRef = useRef(createApiService({ getToken, setToken }));

  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<'users' | 'sessions'>('users');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (authLoading) return;
    if (!accessToken) {
      router.push('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await apiServiceRef.current.getUsers();
        if (data.results) {
          setUsers(data.results);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authLoading, accessToken, router]);

  const handleViewSessions = async (userId: string) => {
    setLoading(true);
    setSelectedUser(userId);
    setVisibleTokens(new Set());
    try {
      const data = await apiServiceRef.current.getUserSessions(userId);
      if (data.data) {
        setSessions(data.data);
      }
      setView('sessions');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await apiServiceRef.current.expireSession(sessionId);
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, active: 0 } : s));
    } catch (err) {
      console.error(err);
    }
  };

  const handleBack = () => {
    setView('users');
    setSessions([]);
    setSelectedUser('');
    setVisibleTokens(new Set());
  };

  const toggleToken = (sessionId: string) => {
    setVisibleTokens(prev => {
      const next = new Set(prev);
      next.has(sessionId) ? next.delete(sessionId) : next.add(sessionId);
      return next;
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#050505]">
        <div className="text-indigo-500 font-semibold tracking-widest uppercase">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-[#020202] text-white relative overflow-hidden flex flex-col items-center">
      
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1400px] z-10 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#12121a]/60 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 md:px-10 md:py-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">Admin Panel</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
              {view === 'users' ? 'User Management' : `Sessions for ${selectedUser}`}
            </h1>
          </div>

          {view === 'sessions' && (
            <button
              onClick={handleBack}
              className="group relative px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl border border-white/10 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>←</span> Back to Users
              </span>
            </button>
          )}
        </div>

        <div className="w-full bg-[#12121a]/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            {view === 'users' ? (
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-white/[0.03] border-b border-white/10">
                    <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">Username</th>
                    <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">Email</th>
                    <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.length > 0 ? (
                    users.map((user, idx) => {
                      const identifier = user.user_id || user.username || String(user.id);
                      return (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="py-4 px-6 text-sm font-medium text-white/90">{user.username || 'N/A'}</td>
                          <td className="py-4 px-6 text-sm text-white/60">{user.email || 'N/A'}</td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleViewSessions(identifier)}
                              className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-500/20"
                            >
                              View Sessions
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-white/40 text-sm">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-white/[0.03] border-b border-white/10">
                    <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">Status</th>
                    <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">Session ID</th>
                    <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">Token</th>
                    <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">Expires At</th>
                    <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">Created At</th>
                    <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">IP Address</th>
                    <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sessions.length > 0 ? (
                    sessions.map((session) => (
                      <tr key={session.id} className="hover:bg-white/[0.02]">
                        <td className="py-4 px-6">
                          {session.active === 1 ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Expired
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-white/70 font-mono">{session.id}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className={`font-mono text-xs text-white/50 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 ${visibleTokens.has(session.id) ? 'max-w-[200px] whitespace-normal break-all' : 'w-[120px] truncate'}`}>
                              {visibleTokens.has(session.id) ? session.token : '••••••••••••••••••••••••'}
                            </span>
                            <button
                              onClick={() => toggleToken(session.id)}
                              className="text-xs font-medium text-white/40 hover:text-white"
                            >
                              {visibleTokens.has(session.id) ? 'Hide' : 'Show'}
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-white/60">{new Date(session.expires_at * 1000).toLocaleString()}</td>
                        <td className="py-4 px-6 text-sm text-white/60">{new Date(session.created_at * 1000).toLocaleString()}</td>
                        <td className="py-4 px-6 text-sm text-white/70 font-mono">{session.ipAddress || 'N/A'}</td>
                        <td className="py-4 px-6 text-right">
                          {session.active === 1 ? (
                            <button
                              onClick={() => handleDeleteSession(session.id)}
                              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg border border-rose-500/20"
                            >
                              Unable
                            </button>
                          ) : (
                            <span className="text-white/20 text-xs font-medium px-3">Unabled</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-white/40 text-sm">No sessions found for this user.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}