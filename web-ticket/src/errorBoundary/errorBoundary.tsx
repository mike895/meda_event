import { Result } from "antd";
import React, { ReactNode } from "react";
interface Props {
  children: ReactNode;
}

interface State {
  // IS THIS THE CORRECT TYPE FOR THE state ?
  hasError: boolean;
  error: string;
}
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: `${error.name}: ${error.message}` };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Uncaught Error", error, errorInfo);
  }

  render() {
    const { error } = this.state as any;
    if (error) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        return <Result status="info" title="Something went wrong" subTitle={error} />;
      } else {
        return (
          <Result
            status="info"
            title={"Something went wrong"}
            subTitle="An error occurred, please refresh your page"
          />
        );
      }
    } else {
      return <>{this.props.children}</>;
    }
  }
}
