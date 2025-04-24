<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTrackStore } from '@/stores/trackStore'
import { computed } from 'vue'

const trackStore = useTrackStore()
const { page, limit, total } = storeToRefs(trackStore)

function goPrev() {
    if (page.value > 1) page.value--
}

function goNext() {
    const totalPages = computed(() => Math.ceil(total.value / limit.value))
    if (page.value < totalPages.value) page.value++
}
</script>

<template>
    <el-affix position="bottom" :offset="40">
        <div class="custom-pagination-wrapper" data-testid="pagination">
            <button v-show="total" @click="goPrev" :disabled="page === 1" data-testid="pagination-prev">
                ⬅ Prev
            </button>

            <el-pagination v-model:current-page="page" v-model:page-size="limit" :total="total"
                :page-sizes="[5, 10, 15, 20]" layout="total, sizes, pager, jumper" background hide-on-single-page
                class="hidden-native-nav" />

            <button v-show="total" @click="goNext" :disabled="page >= Math.ceil(total / limit)" data-testid="pagination-next">
                Next ➡
            </button>
        </div>
    </el-affix>

</template>

<style scoped>
.custom-pagination-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    background-color: #0000009d;
    padding: 10px;
    width: 100%;
    border-radius: 20px;
}

:deep(.el-pagination__prev),
:deep(.el-pagination__next) {
    display: none !important;
}
</style>