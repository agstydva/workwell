import React, { Component } from 'react';
import { ErrorState } from './StateComponents';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console/reporting services in production
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-200">
          <ErrorState 
            title="Aplikasi Mengalami Crash" 
            message="Terjadi kesalahan rendering yang tidak terduga pada halaman ini. Anda dapat mencoba memulihkan status atau kembali ke Beranda."
            error={this.state.error}
            onRetry={this.handleReset}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
