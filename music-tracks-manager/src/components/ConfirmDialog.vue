<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { eventBus } from '@/services/eventBus'

const isVisible = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')
const confirmButtonText = ref('Yes')
const cancelButtonText = ref('Cancel')
let resolveFn: (value: boolean) => void

onMounted(() => {
    eventBus.on('open-confirm', ({ title, message, options, resolve }) => {
        dialogTitle.value = title
        dialogMessage.value = message
        confirmButtonText.value = options?.confirmButtonText || 'Yes'
        cancelButtonText.value = options?.cancelButtonText || 'Cancel'
        resolveFn = resolve
        isVisible.value = true
    })
})

function onConfirm() {
    isVisible.value = false
    resolveFn(true)
}

function onCancel() {
    isVisible.value = false
    resolveFn(false)
}
</script>

<template>
    <el-dialog v-model="isVisible" :title="dialogTitle" width="400px" :close-on-click-modal="false"
        data-testid="confirm-dialog">
        <span>{{ dialogMessage }}</span>
        <template #footer>
            <el-button @click="onCancel" data-testid="cancel-delete">{{ cancelButtonText }}</el-button>
            <el-button type="primary" @click="onConfirm" data-testid="confirm-delete">{{ confirmButtonText }}</el-button>
        </template>
    </el-dialog>
</template>
