import { message, Popconfirm } from "antd";
import React from "react";
import useOnNodeFetch from "../../hooks/useOnFetch";
export const DynamicPopConfirm = ({
  children,
  promiseFunction,
  title,
  onSuccess,
  onError,
}: any) => {
  const { error, isLoading, isSuccess, onFetch, result } = useOnNodeFetch();
  const confirm = async () => {
    await onFetch(promiseFunction, {
      errorCallback: async (error: any) => {
        if(onError) await onError(error);
        // message.error(error, 5);
      },
      onSuccessCallback:async (result:any) =>{
          if(onSuccess) await onSuccess(result);
      }
    });
  };

  return (
    <Popconfirm
    overlayStyle={{ zIndex: 9999 }}
      title={title ?? "Delete?"}
      onConfirm={confirm}
      okButtonProps={{ loading: isLoading }}
    >
      {children}
    </Popconfirm>
  );
};
