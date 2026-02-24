//! React Core
import { Component, type ReactNode, type ErrorInfo } from 'react';

//* Pages
import ErrorPage from '../../pages/ErrorPage';

//? Types
interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error('[ErrorBoundary]', error, errorInfo);
	}

	private handleReset = (): void => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return <ErrorPage onReset={this.handleReset} />;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
