import { useState } from 'react';
import { SwapRequest, User, Skill } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSkillSwap } from '@/contexts/SkillSwapContext';
import { useAuth } from '@/contexts/AuthContext';
import { FeedbackDialog } from './FeedbackDialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ArrowRightIcon, CheckIcon, XIcon, StarIcon, TrashIcon } from 'lucide-react';

interface SwapRequestCardProps {
  swapRequest: SwapRequest;
}

export function SwapRequestCard({ swapRequest }: SwapRequestCardProps) {
  const { user } = useAuth();
  const { getUserById, getSkillById, updateSwapRequest, cancelSwapRequest } = useSkillSwap();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  
  if (!user) return null;
  
  const isRequester = user.id === swapRequest.requesterId;
  const otherUserId = isRequester ? swapRequest.providerId : swapRequest.requesterId;
  const otherUser = getUserById(otherUserId);
  
  if (!otherUser) return null;

  const requesterSkill = getSkillById(swapRequest.requesterId, swapRequest.requesterSkillId);
  const providerSkill = getSkillById(swapRequest.providerId, swapRequest.providerSkillId);
  
  if (!requesterSkill || !providerSkill) return null;

  const getStatusColor = () => {
    switch (swapRequest.status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAccept = () => {
    updateSwapRequest(swapRequest.id, 'accepted');
    toast.success(`You accepted the swap with ${getUserById(swapRequest.requesterId)?.name}`);
  };

  const handleReject = () => {
    updateSwapRequest(swapRequest.id, 'rejected');
    toast.info(`You rejected the swap with ${getUserById(swapRequest.requesterId)?.name}`);
  };

  const handleComplete = () => {
    updateSwapRequest(swapRequest.id, 'completed');
    setIsFeedbackOpen(true);
  };

  const handleCancel = () => {
    cancelSwapRequest(swapRequest.id);
    toast.info('Swap request cancelled');
  };

  const renderActions = () => {
    if (!isRequester && swapRequest.status === 'pending') {
      return (
        <div className="flex justify-end space-x-2">
          <Button size="sm" onClick={handleReject} variant="outline">
            <XIcon className="h-4 w-4 mr-1" /> Reject
          </Button>
          <Button size="sm" onClick={handleAccept}>
            <CheckIcon className="h-4 w-4 mr-1" /> Accept
          </Button>
        </div>
      );
    }

    if (swapRequest.status === 'accepted') {
      return (
        <Button size="sm" onClick={handleComplete}>
          <CheckIcon className="h-4 w-4 mr-1" /> Mark as Completed
        </Button>
      );
    }

    if (isRequester && swapRequest.status === 'pending') {
      return (
        <Button size="sm" variant="outline" onClick={handleCancel} className="text-red-500 hover:bg-red-50">
          <TrashIcon className="h-4 w-4 mr-1" /> Cancel Request
        </Button>
      );
    }

    if (swapRequest.status === 'completed') {
      return (
        <Button size="sm" variant="outline" onClick={() => setIsFeedbackOpen(true)}>
          <StarIcon className="h-4 w-4 mr-1" /> Leave Feedback
        </Button>
      );
    }

    return null;
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Badge className={getStatusColor()}>
              {swapRequest.status.charAt(0).toUpperCase() + swapRequest.status.slice(1)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {format(new Date(swapRequest.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <Avatar className="h-12 w-12 mb-2">
                <AvatarImage src={getUserById(swapRequest.requesterId)?.photoUrl} />
                <AvatarFallback>{getUserById(swapRequest.requesterId)?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="font-medium">{getUserById(swapRequest.requesterId)?.name}</div>
              <div className="text-sm text-muted-foreground mb-2">offers</div>
              <Badge variant="outline" className="font-normal">{requesterSkill.name}</Badge>
            </div>
            
            <div className="flex items-center justify-center">
              <ArrowRightIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="flex flex-col items-center text-center md:items-end md:text-right">
              <Avatar className="h-12 w-12 mb-2">
                <AvatarImage src={getUserById(swapRequest.providerId)?.photoUrl} />
                <AvatarFallback>{getUserById(swapRequest.providerId)?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="font-medium">{getUserById(swapRequest.providerId)?.name}</div>
              <div className="text-sm text-muted-foreground mb-2">offers</div>
              <Badge variant="outline" className="font-normal">{providerSkill.name}</Badge>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-4 py-3 bg-muted/20">
          {renderActions()}
        </CardFooter>
      </Card>
      
      <FeedbackDialog
        swapId={swapRequest.id}
        recipientId={otherUserId}
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  );
}