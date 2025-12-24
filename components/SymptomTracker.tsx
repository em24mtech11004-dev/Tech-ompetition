import React, { useState } from 'react';
import { DailyLog } from '../types';
import { Save, Plus, X } from 'lucide-react';

interface SymptomTrackerProps {
  onSave: (log: DailyLog) => void;
  onCancel: () => void;
}

const SymptomTracker: React.FC<SymptomTrackerProps> = ({ onSave, onCancel }) => {
  const [mood, setMood] = useState(7);
  const [energy, setEnergy] = useState(7);
  const [sleepHours, setSleepHours] = useState(7);
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const handleAddSymptom = () => {
    if (symptomInput.trim()) {
      setSymptoms([...symptoms, symptomInput.trim()]);
      setSymptomInput('');
    }
  };

  const handleRemoveSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: DailyLog = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      mood,
      energy,
      sleepHours,
      symptoms,
      notes
    };
    onSave(newLog);
  };

  const RangeInput = ({ label, value, onChange, min = 1, max = 10, lowLabel = "Low", highLabel = "High", color = "accent-primary-600" }: any) => (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-sm font-bold text-primary-600">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${color}`}
      />
      <div className="flex justify-between mt-1 text-xs text-slate-400">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">New Health Entry</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <RangeInput 
          label="How is your mood today?" 
          value={mood} 
          onChange={setMood}
          lowLabel="Terrible"
          highLabel="Great"
        />
        
        <RangeInput 
          label="Energy Level" 
          value={energy} 
          onChange={setEnergy}
          lowLabel="Exhausted"
          highLabel="Energetic"
          color="accent-amber-500"
        />

        <RangeInput 
          label="Sleep Duration (Hours)" 
          value={sleepHours} 
          onChange={setSleepHours}
          min={0}
          max={12}
          lowLabel="0h"
          highLabel="12h+"
          color="accent-indigo-500"
        />

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Symptoms</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSymptom())}
              placeholder="e.g. Headache, Nausea"
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
            <button
              type="button"
              onClick={handleAddSymptom}
              className="bg-slate-100 text-slate-600 p-2 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((s, i) => (
              <span key={i} className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                {s}
                <button type="button" onClick={() => handleRemoveSymptom(i)} className="hover:text-red-800">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {symptoms.length === 0 && <span className="text-sm text-slate-400">No symptoms recorded.</span>}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Daily Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything else relevant happened today? Medication changes?"
            className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-sm hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Entry
        </button>
      </form>
    </div>
  );
};

export default SymptomTracker;