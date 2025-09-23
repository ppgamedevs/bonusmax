import { useState } from 'react';

export default function FeedbackWidget() {
  const [voted, setVoted] = useState(false);
  const [yes, setYes] = useState(0);
  const [no, setNo] = useState(0);

  const handleVote = (isYes: boolean) => {
    if (isYes) setYes((y) => y + 1);
    else setNo((n) => n + 1);
    setVoted(true);
    console.log('help-feedback', isYes ? 'yes' : 'no');
  };

  if (voted) {
    return <div className="text-zinc-400 text-center py-4">MulÃˆâ€ºumim pentru feedback!</div>;
  }

  return (
    <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/50">
      <p className="mb-4 text-zinc-100">A fost util?</p>
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => handleVote(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Da
        </button>
        <button
          onClick={() => handleVote(false)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Nu
        </button>
      </div>
    </div>
  );
}
