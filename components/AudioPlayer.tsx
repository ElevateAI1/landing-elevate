
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Music } from 'lucide-react';

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load preference from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('audioEnabled');
    const savedVolume = localStorage.getItem('audioVolume');
    const savedExpanded = localStorage.getItem('audioExpanded');
    
    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
      if (audioRef.current) {
        audioRef.current.volume = vol;
      }
    }

    if (savedExpanded === 'true') {
      setIsExpanded(true);
    }
  }, []);

  // Update audio time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    const newState = !isPlaying;
    setIsPlaying(newState);
    localStorage.setItem('audioEnabled', String(newState));
    
    if (newState) {
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        localStorage.setItem('audioEnabled', 'false');
      });
    } else {
      audioRef.current.pause();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    localStorage.setItem('audioVolume', String(newVolume));
  };

  const toggleExpand = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem('audioExpanded', String(newState));
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        loop
        preload="metadata"
        className="hidden"
      >
        <source src="/ambient.mp3" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>

      {/* Compact Audio Player - Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2"
      >
        {/* Glassmorphism Container */}
        <motion.div
          animate={{
            width: isExpanded ? 240 : 44,
            height: isExpanded ? 100 : 44,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative"
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.01)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.03)',
            }}
          >
            {/* Content */}
            <div className="relative flex flex-col items-center justify-center p-1.5 h-full gap-1">
              {/* Compact Mode - Music Icon Button */}
              {!isExpanded && (
                <motion.button
                  onClick={togglePlay}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-full h-full rounded-xl flex items-center justify-center transition-all"
                >
                  {/* Music Icon */}
                  <AnimatePresence mode="wait">
                    {isPlaying ? (
                      <motion.div
                        key="music-playing"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10"
                      >
                        <Music 
                          size={20} 
                          className="text-emerald-400"
                          style={{
                            filter: isPlaying && !isMuted ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 12px rgba(16, 185, 129, 0.4))' : 'none',
                          }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="music-paused"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10"
                      >
                        <Music 
                          size={20} 
                          className="text-gray-400"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}

              {/* Expanded Mode */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full flex flex-col gap-1.5 px-2 py-1.5"
                  >
                    {/* Top Row: Music Icon, Play/Pause, Time, and Volume (Horizontal) */}
                    <div className="flex items-center gap-2">
                      {/* Music Icon */}
                      <motion.div
                        className="relative flex-shrink-0"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Music 
                          size={18} 
                          className={isPlaying && !isMuted ? "text-emerald-400" : "text-gray-400"}
                          style={{
                            filter: isPlaying && !isMuted ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.7)) drop-shadow(0 0 10px rgba(16, 185, 129, 0.4))' : 'none',
                          }}
                        />
                      </motion.div>

                      {/* Play/Pause Button */}
                      <motion.button
                        onClick={togglePlay}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-shrink-0 w-7 h-7 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 rounded-full flex items-center justify-center transition-all"
                      >
                        <AnimatePresence mode="wait">
                          {isPlaying ? (
                            <motion.div
                              key="pause"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Pause size={11} className="text-emerald-400" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="play"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Play size={11} className="text-emerald-400 ml-0.5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>

                      {/* Time Display */}
                      <div className="flex-1 text-[10px] text-gray-400 font-mono text-right">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>

                      {/* Volume Control - Horizontal */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <motion.button
                          onClick={toggleMute}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-emerald-400 transition-colors"
                        >
                          {isMuted ? (
                            <VolumeX size={11} />
                          ) : (
                            <Volume2 size={11} />
                          )}
                        </motion.button>
                        
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-16 h-0.5 bg-neutral-800/50 rounded-full appearance-none cursor-pointer accent-emerald-500"
                          style={{
                            background: `linear-gradient(to right, #10b981 0%, #10b981 ${(isMuted ? 0 : volume) * 100}%, #374151 ${(isMuted ? 0 : volume) * 100}%, #374151 100%)`
                          }}
                        />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={(e) => {
                        if (!audioRef.current) return;
                        const newTime = parseFloat(e.target.value);
                        audioRef.current.currentTime = newTime;
                        setCurrentTime(newTime);
                      }}
                      className="w-full h-0.5 bg-neutral-800/50 rounded-full appearance-none cursor-pointer accent-emerald-500"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${duration ? (currentTime / duration) * 100 : 0}%, #374151 ${duration ? (currentTime / duration) * 100 : 0}%, #374151 100%)`
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Expand/Collapse Button - Outside container, to the left */}
        <motion.button
          onClick={toggleExpand}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-emerald-400 transition-colors rounded-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.01)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.03)',
          }}
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="collapse"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
              >
                <ChevronRight size={14} />
              </motion.div>
            ) : (
              <motion.div
                key="expand"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
              >
                <ChevronLeft size={14} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </>
  );
};

export default AudioPlayer;
