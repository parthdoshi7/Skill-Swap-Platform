import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSkillSwap } from '@/contexts/SkillSwapContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SkillCard } from '@/components/skills/SkillCard';
import { SwapRequestModal } from '@/components/swaps/SwapRequestModal';
import { Skill, User } from '@/types';
import { motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';

export default function BrowsePage() {
  const { publicUsers, sampleSkills } = useSkillSwap();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserSkill, setSelectedUserSkill] = useState<Skill | null>(null);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };
  
  const handleSkillFilter = (skillId: string | null) => {
    setSelectedSkill(skillId);
  };
  
  const handleRequestSwap = (user: User, skill: Skill) => {
    setSelectedUser(user);
    setSelectedUserSkill(skill);
    setShowModal(true);
  };
  
  // Filter users based on search and selected skill
  const filteredUsers = publicUsers.filter(user => {
    const matchesSearch = searchQuery === '' || 
                          user.name.toLowerCase().includes(searchQuery) ||
                          user.skillsOffered.some(skill => skill.name.toLowerCase().includes(searchQuery)) ||
                          user.skillsWanted.some(skill => skill.name.toLowerCase().includes(searchQuery));
    
    const matchesSkill = selectedSkill === null || 
                         user.skillsOffered.some(skill => skill.name === selectedSkill) ||
                         user.skillsWanted.some(skill => skill.name === selectedSkill);
    
    return matchesSearch && matchesSkill;
  });
  
  // Get all unique skills from all users
  const allSkills = new Set<string>();
  publicUsers.forEach(user => {
    user.skillsOffered.forEach(skill => allSkills.add(skill.name));
    user.skillsWanted.forEach(skill => allSkills.add(skill.name));
  });
  
  const uniqueSkills = Array.from(allSkills);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-6xl py-8 px-4"
    >
      <h1 className="text-3xl font-bold mb-6">Find Skills</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or skill..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        
        <Button
          variant={selectedSkill === null ? "default" : "outline"}
          onClick={() => handleSkillFilter(null)}
        >
          All Skills
        </Button>
      </div>
      
      {uniqueSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {uniqueSkills.map((skill) => (
            <Badge
              key={skill}
              variant={selectedSkill === skill ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleSkillFilter(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      )}
      
      <Tabs defaultValue="offered" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="offered">Skills Offered</TabsTrigger>
          <TabsTrigger value="wanted">Skills Wanted</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="offered" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.flatMap(user => 
              user.skillsOffered
                .filter(skill => 
                  !searchQuery || skill.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(skill => (
                  <SkillCard 
                    key={`${user.id}-${skill.id}`}
                    user={user}
                    skill={skill}
                    type="offered"
                    onRequestSwap={handleRequestSwap}
                  />
                ))
            )}
          </div>
          
          {filteredUsers.flatMap(u => u.skillsOffered).length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No offered skills match your search</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="wanted" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.flatMap(user => 
              user.skillsWanted
                .filter(skill => 
                  !searchQuery || skill.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(skill => (
                  <SkillCard 
                    key={`${user.id}-${skill.id}`}
                    user={user}
                    skill={skill}
                    type="wanted"
                    showActions={false}
                  />
                ))
            )}
          </div>
          
          {filteredUsers.flatMap(u => u.skillsWanted).length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No wanted skills match your search</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="users" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <Link key={user.id} to={`/users/${user.id}`} className="block">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="border rounded-lg p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-lg font-medium">
                      {user.photoUrl ? (
                        <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      {user.location && (
                        <p className="text-sm text-muted-foreground">{user.location}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium mb-1">Skills Offered:</div>
                      <div className="flex flex-wrap gap-1">
                        {user.skillsOffered.length > 0 ? (
                          user.skillsOffered.slice(0, 3).map(skill => (
                            <Badge key={skill.id} variant="outline" className="text-xs">
                              {skill.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">None specified</span>
                        )}
                        {user.skillsOffered.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{user.skillsOffered.length - 3} more</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Skills Wanted:</div>
                      <div className="flex flex-wrap gap-1">
                        {user.skillsWanted.length > 0 ? (
                          user.skillsWanted.slice(0, 3).map(skill => (
                            <Badge key={skill.id} variant="outline" className="text-xs">
                              {skill.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">None specified</span>
                        )}
                        {user.skillsWanted.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{user.skillsWanted.length - 3} more</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No users match your search</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {selectedUser && selectedUserSkill && (
        <SwapRequestModal
          provider={selectedUser}
          providerSkill={selectedUserSkill}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </motion.div>
  );
}