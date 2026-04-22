'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface RecordingSectionProps {
  taskType: 'tache2' | 'tache3'
}

const DURATIONS = {
  tache3: 4 * 60 + 15,
  tache2: 5 * 60,
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

type RecordingState = 'idle' | 'recording' | 'paused' | 'done'

export default function RecordingSection({ taskType }: RecordingSectionProps) {
  const totalSeconds = DURATIONS[taskType]
  const [state, setState] = useState<RecordingState>('idle')
  const [timeLeft, setTimeLeft] = useState(totalSeconds)
  const [elapsed, setElapsed] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [speechSupported, setSpeechSupported] = useState(true)
  const [copied, setCopied] = useState(false)

  const recognitionRef = useRef<any>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stateRef = useRef<RecordingState>('idle')

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    stopTimer()
    timerRef.current = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1
        setTimeLeft(Math.max(0, totalSeconds - next))
        if (next >= totalSeconds) {
          setState('done')
          stateRef.current = 'done'
          stopTimer()
        }
        return next
      })
    }, 1000)
  }, [totalSeconds, stopTimer])

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) setSpeechSupported(false)
    return () => stopTimer()
  }, [stopTimer])

  function initSpeechRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return null

    const recognition = new SpeechRecognition()
    recognition.lang = 'fr-FR'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event: any) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript + ' '
        } else {
          interim += result[0].transcript
        }
      }
      if (final) setTranscript((prev) => prev + final)
      setInterimText(interim)
    }

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') return
    }

    recognition.onend = () => {
      if (stateRef.current === 'recording') {
        try { recognition.start() } catch {}
      }
    }

    return recognition
  }

  function startRecording() {
    const recognition = initSpeechRecognition()
    if (recognition) {
      recognitionRef.current = recognition
      try { recognition.start() } catch {}
    }
    stateRef.current = 'recording'
    setState('recording')
    startTimer()
  }

  function pauseRecording() {
    stateRef.current = 'paused'
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
    }
    stopTimer()
    setState('paused')
  }

  function resumeRecording() {
    stateRef.current = 'recording'
    if (recognitionRef.current) {
      try { recognitionRef.current.start() } catch {}
    }
    startTimer()
    setState('recording')
  }

  function stopRecording() {
    stateRef.current = 'done'
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
      recognitionRef.current = null
    }
    setInterimText('')
    stopTimer()
    setState('done')
  }

  function resetRecording() {
    stateRef.current = 'idle'
    stopTimer()
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
      recognitionRef.current = null
    }
    setState('idle')
    setTimeLeft(totalSeconds)
    setElapsed(0)
    setTranscript('')
    setInterimText('')
    setCopied(false)
  }

  function copyTranscript() {
    if (!transcript) return
    navigator.clipboard.writeText(transcript).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const progressPercent = (elapsed / totalSeconds) * 100

  return (
    <div className="rounded-2xl border-2 border-surface-3 overflow-hidden">
      <div className="p-4 bg-surface-1 border-b border-surface-3">
        <p className="font-semibold text-ink-1">🎙️ Entraînement</p>
        <p className="text-xs text-ink-3 mt-0.5">
          Durée: {formatTime(totalSeconds)}
          {!speechSupported && (
            <span className="ml-2 text-amber-500">⚠️ Utilisez Chrome pour la transcription</span>
          )}
        </p>
      </div>

      <div className="p-6 flex flex-col items-center gap-5">
        {/* Timer */}
        <div className="text-center">
          <p className={`text-5xl font-bold tabular-nums tracking-tight
            ${timeLeft < 30 && state === 'recording' ? 'text-rose-500' : 'text-ink-1'}`}>
            {formatTime(timeLeft)}
          </p>
          <p className="text-xs text-ink-4 mt-1">
            {state === 'idle' && 'Appuyez pour commencer'}
            {state === 'recording' && '🔴 En cours...'}
            {state === 'paused' && '⏸ En pause'}
            {state === 'done' && '✅ Terminé !'}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000
              ${state === 'recording' ? 'bg-gradient-to-r from-brand-400 to-brand-600' : 'bg-surface-3'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Mic button */}
        <div className="relative">
          {state === 'recording' && (
            <div className="absolute inset-0 rounded-full bg-rose-400 opacity-30 recording-pulse" />
          )}
          <button
            onClick={
              state === 'idle' ? startRecording
              : state === 'recording' ? pauseRecording
              : state === 'paused' ? resumeRecording
              : undefined
            }
            disabled={state === 'done'}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center text-4xl
              shadow-xl active:scale-95 transition-all
              ${state === 'idle'
                ? 'bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-sky-300'
                : state === 'recording'
                ? 'bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-rose-300'
                : state === 'paused'
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-orange-300'
                : 'bg-surface-2 text-ink-4'
              }`}
          >
            {state === 'idle' && '🎤'}
            {state === 'recording' && '⏸'}
            {state === 'paused' && '▶️'}
            {state === 'done' && '✅'}
          </button>
        </div>

        {/* Stop / Reset */}
        <div className="flex gap-3 w-full">
          {(state === 'recording' || state === 'paused') && (
            <button
              onClick={stopRecording}
              className="flex-1 py-3 rounded-xl border-2 border-rose-200 text-rose-500
                font-semibold text-sm active:bg-rose-50 transition-colors"
            >
              ⏹ Arrêter
            </button>
          )}
          {state === 'done' && (
            <button
              onClick={resetRecording}
              className="flex-1 py-3 rounded-xl border-2 border-surface-3 text-ink-3
                font-semibold text-sm active:bg-surface-2 transition-colors"
            >
              🔄 Recommencer
            </button>
          )}
        </div>

        {/* Live transcript */}
        {state !== 'idle' && (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-ink-3 uppercase tracking-widest">
                📝 Transcription
              </p>
              {state === 'recording' && (
                <span className="text-xs text-rose-400 font-medium">🔴 En direct</span>
              )}
            </div>

            <div className="w-full min-h-[80px] bg-surface-1 border border-surface-3 rounded-xl p-3 text-sm text-ink-2 leading-relaxed">
              {transcript || interimText ? (
                <>
                  <span>{transcript}</span>
                  {interimText && (
                    <span className="text-ink-4 italic">{interimText}</span>
                  )}
                </>
              ) : (
                <span className="text-ink-4 italic">
                  {speechSupported
                    ? 'Parlez... le texte apparaîtra ici'
                    : 'Transcription non disponible — utilisez Chrome ou Edge'}
                </span>
              )}
            </div>

            {transcript && state === 'done' && (
              <button
                onClick={copyTranscript}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95
                  ${copied
                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                    : 'bg-brand-500 text-white shadow-md shadow-sky-200'
                  }`}
              >
                {copied ? '✅ Copié dans le presse-papier !' : '📋 Copier pour le Feedback'}
              </button>
            )}
          </div>
        )}

        {state === 'done' && elapsed > 30 && (
          <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center animate-bounce-in">
            <p className="text-emerald-700 font-semibold">Excellent travail ! 💪</p>
            <p className="text-emerald-600 text-sm mt-0.5">
              Tu as parlé pendant {formatTime(elapsed)}
            </p>
            {transcript && (
              <p className="text-emerald-600 text-xs mt-1">
                Copie le texte ci-dessus → colle dans 📊 Feedback
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
