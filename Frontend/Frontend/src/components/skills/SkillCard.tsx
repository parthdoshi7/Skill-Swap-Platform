import { User, Skill } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { StarIcon } from 'lucide-react';
import { getUserRating } from '@/lib/storage';

interface SkillCardProps {
  user: User;
  skill: Skill;
  type: 'offered' | 'wanted';
  showActions?: boolean;
  onRequestSwap?: (user: User, skill: Skill) => void;
}

export function SkillCard({ user, skill, type, showActions = true, onRequestSwap }: SkillCardProps) {
  const navigate = useNavigate();
  const rating = getUserRating(user.id);

  const viewProfile = () => {
    navigate(`/users/${user.id}`);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2 flex flex-row items-center gap-2">
        <Avatar onClick={viewProfile} className="h-10 w-10 cursor-pointer">
          <AvatarImage src={user.photoUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="font-medium cursor-pointer hover:underline" onClick={viewProfile}>
            {user.name}
          </div>
          {user.location && (
            <div className="text-xs text-muted-foreground">{user.location}</div>
          )}
        </div>
        <div className="ml-auto flex items-center">
          {rating > 0 && (
            <div className="flex items-center text-sm">
              <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
          <Badge variant={type === 'offered' ? "default" : "outline"} className="ml-2">
            {type === 'offered' ? 'Offering' : 'Seeking'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <h3 className="font-medium">{skill.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{skill.description}</p>
        
        {showActions && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-xs text-muted-foreground">
              Available: {user.availability.join(', ')}
            </div>
            {type === 'offered' && onRequestSwap && (
              <Button 
                size="sm" 
                onClick={() => onRequestSwap(user, skill)}
                className="ml-auto"
              >
                Request Swap
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}