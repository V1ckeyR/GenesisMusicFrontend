<script setup lang="ts">

const props = defineProps<{ number: number }>()

</script>

<template>
    <el-skeleton animated>
      <template #template>
        <div class="track-card">
          <!-- Number -->
          <div class="track-number-wrapper">
              <span class="track-number">{{ number }}</span>
          </div>
        
          <!-- Обкладинка -->
          <div class="cover">
            <el-skeleton-item variant="image" style="width: 56px; height: 56px; border-radius: 6px;" />
          </div>
  
          <!-- Інформація про трек -->
          <div class="track-info">
            <el-skeleton-item variant="text" style="width: 60%; height: 16px; margin-bottom: 6px;" />
            <el-skeleton-item variant="text" style="width: 80%; height: 12px;" />
          </div>
        </div>
      </template>
    </el-skeleton>
  </template>
  
  <style scoped>
    .track-card {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        transition: background-color 0.3s;
        cursor: pointer;
        border-radius: 20px;
        min-width: 607px;
        max-height: 80px;
    }

    .track-number {
        font-weight: bold;
        color: #aaa;
    }

    .track-number-wrapper {
        width: 1.5em;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-variant-numeric: tabular-nums;
        font-weight: bold;
        color: #bbb;
        margin-right: 0.75rem;
    }

    .cover {
        position: relative;
        margin-right: 12px;
    }

    .track-info {
        flex-grow: 1;
        text-align: start;
    }
</style>
  