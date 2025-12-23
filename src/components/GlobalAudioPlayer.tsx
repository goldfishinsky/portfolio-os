'use client';

import React, { useEffect, useRef } from 'react';
import { useMusicStore } from '../store/musicStore';
import { useOSStore } from '../store/osStore';

export const GlobalAudioPlayer: React.FC = () => {
  const { 
    playlist, 
    currentSongIndex, 
    isPlaying, 
    volume, 
    isLoop,
    setIsLoop,
    togglePlay, 
    playNext, 
    setProgress, 
    setDuration 
  } = useMusicStore();

  const { windows } = useOSStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = playlist[currentSongIndex];

  // Logic to stop playback if the music app is completely closed (not present in windows list)
  // HOWEVER, the requirement is "minimization leads to status bar", but "closing" usually stops it.
  // But wait, if I want persistent playback even if I close the window (like Spotify on Mac closing the window but app stays open),
  // I would need a concept of "App Running" vs "Window Open".
  // For simplicity and standard web-os behavior:
  // If window is CLOSED (Red X), we stop music. 
  // If window is MINIMIZED (Yellow -), music continues.
  // The store state `isPlaying` drives the audio.
  
  // Let's watch for the window existence.
  useEffect(() => {
    const musicWindow = windows.find(w => w.appId === 'music-player');
    if (!musicWindow && isPlaying) {
      // If window is gone but music is playing, stop it?
      // User said: "minimization leads to status bar".
      // Usually "Red X" means CLOSE app in this OS.
      // So yes, if window is gone, stop music.
      togglePlay(false);
    }
  }, [windows, isPlaying, togglePlay]);

  useEffect(() => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Play failed:", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying, currentSong]); // currentSong dependency ensures we replay/reload if song changes

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle seeking from store updates logic if needed?
  // Use a different mechanism for seeking efficiently to avoid re-renders loop?
  // Actually, standard is usually UI calls store -> ref updates time.
  // But here GlobalPlayer owns the Ref.
  // We might need an event listener or a subscription to the store for 'seek' events 
  // OR we just expose a setter in store that calls a side effect?
  // Zustand subscribe is good for this.
  
  // For now, let's assume the UI updates `audioRef.current.currentTime` directly? 
  // No, UI cannot access this ref.
  // We should probably add a `seekTime` timestamp to the store to trigger seeks.
  // Or just rely on the UI updating the store's `progress` and we watch it?
  // Watching `progress` in useEffect would cause loop if we update `progress` from `onTimeUpdate`.
  // Solution: Add `seekTo` in store which is a trigger value (e.g. timestamp or null).
  
  // Correcting MusicStore to handle seek properly is better.
  // But for now, let's just make the UI controls update the store `progress`, 
  // and we only sync `progress` -> `audio.currentTime` if the difference is large (seek).
  
  useEffect(() => {
    const unsub = useMusicStore.subscribe((state, prevState) => {
        if (audioRef.current && Math.abs(state.progress - audioRef.current.currentTime) > 1) {
            // Probably a seek action occurred
             audioRef.current.currentTime = state.progress;
        }
    });
    return unsub;
  }, []);


  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (isLoop) {
      playNext();
    } else {
      togglePlay(false);
    }
  };

  if (!currentSong) return null;

  return (
    <audio 
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        loop={false} // We handle loop manually for playlist support
    />
  );
};
