import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSkillSwap } from '@/contexts/SkillSwapContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { deleteUser, saveUser } from '@/lib/storage';
import { format } from 'date-fns';
import { UsersIcon, RefreshCwIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const { users, swapRequests, feedback } = useSkillSwap();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Ensure user is authenticated and is an admin
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };
  
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery) || 
    u.email.toLowerCase().includes(searchQuery)
  );
  
  const filteredSwaps = swapRequests.filter(swap => {
    const requester = users.find(u => u.id === swap.requesterId);
    const provider = users.find(u => u.id === swap.providerId);
    
    return requester && provider && (
      requester.name.toLowerCase().includes(searchQuery) ||
      provider.name.toLowerCase().includes(searchQuery) ||
      swap.status.toLowerCase().includes(searchQuery)
    );
  });
  
  const toggleUserStatus = (userId: string, isActive: boolean) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      // This is a simplified way to "ban" a user - we just remove them
      // In a real app, you might want to keep them but mark them as banned
      if (isActive) {
        saveUser({
          ...targetUser,
          isPublic: false
        });
        toast.success(`User ${targetUser.name} has been set to private`);
      } else {
        deleteUser(userId);
        toast.success(`User ${targetUser.name} has been deleted`);
      }
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container py-8 px-4"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCwIcon className="h-4 w-4 mr-2" /> Refresh Data
        </Button>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search users, swaps..."
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-md"
        />
      </div>
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <UsersIcon className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Total Users</h3>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-100 rounded-lg p-6 flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <RefreshCwIcon className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Swap Requests</h3>
              <p className="text-2xl font-bold">{swapRequests.length}</p>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 flex items-center">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <CheckCircleIcon className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Feedback Given</h3>
              <p className="text-2xl font-bold">{feedback.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="swaps">Swap Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="py-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.photoUrl} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? "default" : "outline"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isPublic ? "success" : "secondary"} className="bg-green-100 text-green-800 hover:bg-green-200">
                        {user.isPublic ? 'Public' : 'Private'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant="outline">{user.skillsOffered.length} offered</Badge>
                        <Badge variant="outline">{user.skillsWanted.length} wanted</Badge>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(user.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      {user.role !== 'admin' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleUserStatus(user.id, user.isPublic)}
                        >
                          {user.isPublic ? (
                            <XCircleIcon className="h-4 w-4 mr-1 text-red-500" />
                          ) : (
                            <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                          )}
                          {user.isPublic ? 'Make Private' : 'Delete User'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No users match your search</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="swaps" className="py-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requester</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSwaps.map(swap => {
                  const requester = users.find(u => u.id === swap.requesterId);
                  const provider = users.find(u => u.id === swap.providerId);
                  
                  if (!requester || !provider) return null;
                  
                  return (
                    <TableRow key={swap.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={requester.photoUrl} />
                            <AvatarFallback>{requester.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{requester.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={provider.photoUrl} />
                            <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{provider.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            swap.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {swap.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(swap.createdAt), 'MMM d, yyyy')}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredSwaps.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No swap requests match your search</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}