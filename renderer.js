Vue.createApp({
    data() {
        return {
            author: 'Alee Dhillon',
            pageTitle: 'My Electron App',
            filePath: ''
        }
    },
    methods: {
        updateTitle(e) {
            window.electronAPI.setTitle(e.target.value);
        },
        async selectFile() {
            this.filePath = await window.electronAPI.openFile();
        }
    }
}).mount('#app');