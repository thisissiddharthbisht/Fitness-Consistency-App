import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { saveUserProfile } from '../lib/storage';

export default function GetStarted() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<'lose-fat' | 'build-muscle'>('lose-fat');
  const [dailySchedule, setDailySchedule] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !dailySchedule) {
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // Save user profile through the Python backend so Supabase gets a real row.
      await saveUserProfile({
        name: name.trim(),
        goal,
        dailySchedule,
        onboarded: true,
      });

      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Could not save your profile. Check that the backend and Supabase env values are set.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-blue-600">Fitness Consistency App</p>
          <h1 className="text-3xl font-semibold text-gray-900">Get Started</h1>
          <p className="text-gray-500">Create your personalized fitness plan</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-900">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 bg-gray-50 border-gray-200"
              required
            />
          </div>

          {/* Fitness Goal */}
          <div className="space-y-3">
            <Label className="text-gray-900">Fitness Goal</Label>
            <RadioGroup value={goal} onValueChange={(value) => setGoal(value as 'lose-fat' | 'build-muscle')}>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl p-4 border border-gray-200 cursor-pointer hover:border-blue-500 transition-colors">
                <RadioGroupItem value="lose-fat" id="lose-fat" />
                <Label htmlFor="lose-fat" className="cursor-pointer flex-1 text-gray-900">
                  Lose fat
                </Label>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl p-4 border border-gray-200 cursor-pointer hover:border-blue-500 transition-colors">
                <RadioGroupItem value="build-muscle" id="build-muscle" />
                <Label htmlFor="build-muscle" className="cursor-pointer flex-1 text-gray-900">
                  Build muscle
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Daily Schedule */}
          <div className="space-y-2">
            <Label htmlFor="schedule" className="text-gray-900">Daily schedule</Label>
            <Select value={dailySchedule} onValueChange={setDailySchedule} required>
              <SelectTrigger id="schedule" className="h-12 bg-gray-50 border-gray-200">
                <SelectValue placeholder="Select your availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="early-morning">Early Morning (5-7 AM)</SelectItem>
                <SelectItem value="morning">Morning (7-10 AM)</SelectItem>
                <SelectItem value="midday">Midday (10 AM-2 PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (2-6 PM)</SelectItem>
                <SelectItem value="evening">Evening (6-9 PM)</SelectItem>
                <SelectItem value="night">Night (9 PM-12 AM)</SelectItem>
                <SelectItem value="flexible">Flexible / Varies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-2xl text-base"
            disabled={!name.trim() || !dailySchedule || isSaving}
          >
            {isSaving ? 'Creating Plan...' : 'Create Plan'}
          </Button>
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
