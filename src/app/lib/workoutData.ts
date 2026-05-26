// Workout data and categories

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rest: number; // seconds
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'sports';
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  caloriesBurned: number;
  description: string;
  equipment: string[];
}

export interface Program {
  id: string;
  name: string;
  goal: string;
  duration: string; // e.g., "4 weeks"
  level: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  workouts: string[]; // workout IDs
  description: string;
}

export const workouts: Workout[] = [
  {
    id: 'w1',
    name: 'Full Body Strength',
    category: 'strength',
    duration: 45,
    difficulty: 'intermediate',
    caloriesBurned: 320,
    description: 'A comprehensive full-body workout targeting all major muscle groups',
    equipment: ['Dumbbells', 'Barbell', 'Bench'],
    exercises: [
      { name: 'Barbell Squats', sets: 4, reps: 10, rest: 90 },
      { name: 'Bench Press', sets: 4, reps: 10, rest: 90 },
      { name: 'Deadlifts', sets: 3, reps: 8, rest: 120 },
      { name: 'Overhead Press', sets: 3, reps: 10, rest: 90 },
      { name: 'Barbell Rows', sets: 3, reps: 10, rest: 90 },
      { name: 'Plank', sets: 3, reps: 60, rest: 60, notes: 'Hold for 60 seconds' },
    ]
  },
  {
    id: 'w2',
    name: 'HIIT Cardio Blast',
    category: 'cardio',
    duration: 30,
    difficulty: 'advanced',
    caloriesBurned: 380,
    description: 'High-intensity interval training to boost metabolism and burn fat',
    equipment: ['None'],
    exercises: [
      { name: 'Burpees', sets: 4, reps: 15, rest: 30 },
      { name: 'Mountain Climbers', sets: 4, reps: 30, rest: 30 },
      { name: 'Jump Squats', sets: 4, reps: 20, rest: 30 },
      { name: 'High Knees', sets: 4, reps: 40, rest: 30 },
      { name: 'Box Jumps', sets: 4, reps: 12, rest: 45 },
    ]
  },
  {
    id: 'w3',
    name: 'Upper Body Builder',
    category: 'strength',
    duration: 40,
    difficulty: 'intermediate',
    caloriesBurned: 280,
    description: 'Focus on building strength and size in chest, back, shoulders, and arms',
    equipment: ['Dumbbells', 'Pull-up Bar', 'Bench'],
    exercises: [
      { name: 'Dumbbell Bench Press', sets: 4, reps: 10, rest: 90 },
      { name: 'Pull-ups', sets: 4, reps: 8, rest: 90 },
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: 12, rest: 75 },
      { name: 'Bicep Curls', sets: 3, reps: 12, rest: 60 },
      { name: 'Tricep Dips', sets: 3, reps: 12, rest: 60 },
      { name: 'Face Pulls', sets: 3, reps: 15, rest: 60 },
    ]
  },
  {
    id: 'w4',
    name: 'Lower Body Power',
    category: 'strength',
    duration: 50,
    difficulty: 'advanced',
    caloriesBurned: 350,
    description: 'Intense lower body workout for building leg strength and power',
    equipment: ['Barbell', 'Dumbbells', 'Leg Press'],
    exercises: [
      { name: 'Back Squats', sets: 5, reps: 8, rest: 120 },
      { name: 'Romanian Deadlifts', sets: 4, reps: 10, rest: 90 },
      { name: 'Leg Press', sets: 4, reps: 12, rest: 90 },
      { name: 'Walking Lunges', sets: 3, reps: 20, rest: 75 },
      { name: 'Leg Curls', sets: 3, reps: 12, rest: 60 },
      { name: 'Calf Raises', sets: 4, reps: 15, rest: 60 },
    ]
  },
  {
    id: 'w5',
    name: 'Yoga Flow',
    category: 'flexibility',
    duration: 35,
    difficulty: 'beginner',
    caloriesBurned: 120,
    description: 'Gentle yoga flow to improve flexibility and reduce stress',
    equipment: ['Yoga Mat'],
    exercises: [
      { name: 'Sun Salutations', sets: 3, reps: 5, rest: 30 },
      { name: 'Warrior Series', sets: 2, reps: 5, rest: 30 },
      { name: 'Triangle Pose', sets: 2, reps: 3, rest: 20, notes: 'Hold each side for 30 seconds' },
      { name: 'Pigeon Pose', sets: 2, reps: 2, rest: 20, notes: 'Hold each side for 45 seconds' },
      { name: 'Child\'s Pose', sets: 1, reps: 1, rest: 0, notes: 'Hold for 2 minutes' },
    ]
  },
  {
    id: 'w6',
    name: 'Core Crusher',
    category: 'strength',
    duration: 25,
    difficulty: 'intermediate',
    caloriesBurned: 180,
    description: 'Target your abs and core with these effective exercises',
    equipment: ['None'],
    exercises: [
      { name: 'Crunches', sets: 4, reps: 20, rest: 30 },
      { name: 'Russian Twists', sets: 4, reps: 30, rest: 30 },
      { name: 'Leg Raises', sets: 3, reps: 15, rest: 45 },
      { name: 'Bicycle Crunches', sets: 3, reps: 30, rest: 30 },
      { name: 'Plank Hold', sets: 3, reps: 60, rest: 60, notes: 'Hold for 60 seconds' },
      { name: 'Side Plank', sets: 2, reps: 45, rest: 45, notes: 'Each side for 45 seconds' },
    ]
  },
  {
    id: 'w7',
    name: 'Beginner Cardio',
    category: 'cardio',
    duration: 25,
    difficulty: 'beginner',
    caloriesBurned: 200,
    description: 'Easy-to-follow cardio workout perfect for beginners',
    equipment: ['None'],
    exercises: [
      { name: 'March in Place', sets: 3, reps: 60, rest: 30, notes: '1 minute' },
      { name: 'Step Touch', sets: 3, reps: 30, rest: 30 },
      { name: 'Knee Lifts', sets: 3, reps: 20, rest: 30 },
      { name: 'Jumping Jacks', sets: 3, reps: 20, rest: 30 },
      { name: 'Side Steps', sets: 3, reps: 30, rest: 30 },
    ]
  },
  {
    id: 'w8',
    name: 'Athletic Conditioning',
    category: 'sports',
    duration: 40,
    difficulty: 'advanced',
    caloriesBurned: 400,
    description: 'Sport-specific conditioning to improve agility and explosiveness',
    equipment: ['Cones', 'Jump Rope'],
    exercises: [
      { name: 'Agility Ladder Drills', sets: 4, reps: 5, rest: 45 },
      { name: 'Box Jumps', sets: 4, reps: 10, rest: 60 },
      { name: 'Sprint Intervals', sets: 6, reps: 1, rest: 90, notes: '30 seconds sprint' },
      { name: 'Jump Rope', sets: 3, reps: 120, rest: 60, notes: '2 minutes' },
      { name: 'Lateral Bounds', sets: 3, reps: 20, rest: 45 },
    ]
  },
  {
    id: 'w9',
    name: 'Mobility & Stretch',
    category: 'flexibility',
    duration: 20,
    difficulty: 'beginner',
    caloriesBurned: 80,
    description: 'Essential stretches to improve mobility and prevent injury',
    equipment: ['Yoga Mat'],
    exercises: [
      { name: 'Hip Circles', sets: 2, reps: 10, rest: 20 },
      { name: 'Arm Circles', sets: 2, reps: 15, rest: 20 },
      { name: 'Hamstring Stretch', sets: 2, reps: 2, rest: 15, notes: 'Hold 30 seconds each leg' },
      { name: 'Quad Stretch', sets: 2, reps: 2, rest: 15, notes: 'Hold 30 seconds each leg' },
      { name: 'Shoulder Stretch', sets: 2, reps: 2, rest: 15, notes: 'Hold 30 seconds each arm' },
      { name: 'Cat-Cow Stretch', sets: 2, reps: 10, rest: 20 },
    ]
  },
  {
    id: 'w10',
    name: 'Push Day',
    category: 'strength',
    duration: 45,
    difficulty: 'intermediate',
    caloriesBurned: 300,
    description: 'Focus on chest, shoulders, and triceps',
    equipment: ['Dumbbells', 'Barbell', 'Bench'],
    exercises: [
      { name: 'Flat Barbell Bench Press', sets: 4, reps: 10, rest: 90 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 12, rest: 75 },
      { name: 'Dumbbell Shoulder Press', sets: 4, reps: 10, rest: 75 },
      { name: 'Lateral Raises', sets: 3, reps: 15, rest: 60 },
      { name: 'Tricep Pushdowns', sets: 3, reps: 12, rest: 60 },
      { name: 'Overhead Tricep Extension', sets: 3, reps: 12, rest: 60 },
    ]
  },
];

