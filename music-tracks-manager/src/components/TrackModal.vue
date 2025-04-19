<script>
defineProps({
    track: Object,
    visible: Boolean
})

const emit = defineEmits(['save', 'close']);

const form = reactive({ id: null, title: '', artist: '', url: '' });

watchEffect(() => {
    if (props.track) {
        Object.assign(form, props.track);
    } else {
        form.id = null; form.title = ''; form.artist = ''; form.url = '';
    }
})

const dialogTitle = computed(() => props.track ? 'Edit Track' : 'New Track')

function onClose() {
    emit('close');
}

function submitForm() {
    emit('save', { ...form });
}

</script>

<template>
    <el-dialog v-model="visible" :title="dialogTitle" @close="onClose">
        <el-form :model="form">
            <el-form-item label="Title">
                <el-input v-model="form.title" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Artist">
                <el-input v-model="form.artist" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Audio URL">
                <el-input v-model="form.url" placeholder="http://...mp3" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="onClose">Cancel</el-button>
            <el-button type="primary" @click="submitForm">Save</el-button>
        </template>
    </el-dialog>
</template>