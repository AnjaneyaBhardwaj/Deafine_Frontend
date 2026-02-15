import { useEffect, useState, useRef } from "react";
import {
  getSessionStatus,
  getSessionTranscript,
  createWebSocketConnection,
} from "./api";
import { useNotification } from "./hooks/use-notification";
import { UserNameInput } from "./components/UserNameInput";
import { Layout } from "./components/Layout";
import { ControlPanel } from "./components/ControlPanel";
import { TranscriptBubble } from "./components/TranscriptBubble";
import { NotificationPopup } from "./components/NotificationPopup";
import { cn } from "./lib/utils";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [userName, setUserName] = useState("");
  const [numSpeakers, setNumSpeakers] = useState(2);
  const pollRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [permissionError, setPermissionError] = useState(null);
  const wsRef = useRef(null);
  const audioCtxRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [liveSegments, setLiveSegments] = useState([]);
  const summaryResolveRef = useRef(null);
  const sessionIdRef = useRef(null);
  const liveSegmentsRef = useRef([]);
  const { notify, visualNotification, clearVisualNotification } =
    useNotification();
  const isWebSocketSession = useRef(false); // Track if this is a WS session

  // Debug: Log when visualNotification changes
  useEffect(() => {
    console.log("🔔 App.jsx - visualNotification changed:", visualNotification);
  }, [visualNotification]);

  // Send user name to server when it changes during an active session
  useEffect(() => {
    if (
      userName &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      console.log("📤 Updating user name on server:", userName);
      wsRef.current.send(
        JSON.stringify({
          command: "set_name",
          user_name: userName,
        }),
      );
    }
  }, [userName]);

  useEffect(() => {
    // Poll session status ONLY for file upload sessions, NOT for WebSocket sessions
    console.log(
      "📡 Session polling useEffect triggered. SessionId:",
      sessionId,
      "isWebSocketSession:",
      isWebSocketSession.current,
    );

    if (!sessionId || isWebSocketSession.current) {
      console.log("📡 Skipping polling (WebSocket session or no sessionId)");
      return;
    }

    console.log("📡 Starting REST API polling for session:", sessionId);
    pollRef.current = setInterval(async () => {
      try {
        const s = await getSessionStatus(sessionId);
        if (s.status === "completed" || s.status === "failed") {
          clearInterval(pollRef.current);
          pollRef.current = null;
          if (s.status === "completed") {
            const t = await getSessionTranscript(sessionId);
            setTranscript(t);
            setLoading(false);
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Session polling error:", err.message);
        // Don't show error for WebSocket sessions
        if (!isWebSocketSession.current) {
          setError(err.message || String(err));
        }
        setLoading(false);
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      }
    }, 1500);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [sessionId]);

  // upload audio is removed — live recording only

  // --- Live recording helpers ---
  function startRecording() {
    setPermissionError(null);
    recordedChunksRef.current = [];
    startWsRecording();
  }

  async function stopRecordingAndUpload() {
    return stopWsRecording();
  }

  async function startWsRecording() {
    setPermissionError(null);
    setLiveSegments([]);
    setTranscript(null);
    setSessionId(null);
    setError(null); // Clear previous errors
    isWebSocketSession.current = true; // Mark this as a WebSocket session

    const ws = createWebSocketConnection();
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      console.log("✅ WebSocket opened successfully");
      setRecording(true);

      // Send number of speakers configuration
      console.log("📤 Sending num_speakers to server:", numSpeakers);
      ws.send(
        JSON.stringify({
          command: "set_num_speakers",
          num_speakers: numSpeakers,
        }),
      );

      // Send user name for haptic feedback if available
      if (userName) {
        console.log("📤 Sending user name to server:", userName);
        ws.send(
          JSON.stringify({
            command: "set_name",
            user_name: userName,
          }),
        );
      }
    });

    ws.addEventListener("message", (ev) => {
      try {
        const data = JSON.parse(ev.data);
        console.log("📨 WS message:", data.type, data);
        if (data.type === "connected") {
          setSessionId(data.session_id);
          sessionIdRef.current = data.session_id;
          console.log("🆔 Session ID:", data.session_id);
        } else if (data.type === "transcript") {
          setLiveSegments((s) => {
            const next = [...s, data.segment];
            liveSegmentsRef.current = next;
            return next;
          });

          // Check if haptic feedback should be triggered
          if (data.segment.haptic) {
            console.log("📳 Haptic triggered for segment:", data.segment);
            notify({
              title: "Name Mentioned!",
              body: `${data.segment.speaker_id} mentioned your name: "${data.segment.text}"`,
              haptic: true,
            });
          }
        } else if (data.type === "haptic") {
          // Dedicated haptic event
          console.log("📳 Dedicated haptic event:", data);
          notify({
            title: "Name Mentioned!",
            body: `${data.speaker_id} mentioned your name: "${data.text}"`,
            haptic: true,
          });
        } else if (data.type === "config_confirmed") {
          if (data.num_speakers !== undefined) {
            console.log(`✅ Speakers set to: ${data.num_speakers}`);
          }
          if (data.user_name !== undefined) {
            console.log("✅ User name configured on server:", data.user_name);
          }
        } else if (data.type === "summary") {
          console.log("📊 ========== SUMMARY RECEIVED ==========");
          console.log("📊 Full message:", JSON.stringify(data, null, 2));
          console.log(
            "📊 Summary object:",
            JSON.stringify(data.data.summary, null, 2),
          );
          console.log(
            "📊 Stats object:",
            JSON.stringify(data.data.stats, null, 2),
          );
          console.log(
            "📊 Current segments in ref:",
            liveSegmentsRef.current.length,
          );
          console.log(
            "📊 First 3 segments:",
            liveSegmentsRef.current.slice(0, 3),
          );

          setTranscript((prev) => {
            const finalTranscript = {
              session_id: sessionIdRef.current,
              summary: data.data.summary,
              stats: data.data.stats,
              segments: liveSegmentsRef.current, // Always use segments from ref
            };
            console.log(
              "📊 Setting final transcript with",
              finalTranscript.segments.length,
              "segments",
            );
            console.log(
              "📊 Summary keys:",
              Object.keys(finalTranscript.summary || {}),
            );
            console.log(
              "📊 Has overall summary?",
              !!finalTranscript.summary?.overall,
            );
            return finalTranscript;
          });

          if (summaryResolveRef.current) {
            console.log("✅ Resolving summary promise");
            summaryResolveRef.current();
            summaryResolveRef.current = null;
          } else {
            console.warn("⚠️ Summary received but no resolver waiting!");
          }
        } else if (data.type === "error") {
          console.error("❌ Server error:", data.message);
          setError(data.message || "WebSocket error");
        }
      } catch (e) {
        console.error("WS message parse error", e);
      }
    });

    ws.addEventListener("close", (ev) => {
      console.warn("🔌 WS closed", { code: ev.code, reason: ev.reason });
      setRecording(false);
      wsRef.current = null;

      // Provide user-friendly error messages based on close code
      let errorMsg = "";
      if (ev.code === 1000 || ev.code === 1005) {
        // 1000 = Normal closure
        // 1005 = No status received (browser closes connection cleanly)
        console.log("WebSocket closed normally");
        return;
      } else if (ev.code === 1006) {
        errorMsg = "Connection lost. Server may have restarted or timed out.";
      } else if (ev.code === 1008) {
        errorMsg = "Server rejected connection. Check backend configuration.";
      } else if (ev.code === 1011) {
        errorMsg = "Server error. Check backend logs.";
      } else if (ev.reason) {
        errorMsg = `Connection closed: ${ev.reason}`;
      } else {
        errorMsg = `Connection closed (code ${ev.code})`;
      }

      setError(errorMsg);
    });

    ws.addEventListener("error", (ev) => {
      console.error("❌ WS error event", ev);
      setError("WebSocket connection failed. Check if backend is running.");
    });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;

      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        const downsampled = downsampleBuffer(input, audioCtx.sampleRate, 16000);
        if (!downsampled) return;
        const int16 = floatTo16BitPCM(downsampled);
        try {
          ws.send(int16.buffer);
        } catch (err) {
          console.warn("WS send failed", err);
        }
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);
    } catch (err) {
      setPermissionError(
        "Microphone permission denied or unavailable: " + (err.message || err),
      );
    }
  }

  async function stopWsRecording() {
    const ws = wsRef.current;
    if (!ws) {
      console.warn("No WebSocket to stop");
      return;
    }

    console.log("🛑 Stopping recording, requesting summary...");
    console.log(
      "🛑 WebSocket state:",
      ws.readyState,
      "(0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED)",
    );
    console.log("🛑 Current segments in ref:", liveSegmentsRef.current.length);

    // First, stop the audio processing to prevent more data being sent
    try {
      if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current.onaudioprocess = null;
        processorRef.current = null;
      }
      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect();
        } catch {}
        sourceRef.current = null;
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
        audioCtxRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    } catch (e) {
      console.warn("Error stopping audio", e);
    }

    // Give a small delay to ensure audio processing is complete
    await new Promise((r) => setTimeout(r, 100));

    // Now request summary and wait for it
    let summaryPromise = new Promise((resolve) => {
      summaryResolveRef.current = resolve;
    });

    console.log("📤 Sending get_summary command...");
    console.log("📤 WebSocket ready state:", ws.readyState, "(1 = OPEN)");
    console.log("📤 Current segments count:", liveSegmentsRef.current.length);

    try {
      const command = JSON.stringify({ command: "get_summary" });
      console.log("📤 Command string:", command);
      ws.send(command);
      console.log(
        "✅ Summary request sent successfully, waiting for response...",
      );
    } catch (e) {
      console.error("❌ Could not send get_summary:", e);
      if (summaryResolveRef.current) {
        summaryResolveRef.current();
        summaryResolveRef.current = null;
      }
    }

    // Wait up to 10 seconds for summary (increased from 5)
    console.log("⏳ Waiting for summary (max 10 seconds)...");
    const timeoutPromise = new Promise((r) =>
      setTimeout(() => {
        console.warn("⏱️ TIMEOUT: Summary not received within 10 seconds");
        console.warn("⏱️ Resolver still waiting?", !!summaryResolveRef.current);
        console.warn("⏱️ Current segments:", liveSegmentsRef.current.length);
        r();
      }, 10000),
    );

    try {
      await Promise.race([summaryPromise, timeoutPromise]);
      console.log("✅ Summary received or timeout reached");
    } catch (e) {
      console.error("Summary timeout or error:", e);
    }

    console.log("🧹 Cleaning up summary resolver...");
    // Clean up summary resolver
    summaryResolveRef.current = null;

    // Close the WebSocket connection gracefully
    try {
      ws.close(1000, "Recording stopped by user"); // 1000 = normal closure
      console.log("🔌 Closing WebSocket connection");
    } catch (e) {
      console.warn("Error closing WebSocket:", e);
    }

    wsRef.current = null;
    setRecording(false);
    isWebSocketSession.current = false; // Reset flag

    // Ensure we set final transcript with segments if not already set by summary handler
    setTranscript((prev) => {
      // If summary handler already set everything, keep it
      if (prev && prev.summary && prev.segments && prev.segments.length > 0) {
        console.log(
          "📝 Final transcript already complete from summary handler",
        );
        return prev;
      }

      // Otherwise, ensure segments are saved
      const finalSegments = liveSegmentsRef.current || [];
      console.log(
        "📝 Ensuring final transcript has segments:",
        finalSegments.length,
      );
      return {
        ...(prev || {}),
        session_id: sessionIdRef.current,
        segments: finalSegments,
      };
    });

    liveSegmentsRef.current = [];
    setLiveSegments([]);
  }

  function downsampleBuffer(buffer, sampleRate, outSampleRate) {
    if (outSampleRate === sampleRate) return buffer;
    const sampleRateRatio = sampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0,
        count = 0;
      for (
        let i = offsetBuffer;
        i < nextOffsetBuffer && i < buffer.length;
        i++
      ) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = count ? accum / count : 0;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  function floatTo16BitPCM(float32Array) {
    const l = float32Array.length;
    const buffer = new ArrayBuffer(l * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < l; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new Int16Array(buffer);
  }

  // Haptic feedback is always active by design

  return (
    <>
      <NotificationPopup
        notification={visualNotification}
        onClose={clearVisualNotification}
      />
      <Layout
        rightHeader={
          <UserNameInput
            value={userName}
            onChange={setUserName}
            className="max-w-full sm:max-w-[200px]"
          />
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <aside className="lg:col-span-1">
            <ControlPanel
              onStartRecording={startRecording}
              onStopRecording={stopRecordingAndUpload}
              isRecording={recording}
              isLoading={loading}
              numSpeakers={numSpeakers}
              onNumSpeakersChange={setNumSpeakers}
            />

            {(permissionError || error) && (
              <div
                className={cn(
                  "rounded-lg p-3 sm:p-4 mt-4 text-xs sm:text-sm",
                  permissionError
                    ? "bg-accent border-accent text-accent-foreground border"
                    : "bg-destructive/10 border-destructive/20 text-destructive border",
                )}
              >
                {permissionError
                  ? `Microphone: ${permissionError}`
                  : `Error: ${error}`}
              </div>
            )}
          </aside>

          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {liveSegments && liveSegments.length > 0 && (
              <section className="bg-card rounded-lg shadow-card border border-border p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                  Live Transcript
                </h2>
                <div className="transcript-container max-h-[400px] sm:max-h-[600px] overflow-y-auto space-y-2">
                  {liveSegments.map((segment, idx) => (
                    <TranscriptBubble
                      key={idx}
                      speaker={segment.speaker_id}
                      text={segment.text}
                      isActive={idx === liveSegments.length - 1}
                      isLatest={idx === liveSegments.length - 1}
                    />
                  ))}
                </div>
              </section>
            )}

            {transcript && (
              <section className="bg-card rounded-lg shadow-card border border-border p-4 sm:p-6 mt-0">
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                  Final Transcript
                </h2>
                {transcript.summary && (
                  <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                    <div>
                      <h3 className="text-sm sm:text-md font-medium text-foreground mb-2">
                        Summary
                      </h3>
                      {transcript.summary.overall && (
                        <div className="bg-muted rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                          <strong className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                            Overall:
                          </strong>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {transcript.summary.overall}
                          </p>
                        </div>
                      )}
                      {Object.entries(transcript.summary).map(([key, text]) => {
                        if (key === "overall" || key === "stats") return null;
                        return (
                          <div
                            key={key}
                            className="bg-muted rounded-lg p-3 sm:p-4 mb-3 sm:mb-4"
                          >
                            <strong className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                              {key}:
                            </strong>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {text}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {transcript.stats && (
                      <div className="border-t border-border pt-4 sm:pt-6">
                        <h4 className="text-sm sm:text-md font-medium text-foreground mb-3 sm:mb-4">
                          Statistics
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div className="bg-muted rounded-lg p-3 sm:p-4">
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              Total Speakers:{" "}
                              <span className="font-medium text-foreground">
                                {transcript.stats.total_speakers}
                              </span>
                            </div>
                          </div>
                          <div className="bg-muted rounded-lg p-3 sm:p-4">
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              Total Segments:{" "}
                              <span className="font-medium text-foreground">
                                {transcript.stats.total_segments}
                              </span>
                            </div>
                          </div>
                          {transcript.stats.speakers &&
                            Object.entries(transcript.stats.speakers).map(
                              ([speaker, stats]) => (
                                <div
                                  key={speaker}
                                  className="bg-muted rounded-lg p-3 sm:p-4"
                                >
                                  <div className="text-xs sm:text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">
                                      {speaker}
                                    </span>
                                    : {stats.words} words,{" "}
                                    {Math.round(stats.duration_seconds)}s
                                    speaking time
                                  </div>
                                </div>
                              ),
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="text-sm sm:text-md font-medium text-foreground mb-3 sm:mb-4">
                    Segments
                  </h3>
                  <div className="transcript-container max-h-[300px] sm:max-h-[400px] overflow-y-auto space-y-2">
                    {transcript.segments && transcript.segments.length ? (
                      transcript.segments.map((segment, idx) => (
                        <TranscriptBubble
                          key={idx}
                          speaker={segment.speaker_id}
                          text={segment.text}
                          isActive={false}
                        />
                      ))
                    ) : (
                      <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
                        No segments available
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
