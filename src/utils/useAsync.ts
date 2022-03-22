import { ref } from "vue";

// enum Status {
//   idle,
//   loading,
//   success,
//   error,
// }
// interface State<D> {
//   status: Status;
//   data: D | null;
//   error: Error | null;
// }
// const defaultInitialState: State<null> = {
//   status: Status.idle,
//   data: null,
//   error: null,
// };
// export const useAsync = <D>(promise: Promise<D>) => {
//   const state: State<D> = reactive(defaultInitialState);
//   const setState = () => {
//     state.status = Status.loading;
//     return promise
//       .then((data) => {
//         state.status = Status.success;
//         state.data = data;
//       })
//       .catch((error) => {
//         state.status = Status.error;
//         state.error = error;
//       });
//   };
//   return {
//     isIdle: state.status === Status.idle,
//     isLoading: state.status === Status.loading,
//     isSuccess: state.status === Status.success,
//     isError: state.status === Status.error,
//     setState,
//     ...toRefs(state),
//   };
// };

export const useAsync = <D>(promise: Promise<D>) => {
  const loading = ref(false);
  const data = ref<D>();
  const error = ref<Error | null>(null);

  const setData = () => {
    loading.value = true;
    return promise
      .then((res) => (data.value = res))
      .catch((err) => (error.value = err))
      .finally(() => (loading.value = false));
  };

  return {
    loading,
    error,
    data,
    setData,
  };
};
