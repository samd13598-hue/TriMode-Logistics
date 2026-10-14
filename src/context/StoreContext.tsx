import React, { createContext, useContext, useState, useEffect } from 'react';
import { Shipment, QuoteRequest, RateItem, StaffUser, TransportMode, ShipmentEvent, UserRole } from '../types';
import { INITIAL_SHIPMENTS, INITIAL_QUOTES, INITIAL_RATES, INITIAL_STAFF } from '../data/seed';

interface StoreContextType {
  shipments: Shipment[];
  quotes: QuoteRequest[];
  rates: RateItem[];
  staff: StaffUser[];
  currentUser: StaffUser | null;
  login: (email: string, role?: UserRole, name?: string) => boolean;
  logout: () => void;
  getShipmentByTracking: (trackingNumber: string) => Shipment | undefined;
  addShipment: (data: Omit<Shipment, 'id' | 'createdAt'>) => Shipment;
  updateShipment: (id: string, updates: Partial<Shipment>) => void;
  deleteShipment: (id: string) => void;
  addShipmentEvent: (shipmentId: string, event: Omit<ShipmentEvent, 'id'>) => void;
  deleteShipmentEvent: (shipmentId: string, eventId: string) => void;
  addQuote: (data: Omit<QuoteRequest, 'id' | 'reference' | 'createdAt' | 'status'>) => QuoteRequest;
  updateQuote: (id: string, updates: Partial<QuoteRequest>) => void;
  deleteQuote: (id: string) => void;
  updateRate: (mode: TransportMode, price: number) => void;
  addStaff: (data: Omit<StaffUser, 'id' | 'createdAt'>) => void;
  removeStaff: (id: string) => void;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const SHIPMENTS_KEY = 'trimode_shipments_v1';
const QUOTES_KEY = 'trimode_quotes_v1';
const RATES_KEY = 'trimode_rates_v1';
const STAFF_KEY = 'trimode_staff_v1';
const USER_KEY = 'trimode_session_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shipments, setShipments] = useState<Shipment[]>(() => {
    try {
      const saved = localStorage.getItem(SHIPMENTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SHIPMENTS;
    } catch {
      return INITIAL_SHIPMENTS;
    }
  });

  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => {
    try {
      const saved = localStorage.getItem(QUOTES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_QUOTES;
    } catch {
      return INITIAL_QUOTES;
    }
  });

  const [rates, setRates] = useState<RateItem[]>(() => {
    try {
      const saved = localStorage.getItem(RATES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_RATES;
    } catch {
      return INITIAL_RATES;
    }
  });

  const [staff, setStaff] = useState<StaffUser[]>(() => {
    try {
      const saved = localStorage.getItem(STAFF_KEY);
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [currentUser, setCurrentUser] = useState<StaffUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SHIPMENTS_KEY, JSON.stringify(shipments));
    } catch (e) {
      console.error(e);
    }
  }, [shipments]);

  useEffect(() => {
    try {
      localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
    } catch (e) {
      console.error(e);
    }
  }, [quotes]);

  useEffect(() => {
    try {
      localStorage.setItem(RATES_KEY, JSON.stringify(rates));
    } catch (e) {
      console.error(e);
    }
  }, [rates]);

  useEffect(() => {
    try {
      localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
    } catch (e) {
      console.error(e);
    }
  }, [staff]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const login = (email: string, forcedRole?: UserRole, forcedName?: string): boolean => {
    const existing = staff.find(s => s.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      return true;
    }
    // Allow demo / test login
    const newUser: StaffUser = {
      id: 'usr-' + Date.now().toString(36),
      name: forcedName || (email.includes('@') ? email.split('@')[0] : 'عضو الفريق'),
      email: email.trim(),
      role: forcedRole || (email.includes('admin') ? 'admin' : 'staff'),
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const getShipmentByTracking = (trackingNumber: string) => {
    const normalized = trackingNumber.trim().toUpperCase();
    return shipments.find(s => s.trackingNumber.toUpperCase() === normalized);
  };

  const addShipment = (data: Omit<Shipment, 'id' | 'createdAt'>): Shipment => {
    const newShipment: Shipment = {
      ...data,
      id: 'shp-' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };
    setShipments(prev => [newShipment, ...prev]);
    return newShipment;
  };

  const updateShipment = (id: string, updates: Partial<Shipment>) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteShipment = (id: string) => {
    setShipments(prev => prev.filter(s => s.id !== id));
  };

  const addShipmentEvent = (shipmentId: string, event: Omit<ShipmentEvent, 'id'>) => {
    const newEvent: ShipmentEvent = {
      ...event,
      id: 'ev-' + Date.now().toString(36),
    };
    setShipments(prev => prev.map(s => {
      if (s.id !== shipmentId) return s;
      return {
        ...s,
        events: [...s.events, newEvent],
      };
    }));
  };

  const deleteShipmentEvent = (shipmentId: string, eventId: string) => {
    setShipments(prev => prev.map(s => {
      if (s.id !== shipmentId) return s;
      return {
        ...s,
        events: s.events.filter(e => e.id !== eventId),
      };
    }));
  };

  const addQuote = (data: Omit<QuoteRequest, 'id' | 'reference' | 'createdAt' | 'status'>): QuoteRequest => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const reference = `REQ-${new Date().getFullYear()}-${randomNum}`;
    const newQuote: QuoteRequest = {
      ...data,
      id: 'q-' + Date.now().toString(36),
      reference,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setQuotes(prev => [newQuote, ...prev]);
    return newQuote;
  };

  const updateQuote = (id: string, updates: Partial<QuoteRequest>) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
  };

  const updateRate = (mode: TransportMode, price: number) => {
    setRates(prev => {
      const idx = prev.findIndex(r => r.mode === mode);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { mode, price };
        return copy;
      }
      return [...prev, { mode, price }];
    });
  };

  const addStaff = (data: Omit<StaffUser, 'id' | 'createdAt'>) => {
    const newMember: StaffUser = {
      ...data,
      id: 'staff-' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };
    setStaff(prev => [...prev, newMember]);
  };

  const removeStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  const resetToDefaults = () => {
    setShipments(INITIAL_SHIPMENTS);
    setQuotes(INITIAL_QUOTES);
    setRates(INITIAL_RATES);
    setStaff(INITIAL_STAFF);
    localStorage.removeItem(SHIPMENTS_KEY);
    localStorage.removeItem(QUOTES_KEY);
    localStorage.removeItem(RATES_KEY);
    localStorage.removeItem(STAFF_KEY);
  };

  return (
    <StoreContext.Provider
      value={{
        shipments,
        quotes,
        rates,
        staff,
        currentUser,
        login,
        logout,
        getShipmentByTracking,
        addShipment,
        updateShipment,
        deleteShipment,
        addShipmentEvent,
        deleteShipmentEvent,
        addQuote,
        updateQuote,
        deleteQuote,
        updateRate,
        addStaff,
        removeStaff,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