export const programs: Program[] = [
  {
    id: 'p1',
    name: 'Beginner\'s Foundation',
    goal: 'Build basic fitness and form',
    duration: '4 weeks',
    level: 'beginner',
    daysPerWeek: 3,
    workouts: ['w7', 'w5', 'w9'],
    description: 'Perfect for those just starting their fitness journey. Focus on building foundational strength, improving flexibility, and establishing consistent workout habits.',
  },
  {
    id: 'p2',
    name: 'Muscle Builder',
    goal: 'Build muscle mass and strength',
    duration: '8 weeks',
    level: 'intermediate',
    daysPerWeek: 4,
    workouts: ['w1', 'w3', 'w4', 'w10'],
    description: 'Structured strength training program designed to build muscle mass and increase overall strength. Includes progressive overload and adequate recovery.',
  },
  {
    id: 'p3',
    name: 'Fat Loss Accelerator',
    goal: 'Burn fat and improve conditioning',
    duration: '6 weeks',
    level: 'intermediate',
    daysPerWeek: 5,
    workouts: ['w2', 'w1', 'w6', 'w2', 'w5'],
    description: 'High-intensity program combining strength training and cardio to maximize fat loss while preserving muscle mass.',
  },
  {
    id: 'p4',
    name: 'Athletic Performance',
    goal: 'Enhance sports performance',
    duration: '8 weeks',
    level: 'advanced',
    daysPerWeek: 5,
    workouts: ['w8', 'w4', 'w2', 'w3', 'w9'],
    description: 'Sport-specific training program to improve speed, power, agility, and overall athletic performance.',
  },
  {
    id: 'p5',
    name: 'Flexibility Focus',
    goal: 'Improve flexibility and mobility',
    duration: '4 weeks',
    level: 'beginner',
    daysPerWeek: 4,
    workouts: ['w5', 'w9', 'w5', 'w9'],
    description: 'Dedicated program to enhance flexibility, reduce muscle tension, and improve range of motion through yoga and stretching.',
  },
  {
    id: 'p6',
    name: 'Total Body Transformation',
    goal: 'Complete fitness overhaul',
    duration: '12 weeks',
    level: 'advanced',
    daysPerWeek: 6,
    workouts: ['w1', 'w2', 'w3', 'w4', 'w6', 'w5'],
    description: 'Comprehensive program combining strength, cardio, and flexibility for a complete body transformation.',
  },
];

export const getCategoryIcon = (category: Workout['category']): string => {
  switch (category) {
    case 'strength':
      return 'Dumbbell';
    case 'cardio':
      return 'Heart';
    case 'flexibility':
      return 'Wind';
    case 'sports':
      return 'Trophy';
    default:
      return 'Activity';
  }
};

export const getDifficultyColor = (difficulty: Workout['difficulty']): string => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-500';
    case 'intermediate':
      return 'bg-yellow-500';
    case 'advanced':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};
