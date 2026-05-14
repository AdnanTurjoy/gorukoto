import React from 'react';
import { Button } from '@/components/ui/button';

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error);
  }
  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="text-2xl font-semibold">কিছু একটা ভুল হয়েছে</h1>
          <p className="text-muted-foreground">{this.state.error?.message ?? 'Unexpected error'}</p>
          <Button onClick={this.reset}>আবার চেষ্টা করুন</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
