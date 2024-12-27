import { ref, Ref, onUnmounted } from "vue";

interface EventData {
    [key: string]: any;
}

export function useSSE(): { evt: Ref<EventData | null> } {
    const url = import.meta.env.VITE_API_SSE_URL;
    const evt = ref<EventData | null>(null);
    const source = new EventSource(url);

    source.onmessage = (event: MessageEvent) => {
        try {
            const data: EventData = JSON.parse(event.data);
            evt.value = data;

            window.dispatchEvent(new CustomEvent("sse-event", { detail: data }));
        } catch (error) {
            console.error("Error processing SSE event:", error);
        }
    };

    source.onerror = (error) => {
        console.error("SSE error:", error);
    };

    onUnmounted(() => {
        source.close();
    });

    return {
        evt,
    };
}
