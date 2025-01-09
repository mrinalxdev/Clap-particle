import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mic } from 'lucide-react';
import { ParticleSystem } from './components/ParticleSystem';
import { AudioAnalyzer } from './components/AudioAnalyzer';

function App() {
  const [audioAnalyzer, setAudioAnalyzer] = useState<AudioAnalyzer | null>(null);
  const [isListening, setIsListening] = useState(false);

  const startAudioAnalysis = async () => {
    const analyzer = new AudioAnalyzer();
    await analyzer.init();
    setAudioAnalyzer(analyzer);
    setIsListening(true);
  };

  useEffect(() => {
    return () => {
      if (audioAnalyzer) {
        audioAnalyzer.cleanup();
      }
    };
  }, [audioAnalyzer]);

  return (
    <div className="w-full h-screen bg-black">
      {!isListening && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            onClick={startAudioAnalysis}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Mic className="w-5 h-5" />
            Start Audio Visualization
          </button>
        </div>
      )}
      
      <Canvas camera={{ position: [0, 0, 5] }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {audioAnalyzer && <ParticleSystem count={2000} audioAnalyzer={audioAnalyzer} />}
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;