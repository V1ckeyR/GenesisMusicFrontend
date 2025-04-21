<template>
    <el-skeleton animated>
      <template #template>
        <div class="track-card">
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
        padding: 10px;
        transition: background-color 0.3s;
        cursor: pointer;
        border-radius: 20px;
        min-width: 400px;
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
  