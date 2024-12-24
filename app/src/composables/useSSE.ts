import { ref, Ref, onUnmounted } from "vue";

interface EventData {
    [key: string]: any;
}

export function useSSE(url: string): { evt: Ref<EventData | null> } {
    const evt = ref<EventData | null>(null);
    const source = new EventSource(url);

    source.onmessage = (event: MessageEvent) => {
        try {
            const data: EventData = JSON.parse(event.data);
            evt.value = data;
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
