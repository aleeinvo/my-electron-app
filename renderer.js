Vue.createApp({
    data() {
        return {
            author: 'Alee Dhillon',
            pageTitle: 'My Electron App',
            filePath: '',
            counter: 0
        }
    },
    methods: {
        updateTitle(e) {
            window.electronAPI.setTitle(e.target.value);
        },
        async selectFile() {
            this.filePath = await window.electronAPI.openFile();
        }
    },
    created() {
        window.electronAPI.onPlusCounter(_event => {
            _event.sender.send('counter-value', ++this.counter);
        });

        window.electronAPI.onMinusCounter(_event => {
            _event.sender.send('counter-value', --this.counter);
        })
    }
}).mount('#app');