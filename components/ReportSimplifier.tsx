import React, { useState } from 'react';
import { simplifyMedicalReport } from '../services/geminiService';
import { SimplifiedReport } from '../types';
import { FileText, Sparkles, ArrowRight, AlertCircle, BookOpen, CheckCircle } from 'lucide-react';

const ReportSimplifier: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimplifiedReport | null>(null);

  const handleSimplify = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await simplifyMedicalReport(input);
      setResult(data);
    } catch (err) {
      setError("Failed to simplify report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 md:pb-0 h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary-500" />
          Medical Report Simplifier
        </h2>
        <p className="text-slate-500 mt-1">
          Paste complex medical notes below to get a plain English explanation.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Input Section */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col">
           <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text here (e.g., 'Patient presents with acute pharyngitis...')"
            className="w-full flex-1 p-4 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary-500/20 text-slate-700 resize-none min-h-[200px]"
          />
          <div className="mt-4 flex justify-between items-center">
             <span className="text-xs text-slate-400">
                Data is processed securely. Do not include PII (Personally Identifiable Information).
             </span>
             <button
              onClick={handleSimplify}
              disabled={loading || !input.trim()}
              className={`px-6 py-2.5 rounded-xl font-medium text-white flex items-center gap-2 shadow-sm transition-all
                ${loading || !input.trim() ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
             >
               {loading ? (
                 <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                 </>
               ) : (
                 <>Simplify <ArrowRight className="w-4 h-4" /></>
               )}
             </button>
          </div>
          {error && (
            <div className="mt-3 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className={`flex-1 transition-all duration-300 ${result ? 'opacity-100' : 'opacity-50 pointer-events-none lg:opacity-100'}`}>
          {result ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="bg-primary-50 p-4 border-b border-primary-100">
                <h3 className="font-bold text-primary-800 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Summary
                </h3>
                <p className="mt-2 text-slate-700 leading-relaxed text-sm">
                  {result.summary}
                </p>
              </div>

              <div className="p-5 space-y-6 overflow-y-auto custom-scrollbar">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-400" /> Key Terms
                  </h4>
                  <div className="grid gap-3">
                    {result.keyTerms.map((term, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="font-semibold text-slate-800 block mb-1">{term.term}</span>
                        <span className="text-sm text-slate-600 block">{term.definition}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Action Items
                  </h4>
                  <ul className="space-y-2">
                    {result.actionItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <FileText className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-medium">Analysis Results</p>
              <p className="text-sm mt-1">Your simplified report will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportSimplifier;