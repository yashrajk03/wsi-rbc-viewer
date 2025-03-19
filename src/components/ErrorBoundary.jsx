import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1 className="text-red-500 text-center mt-10">Something went wrong. Please try again.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;