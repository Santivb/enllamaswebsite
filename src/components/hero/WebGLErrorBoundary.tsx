"use client";

import { Component, type ReactNode } from "react";

type Props = { fallback: ReactNode; children: ReactNode };
type State = { hasError: boolean };

/**
 * Three.js/WebGL can throw at runtime even when a context nominally exists
 * (driver quirks, sandboxed/headless browsers, context loss). Without this,
 * an R3F crash takes down the whole page instead of just the hero graphic.
 */
export default class WebGLErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("3D hero scene failed, falling back to static logo:", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
