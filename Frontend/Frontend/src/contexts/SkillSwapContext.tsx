import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SwapRequest, Feedback, Skill } from '@/types';
import { 
  getAllUsers, 
  filterPublicUsers,
  getAllSwapRequests, 
  getUserSwapRequests,
  saveSwapRequest,
  deleteSwapRequest,
  getAllFeedback,
  getUserFeedback,
  saveFeedback,
  getUserRating,
  generateId,
  SAMPLE_SKILLS
} from '@/lib/storage';
import { useAuth } from './AuthContext';

interface SkillSwapContextType {
  users: User[];
  publicUsers: User[];
  swapRequests: SwapRequest[];
  userRequests: SwapRequest[];
  feedback: Feedback[];
  userFeedback: Feedback[];
  sampleSkills: Skill[];
  createSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateSwapRequest: (id: string, status: 'accepted' | 'rejected' | 'completed') => void;
  cancelSwapRequest: (id: string) => void;
  createFeedback: (feedbackData: Omit<Feedback, 'id' | 'createdAt'>) => void;
  getUserRating: (userId: string) => number;
  getSkillById: (userId: string, skillId: string) => Skill | undefined;
  getUserById: (id: string) => User | undefined;
}

const SkillSwapContext = createContext<SkillSwapContextType | undefined>(undefined);

export function SkillSwapProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [publicUsers, setPublicUsers] = useState<User[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [userRequests, setUserRequests] = useState<SwapRequest[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [userFeedback, setUserFeedback] = useState<Feedback[]>([]);
  const [sampleSkills] = useState<Skill[]>(SAMPLE_SKILLS);

  // Load all data when the component mounts or when the current user changes
  useEffect(() => {
    const loadData = () => {
      const allUsers = getAllUsers();
      setUsers(allUsers);
      setPublicUsers(filterPublicUsers(allUsers));
      
      const allSwapRequests = getAllSwapRequests();
      setSwapRequests(allSwapRequests);
      
      if (user) {
        setUserRequests(getUserSwapRequests(user.id));
      } else {
        setUserRequests([]);
      }
      
      const allFeedback = getAllFeedback();
      setFeedback(allFeedback);
      
      if (user) {
        setUserFeedback(getUserFeedback(user.id));
      } else {
        setUserFeedback([]);
      }
    };
    
    loadData();
    
    // Set up interval to refresh data every few seconds
    const interval = setInterval(loadData, 3000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [user]);

  const createSwapRequest = (request: Omit<SwapRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: SwapRequest = {
      ...request,
      id: generateId(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    saveSwapRequest(newRequest);
    
    // Update local state
    setSwapRequests(prev => [...prev, newRequest]);
    if (user && (newRequest.requesterId === user.id || newRequest.providerId === user.id)) {
      setUserRequests(prev => [...prev, newRequest]);
    }
  };

  const updateSwapRequest = (id: string, status: 'accepted' | 'rejected' | 'completed') => {
    const request = swapRequests.find(req => req.id === id);
    if (!request) return;
    
    const updatedRequest = { ...request, status };
    saveSwapRequest(updatedRequest);
    
    // Update local state
    setSwapRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
    setUserRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
  };

  const cancelSwapRequest = (id: string) => {
    deleteSwapRequest(id);
    
    // Update local state
    setSwapRequests(prev => prev.filter(req => req.id !== id));
    setUserRequests(prev => prev.filter(req => req.id !== id));
  };

  const createFeedback = (feedbackData: Omit<Feedback, 'id' | 'createdAt'>) => {
    const newFeedback: Feedback = {
      ...feedbackData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    saveFeedback(newFeedback);
    
    // Update local state
    setFeedback(prev => [...prev, newFeedback]);
    if (user && newFeedback.toUserId === user.id) {
      setUserFeedback(prev => [...prev, newFeedback]);
    }
  };

  const getSkillById = (userId: string, skillId: string): Skill | undefined => {
    const user = users.find(u => u.id === userId);
    if (!user) return undefined;
    
    return [...user.skillsOffered, ...user.skillsWanted].find(skill => skill.id === skillId);
  };

  const getUserById = (id: string): User | undefined => {
    return users.find(u => u.id === id);
  };

  const value = {
    users,
    publicUsers,
    swapRequests,
    userRequests,
    feedback,
    userFeedback,
    sampleSkills,
    createSwapRequest,
    updateSwapRequest,
    cancelSwapRequest,
    createFeedback,
    getUserRating,
    getSkillById,
    getUserById,
  };

  return <SkillSwapContext.Provider value={value}>{children}</SkillSwapContext.Provider>;
}

export const useSkillSwap = () => {
  const context = useContext(SkillSwapContext);
  if (context === undefined) {
    throw new Error('useSkillSwap must be used within a SkillSwapProvider');
  }
  return context;
};