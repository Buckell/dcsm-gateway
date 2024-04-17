const GADE = {
    receiveOnce: (id: string, callback: (...args: any[]) => void) =>
        window.electron.ipcRenderer.once(id, callback),
    send: (id: string, ...args: any[]) =>
        window.electron.ipcRenderer.sendMessage(id, ...args),
    call: (channel: string, ...args: any[]) =>
        new Promise((resolve) => {
            GADE.send(channel, ...args);
            GADE.receiveOnce(channel, resolve);
        }),
};

export default GADE;
