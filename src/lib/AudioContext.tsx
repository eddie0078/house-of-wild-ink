"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AudioTrack {
  id: string;
  title: string;
  subtitle?: string;
  narrator?: string;
  duration?: string;
  coverUrl?: string;
  youtubeUrl?: string;
}

interface AudioContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  playbackSpeed: number;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  closePlayer: () => void;
  setSpeed: (speed: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const playTrack = (track: AudioTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const closePlayer = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  const setSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playbackSpeed,
        playTrack,
        pauseTrack,
        togglePlay,
        closePlayer,
        setSpeed,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
