import { ref } from "vue";

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
