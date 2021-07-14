document.addEventListener("DOMContentLoaded", function(){
    init();
});

function init(){
    const launchTradeSmartButton = document.getElementById('launch-tradesmart');
    launchTradeSmartButton.addEventListener('click', launchTradeSmart);

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


function launchTradeSmart() {
	fin.desktop.System.launchExternalProcess({
		path: "C\:\\Users\\Hitesh\\Documents\\Code\\client\\apps\\tradesmart\\target\\tradesmart-standalone.dir\\tradesmart-distribution-2021.3.x-SNAPSHOT\\bin\\TS.exe",
		arguments: "-J-DWaitForBidFXCentral -J-DBidFXCentralEnvironment=QA",
		listener: function (result) {
			console.log('the exit code', result.exitCode);
		}
	}, function (payload) {
		console.log('Success:', payload.uuid);
	}, function (error) {
		console.log('Error:', error);
	});
}
