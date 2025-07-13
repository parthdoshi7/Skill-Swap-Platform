import { useState } from 'react';
import { User, Skill } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useSkillSwap } from '@/contexts/SkillSwapContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SwapRequestModalProps {
  provider: User;
  providerSkill: Skill;
  isOpen: boolean;
  onClose: () => void;
}

export function SwapRequestModal({ provider, providerSkill, isOpen, onClose }: SwapRequestModalProps) {
  const { user } = useAuth();
  const { createSwapRequest } = useSkillSwap();
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  
  if (!user) {
    return null;
  }

  const handleSubmit = () => {
    if (!selectedSkillId) {
      toast.error("Please select a skill to offer in exchange");
      return;
    }
    
    createSwapRequest({
      requesterId: user.id,
      providerId: provider.id,
      requesterSkillId: selectedSkillId,
      providerSkillId: providerSkill.id,
    });
    
    toast.success("Swap request sent!");
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Skill Swap</DialogTitle>
          <DialogDescription>
            You're requesting "{providerSkill.name}" from {provider.name}.
            Choose one of your skills to offer in exchange.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="skill">Your skill to offer</Label>
            <Select onValueChange={setSelectedSkillId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill to offer" />
              </SelectTrigger>
              <SelectContent>
                {user.skillsOffered.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!selectedSkillId}>
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}