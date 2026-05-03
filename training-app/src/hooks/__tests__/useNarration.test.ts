import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useNarration } from "../../hooks/useNarration";

// Minimal speechSynthesis stub — the hook registers onvoiceschanged and calls getVoices
const speechSynthesisStub = {
  getVoices: vi.fn().mockReturnValue([]),
  cancel: vi.fn(),
  speak: vi.fn(),
  onvoiceschanged: null as (() => void) | null,
};

describe("useNarration (hooks/useNarration.ts)", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("net::ERR_CONNECTION_REFUSED")),
    );
    vi.stubGlobal("speechSynthesis", speechSynthesisStub);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("initializes with playing set to false", () => {
    const { result } = renderHook(() => useNarration());
    expect(result.current.playing).toBe(false);
  });

  it("initializes with an empty availableVoices array", () => {
    const { result } = renderHook(() => useNarration());
    expect(result.current.availableVoices).toEqual([]);
  });

  it("initializes with an empty selected voice string", () => {
    const { result } = renderHook(() => useNarration());
    expect(result.current.voice).toBe("");
  });

  it("serverAvailable is false when the health-check fetch rejects", async () => {
    const { result } = renderHook(() => useNarration());
    await waitFor(() => {
      // The async init effect resolves; fetch rejected so server is unavailable
      expect(result.current.serverAvailable).toBe(false);
    });
  });

  it("setSpeed updates the speed state", () => {
    const { result } = renderHook(() => useNarration());
    act(() => {
      result.current.setSpeed(1.5);
    });
    expect(result.current.speed).toBe(1.5);
  });

  it("setVoice updates the voice state", () => {
    const { result } = renderHook(() => useNarration());
    act(() => {
      result.current.setVoice("en-US-AriaNeural");
    });
    expect(result.current.voice).toBe("en-US-AriaNeural");
  });
});
