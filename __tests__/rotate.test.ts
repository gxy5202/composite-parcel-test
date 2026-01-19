import { describe, expect, test } from "bun:test";
import VideoRoll from "../src/inject/VideoRoll";

function expectWithinRange(value: number, floor: number, ceiling: number) {
  expect(value).toBeGreaterThanOrEqual(floor);
  expect(value).toBeLessThanOrEqual(ceiling);
}

function expectScaleWithinRange(
  actual: [number, number],
  xRange: [number, number],
  yRange: [number, number]
) {
  expectWithinRange(actual[0], xRange[0], xRange[1]);
  expectWithinRange(actual[1], yRange[0], yRange[1]);
}

function getMockVideo(params: {
  videoWidth: number;
  videoHeight: number;
  wrapWidth: number;
  wrapHeight: number;
}) {
  const { videoWidth, videoHeight, wrapWidth, wrapHeight } = params;

  return {
    videoWidth,
    videoHeight,
    offsetWidth: wrapWidth,
    offsetHeight: wrapHeight,
  } as HTMLVideoElement;
}

describe("test auto scale", () => {
  test("horizontal wrap and horizontal video", () => {
    const video = getMockVideo({
      videoWidth: 800,
      videoHeight: 400,
      wrapWidth: 800,
      wrapHeight: 400,
    });

  expectScaleWithinRange(VideoRoll.getScaleNumber(video, 90), [0.5, 0.6], [0.5, 0.6]);
  expectScaleWithinRange(VideoRoll.getScaleNumber(video, 180), [1, 1], [1, 1]);
  expectScaleWithinRange(VideoRoll.getScaleNumber(video, 270), [0.5, 0.6], [0.5, 0.6]);
  expectScaleWithinRange(VideoRoll.getScaleNumber(video, 0), [1, 1], [1, 1]);
  });

  test("horizontal wrap and vertical video", () => {
    const video1 = getMockVideo({
      videoWidth: 200,
      videoHeight: 800,
      wrapWidth: 800,
      wrapHeight: 400,
    });

  expectScaleWithinRange(VideoRoll.getScaleNumber(video1, 90), [2, 2], [2, 2]);
  expectScaleWithinRange(VideoRoll.getScaleNumber(video1, 180), [1, 1], [1, 1]);
  expectScaleWithinRange(VideoRoll.getScaleNumber(video1, 270), [2, 2], [2, 2]);
  expectScaleWithinRange(VideoRoll.getScaleNumber(video1, 0), [1, 1], [1, 1]);

    const video2 = getMockVideo({
      videoWidth: 720,
      videoHeight: 1280,
      wrapWidth: 720,
      wrapHeight: 405,
    });

  expectScaleWithinRange(VideoRoll.getScaleNumber(video2, 90), [1.7, 1.8], [1.7, 1.8]);
  expectScaleWithinRange(VideoRoll.getScaleNumber(video2, 180), [1, 1], [1, 1]);
  expectScaleWithinRange(VideoRoll.getScaleNumber(video2, 270), [1.7, 1.8], [1.7, 1.8]);
  expectScaleWithinRange(VideoRoll.getScaleNumber(video2, 0), [1, 1], [1, 1]);
  });
});