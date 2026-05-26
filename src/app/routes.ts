import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Programs from './pages/Programs';
import Progress from './pages/Progress';
import Schedule from './pages/Schedule';
import GetStarted from './pages/GetStarted';
import Home from './pages/Home';
import WorkoutScreen from './pages/WorkoutScreen';
import WorkoutComplete from './pages/WorkoutComplete';

export const router = createBrowserRouter([
  {
    path: '/get-started',
    Component: GetStarted,
  },
  {
    path: '/workout/:workoutId',
    Component: WorkoutScreen,
  },
  {
    path: '/workout-complete/:workoutId',
    Component: WorkoutComplete,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'dashboard', Component: Dashboard },
      { path: 'workouts', Component: Workouts },
      { path: 'programs', Component: Programs },
      { path: 'progress', Component: Progress },
      { path: 'schedule', Component: Schedule },
    ],
  },
]);