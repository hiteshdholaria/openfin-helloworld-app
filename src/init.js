document.addEventListener("DOMContentLoaded", function(){
    init();
});

function init(){
	createClient('tradesmart-channel-qa').then(() => {
		console.log('Central app invoked createClient...');
	});
}

async function createClient(channelName) {
   const clientBus = await fin.InterApplicationBus.Channel.connect(channelName);
   console.log('Connected to', channelName);

   const response1 = await clientBus.dispatch('tradesmart-channel-connect-qa', {});
   console.log('Channel provider invoked tradesmart-channel-connect-qa action with payload:', response1);
   const response2 = await clientBus.dispatch('tradesmart-channel-grant-code-listen-qa', {});
   console.log('Channel provider invoked tradesmart-channel-grant-code-listen-qa action with payload:', response2);

   clientBus.onDisconnection(channelInfo => {
       createClient(channelInfo.channelName);
   })

   clientBus.register('tradesmart-channel-grant-code-request-qa', (payload, identity) => {
       console.log('Channel provider dispatched tradesmart-channel-grant-code-request-qa action:', JSON.stringify(identity));
       console.log('Channel provider dispatched tradesmart-channel-grant-code-request-qa action:', JSON.stringify(payload));
       return {account:"pirimid10",grantCode:"qwerty"};
   });
}