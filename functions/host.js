if("serviceWorker" in navigator){
    window.addEventListener('load', async() => {
        try{
            const registration = await navigator.serviceWorker.register('sw.js');
            console.log('service worker registration successful...');
            console.log(`Requested with scope ${registration.scope}`);
        }
        catch(e){
            // debugger;
            console.log('service worker registration failed');
            console.log(e);
        }
    });
}