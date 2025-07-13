import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSkillSwap } from '@/contexts/SkillSwapContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { StarIcon } from 'lucide-react';

interface FeedbackDialogProps {
  swapId: string;
  recipientId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackDialog({ swapId, recipientId, isOpen, onClose }: FeedbackDialogProps) {
  const { user } = useAuth();
  const { getUserById, createFeedback } = useSkillSwap();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  if (!user) return null;
  
  const recipient = getUserById(recipientId);
  if (!recipient) return null;
  
  const handleSubmit = () => {
    createFeedback({
      swapId,
      fromUserId: user.id,
      toUserId: recipientId,
      rating,
      comment,
    });
    
    toast.success(`Thanks for your feedback about ${recipient.name}`);
    onClose();
    setRating(5);
    setComment('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
          <DialogDescription>
            How was your experience working with {recipient.name}?
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <StarIcon
                  className={`w-8 h-8 ${
                    star <= rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          
          <Textarea
            placeholder="Share your experience... (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}