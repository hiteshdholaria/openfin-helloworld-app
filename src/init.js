document.addEventListener("DOMContentLoaded", function(){
    init();
});

function init(){
//	alert("Hello, world!");
	createClient('openfin-test-channel').then(() => {
		console.log('Invoked createClient');
	});
}


async function createClient(channelName) {
   // If the channel has been created this request will be sent to the provider.
   // If not, the promise will not be resolved or rejected until the channel has been created.
   const clientBus = await fin.InterApplicationBus.Channel.connect(channelName);

   clientBus.onDisconnection(channelInfo => {
       // handle the channel lifecycle here - we can connect again which will return a promise
       // that will resolve if/when the channel is re-created.
       createClient(channelInfo.channelName);
   })

   clientBus.register('openfin-action', (payload, identity) => {
       // register a callback for a topic to which the channel provider can dispatch an action
       console.log('Action dispatched by provider: ', JSON.stringify(identity));
       console.log('Payload sent in dispatch: ', JSON.stringify(payload));
       return {
           echo: payload
       };
   });
}