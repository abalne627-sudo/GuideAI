
import React, { useState, useEffect } from 'react';
import { User, UserGoal } from '../types';
import { dbAddUserGoal, dbGetUserGoals, dbDeleteUserGoal, dbUpdateUserGoal } from '../services/dbService'; // Mock DB

interface GoalManagerProps {
  user: User;
}

const GoalManager: React.FC<GoalManagerProps> = ({ user }) => {
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [newGoalText, setNewGoalText] = useState('');
  const [editingGoal, setEditingGoal] = useState<UserGoal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setGoals(dbGetUserGoals(user.id));
    setLoading(false);
  }, [user.id]);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const addedGoal = dbAddUserGoal(user.id, newGoalText.trim());
    setGoals(prev => [addedGoal, ...prev]);
    setNewGoalText('');
  };

  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      dbDeleteUserGoal(user.id, goalId);
      setGoals(prev => prev.filter(g => g.id !== goalId));
    }
  };

  const handleToggleComplete = (goal: UserGoal) => {
    const updatedGoal = { ...goal, isCompleted: !goal.isCompleted };
    dbUpdateUserGoal(updatedGoal);
    setGoals(prev => prev.map(g => g.id === goal.id ? updatedGoal : g));
  };
  
  const handleEditGoal = (goal: UserGoal) => {
    setEditingGoal(goal);
    setNewGoalText(goal.text); // Pre-fill input for editing
  };

  const handleUpdateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || !newGoalText.trim()) return;
    const updatedGoalData = { ...editingGoal, text: newGoalText.trim() };
    dbUpdateUserGoal(updatedGoalData);
    setGoals(prev => prev.map(g => g.id === editingGoal.id ? updatedGoalData : g));
    setNewGoalText('');
    setEditingGoal(null);
  };


  if (loading) {
    return <p className="text-center text-gray-500">Loading goals...</p>;
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg mt-8">
      <h3 className="text-xl font-semibold text-neutral-dark mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-accent">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
        </svg>
        Your Personal Goals
      </h3>
      <form onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal} className="mb-6 flex flex-col sm:flex-row items-stretch gap-2">
        <input
          type="text"
          value={newGoalText}
          onChange={(e) => setNewGoalText(e.target.value)}
          placeholder={editingGoal ? "Update your goal..." : "What do you want to achieve?"}
          className="flex-grow px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          aria-label={editingGoal ? "Update goal text" : "New goal text"}
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          disabled={!newGoalText.trim()}
        >
          {editingGoal ? 'Update Goal' : 'Add Goal'}
        </button>
        {editingGoal && (
            <button type="button" onClick={() => { setEditingGoal(null); setNewGoalText('');}} 
            className="px-5 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow hover:bg-gray-300 transition">
                Cancel
            </button>
        )}
      </form>

      {goals.length === 0 ? (
        <p className="text-gray-500 text-center">No goals set yet. Add one above!</p>
      ) : (
        <ul className="space-y-3">
          {goals.map(goal => (
            <li key={goal.id} className={`p-3 rounded-lg flex items-center justify-between transition-all duration-300 ${goal.isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} border`}>
              <div className="flex items-center flex-grow">
                <input 
                  type="checkbox" 
                  checked={goal.isCompleted} 
                  onChange={() => handleToggleComplete(goal)}
                  className="h-5 w-5 text-accent rounded border-gray-300 focus:ring-accent mr-3 cursor-pointer"
                  aria-labelledby={`goal-text-${goal.id}`}
                />
                <span id={`goal-text-${goal.id}`} className={`flex-grow ${goal.isCompleted ? 'line-through text-gray-500' : 'text-neutral-dark'}`}>
                  {goal.text}
                </span>
              </div>
              <div className="flex-shrink-0 space-x-2 ml-2">
                {!goal.isCompleted && (
                    <button onClick={() => handleEditGoal(goal)} className="text-blue-500 hover:text-blue-700 p-1" aria-label={`Edit goal: ${goal.text}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                    </button>
                )}
                <button onClick={() => handleDeleteGoal(goal.id)} className="text-red-500 hover:text-red-700 p-1" aria-label={`Delete goal: ${goal.text}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.096 3.262.27m-3.262.27L6.201 19.673M16.5 5.654L12 2.253 7.5 5.654M21 5.79V21A2.25 2.25 0 0118.75 23.25H5.25A2.25 2.25 0 013 21V5.79m18 0c0-2.016-1.632-3.646-3.646-3.646H6.646C4.632 2.148 3 3.778 3 5.79m18 0c0 2.633-2.91 3.636-3.646 3.636m-12.56 0c.735 0 3.646-1.003 3.646-3.636" /></svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoalManager;
