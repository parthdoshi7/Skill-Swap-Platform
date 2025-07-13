import { useState } from 'react';
import { Skill } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSkillSwap } from '@/contexts/SkillSwapContext';
import { generateId } from '@/lib/storage';
import { PlusCircleIcon } from 'lucide-react';

interface SkillFormProps {
  onSave: (skill: Skill) => void;
  defaultSkill?: Skill;
  title?: string;
}

export function SkillForm({ onSave, defaultSkill, title = "Add Skill" }: SkillFormProps) {
  const { sampleSkills } = useSkillSwap();
  const [useExisting, setUseExisting] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
  }>({
    name: defaultSkill?.name || '',
    description: defaultSkill?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const skill: Skill = {
      id: defaultSkill?.id || generateId(),
      name: formData.name,
      description: formData.description,
    };
    
    onSave(skill);
    
    if (!defaultSkill) {
      // Reset form if adding a new skill
      setFormData({ name: '', description: '' });
    }
  };

  const selectExistingSkill = (skillId: string) => {
    const skill = sampleSkills.find(s => s.id === skillId);
    if (skill) {
      setFormData({
        name: skill.name,
        description: skill.description,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant={useExisting ? "default" : "outline"}
          size="sm"
          onClick={() => setUseExisting(false)}
          className="flex-1"
        >
          Custom Skill
        </Button>
        <Button
          type="button"
          variant={useExisting ? "outline" : "default"}
          size="sm"
          onClick={() => setUseExisting(true)}
          className="flex-1"
        >
          Choose Existing
        </Button>
      </div>
      
      {useExisting ? (
        <div className="space-y-2">
          <Label htmlFor="existing-skill">Select a skill</Label>
          <Select onValueChange={selectExistingSkill}>
            <SelectTrigger>
              <SelectValue placeholder="Select a skill" />
            </SelectTrigger>
            <SelectContent>
              {sampleSkills.map(skill => (
                <SelectItem key={skill.id} value={skill.id}>
                  {skill.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Skill Name</Label>
            <Input
              id="name"
              placeholder="e.g., Web Development"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Briefly describe your skill..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="min-h-[100px]"
            />
          </div>
        </>
      )}
      
      <Button type="submit" className="w-full">
        <PlusCircleIcon className="mr-2 h-4 w-4" />
        {defaultSkill ? 'Update Skill' : 'Add Skill'}
      </Button>
    </form>
  );
}