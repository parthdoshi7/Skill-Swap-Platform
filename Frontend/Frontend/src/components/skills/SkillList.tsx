import { Skill, User } from '@/types';
import { SkillCard } from './SkillCard';
import { useAuth } from '@/contexts/AuthContext';

interface SkillListProps {
  skills: Skill[];
  user: User;
  type: 'offered' | 'wanted';
  showActions?: boolean;
  onRequestSwap?: (user: User, skill: Skill) => void;
}

export function SkillList({ skills, user, type, showActions = true, onRequestSwap }: SkillListProps) {
  const { user: currentUser } = useAuth();
  
  // Don't show request swap button if viewing own profile
  const canShowActions = showActions && (!currentUser || currentUser.id !== user.id);
  
  if (skills.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground border rounded-md">
        No {type === 'offered' ? 'offered' : 'wanted'} skills yet
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {skills.map((skill) => (
        <SkillCard
          key={skill.id}
          user={user}
          skill={skill}
          type={type}
          showActions={canShowActions}
          onRequestSwap={canShowActions ? onRequestSwap : undefined}
        />
      ))}
    </div>
  );
}