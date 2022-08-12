import { message } from "antd";
import { useState } from "react";

export default function useOnNodeFetch() {
  const [result, setResult] = useState<any | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  
  const onFetch = async (
    fetchingFn: any,
    callbacks?: {
      errorCallback?: Function | null;
      onSuccessCallback?: Function | null;
    }
  ) => {
    const { errorCallback, onSuccessCallback } = callbacks ?? {};
    setIsLoading(true);
    try {
      const data = await fetchingFn();
      console.log(data.error)
      // return
      if (data.error) {
        // Fetching error then
        if (errorCallback) errorCallback(data.error);
        setError(data.error);
      } else {
        setIsSuccess(true);
        setError("");
        setResult(data);
        if (onSuccessCallback) onSuccessCallback(data);
      }
    } catch (error: any) {
      // Uncaught exception
      console.log(error);
      
      if (errorCallback)
        errorCallback(
          error.message ?? "Request failed, please refresh the page"
        );
      setError(error.message ?? "Request failed, please refresh the page");
    }
    setIsLoading(false);
  };

  return { onFetch, result, isSuccess, isLoading, error };
}

// const { error, isLoading, isSuccess, onFetch, result } = useOnFetch();
