import { onMounted, ref } from "vue";
import useAPIRequest from "./useAPIRequest";

interface IMetrics {
    connectedPlayers: number;
}

const useMetrics = () => {

    const data = ref<IMetrics|null>(null);
    const error = ref<Error|undefined>(undefined);
    const isLoading = ref<boolean>(false);

    onMounted(async () => {
        isLoading.value = true;
        try {
            const {handleRequest} = useAPIRequest<IMetrics>({
                method: "GET",
                endpoint: "/metrics"
            });
            data.value = await handleRequest();
        } catch(e) {
            error.value = e as Error;
        } finally {
            isLoading.value = false;
        }
    });

    return {
        data,
        isLoading,
        error
    }

}

export default useMetrics;