import { User, SwapRequest, Feedback, Skill } from '@/types';

// Storage keys
const USERS_KEY = 'skillSwap_users';
const CURRENT_USER_KEY = 'skillSwap_currentUser';
const SWAP_REQUESTS_KEY = 'skillSwap_swapRequests';
const FEEDBACK_KEY = 'skillSwap_feedback';

// Default admin user
const DEFAULT_ADMIN: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@skillswap.com',
  skillsOffered: [],
  skillsWanted: [],
  availability: ['Weekdays', 'Weekends'],
  isPublic: true,
  role: 'admin',
  createdAt: new Date().toISOString(),
};

// Sample skills for demo purposes
export const SAMPLE_SKILLS: Skill[] = [
  { id: '1', name: 'Web Development', description: 'Building websites and web applications' },
  { id: '2', name: 'Graphic Design', description: 'Creating visual content to communicate messages' },
  { id: '3', name: 'Photography', description: 'Capturing and editing professional photos' },
  { id: '4', name: 'Digital Marketing', description: 'Promoting products/services through digital channels' },
  { id: '5', name: 'Cooking', description: 'Preparing delicious meals and desserts' },
  { id: '6', name: 'Yoga Instruction', description: 'Teaching yoga poses and techniques' },
  { id: '7', name: 'Language Teaching', description: 'Teaching foreign languages' },
  { id: '8', name: 'Music Production', description: 'Creating and editing audio recordings' },
  { id: '9', name: 'Financial Planning', description: 'Managing money and investments' },
  { id: '10', name: 'Writing & Editing', description: 'Creating and improving written content' },
];

// Initialize localStorage if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]));
  }
  
  if (!localStorage.getItem(SWAP_REQUESTS_KEY)) {
    localStorage.setItem(SWAP_REQUESTS_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(FEEDBACK_KEY)) {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify([]));
  }
};

// User operations
export const getAllUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const getUserById = (id: string): User | undefined => {
  const users = getAllUsers();
  return users.find(user => user.id === id);
};

export const saveUser = (user: User): void => {
  const users = getAllUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const deleteUser = (id: string): void => {
  const users = getAllUsers().filter(user => user.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Current user (authentication) operations
export const getCurrentUser = (): User | null => {
  const currentUser = localStorage.getItem(CURRENT_USER_KEY);
  return currentUser ? JSON.parse(currentUser) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Swap request operations
export const getAllSwapRequests = (): SwapRequest[] => {
  const requests = localStorage.getItem(SWAP_REQUESTS_KEY);
  return requests ? JSON.parse(requests) : [];
};

export const getSwapRequestById = (id: string): SwapRequest | undefined => {
  const requests = getAllSwapRequests();
  return requests.find(req => req.id === id);
};

export const getUserSwapRequests = (userId: string): SwapRequest[] => {
  const requests = getAllSwapRequests();
  return requests.filter(req => req.requesterId === userId || req.providerId === userId);
};

export const saveSwapRequest = (request: SwapRequest): void => {
  const requests = getAllSwapRequests();
  const existingIndex = requests.findIndex(req => req.id === request.id);
  
  if (existingIndex >= 0) {
    requests[existingIndex] = request;
  } else {
    requests.push(request);
  }
  
  localStorage.setItem(SWAP_REQUESTS_KEY, JSON.stringify(requests));
};

export const deleteSwapRequest = (id: string): void => {
  const requests = getAllSwapRequests().filter(req => req.id !== id);
  localStorage.setItem(SWAP_REQUESTS_KEY, JSON.stringify(requests));
};

// Feedback operations
export const getAllFeedback = (): Feedback[] => {
  const feedback = localStorage.getItem(FEEDBACK_KEY);
  return feedback ? JSON.parse(feedback) : [];
};

export const getUserFeedback = (userId: string): Feedback[] => {
  const feedback = getAllFeedback();
  return feedback.filter(f => f.toUserId === userId);
};

export const saveFeedback = (feedback: Feedback): void => {
  const feedbackList = getAllFeedback();
  const existingIndex = feedbackList.findIndex(f => f.id === feedback.id);
  
  if (existingIndex >= 0) {
    feedbackList[existingIndex] = feedback;
  } else {
    feedbackList.push(feedback);
  }
  
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbackList));
};

// Calculate average rating for a user
export const getUserRating = (userId: string): number => {
  const userFeedback = getUserFeedback(userId);
  if (userFeedback.length === 0) return 0;
  
  const totalRating = userFeedback.reduce((sum, f) => sum + f.rating, 0);
  return totalRating / userFeedback.length;
};

// Helper functions
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const filterPublicUsers = (users: User[]): User[] => {
  return users.filter(user => user.isPublic || getCurrentUser()?.role === 'admin');
};