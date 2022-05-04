Vue.createApp({
    data() {
        return {
            author: 'Alee Dhillon',
            pageTitle: 'My Electron App'
        }
    },
    methods: {
        updateTitle(e) {
            window.electronAPI.setTitle(e.target.value);
        }
    }
}).mount('#app');