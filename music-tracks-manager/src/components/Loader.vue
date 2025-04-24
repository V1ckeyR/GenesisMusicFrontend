=<template>
    <div v-if="visible" class="loader-overlay" data-testid="loading-indicator">
        <div class="loader" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{ visible: boolean }>()
</script>

<style scoped>
.loader-overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(2px);
}

.loader {
    width: 40px;
    height: 40px;
    border: 4px solid #409eff;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>