import com.openfin.desktop.Application;
import com.openfin.desktop.AsyncCallback;
import com.openfin.desktop.DesktopConnection;
import com.openfin.desktop.DesktopException;
import com.openfin.desktop.DesktopStateListener;
import com.openfin.desktop.RuntimeConfiguration;
import com.openfin.desktop.channel.Channel;
import com.openfin.desktop.channel.ChannelProvider;

import java.io.PrintStream;
import java.util.UUID;

public class TestOpenFinApp implements DesktopStateListener {

    private static final PrintStream log = System.out;
    private DesktopConnection desktopConnection;
    private volatile boolean ready = false;
    private ChannelProvider channelProvider;
    private static final String DESKTOP_CONNECTION_UUID = UUID.randomUUID().toString();
    private static final String APP_UUID = "openfin-demo-application";
    private static final String APP_CONFIG_URL = "http://localhost:9070/app_local.json";
    private static final String APP_CONFIG_VERSION = "18.87.55.19";
    private static final String CHANNEL_NAME = "openfin-test-channel";

    public TestOpenFinApp() throws Exception {
    }

    public void start() throws Exception {
        if (!ready) {
            ready = true;
            RuntimeConfiguration config = new RuntimeConfiguration();
            config.setRuntimeVersion(APP_CONFIG_VERSION);
            config.setAdditionalRuntimeArguments("--enable-mesh");
            desktopConnection = new DesktopConnection(DESKTOP_CONNECTION_UUID);
            desktopConnection.connect(config, this, 30000);
        }
    }

    public static void main(String[] args) throws Exception {
        TestOpenFinApp testOpenFinApp = new TestOpenFinApp();
        testOpenFinApp.start();
        log.println("Hello, world!");
        Thread.sleep(10000000);
    }

    @Override
    public void onReady() {
        log.println("onReady");
        initChannel();
    }

    @Override
    public void onClose(String s) {
        log.printf("onClose, %s", s);
    }

    @Override
    public void onError(String s) {
        log.printf("onError, %s", s);
    }

    @Override
    public void onMessage(String s) {
        log.printf("onMessage, %s", s);
    }

    @Override
    public void onOutgoingMessage(String s) {
        log.printf("onOutgoingMessage, %s", s);
    }

    private void initChannel() {
        log.println("initChannel");
        Channel channel = desktopConnection.getChannel(CHANNEL_NAME);
        channel.create(new AsyncCallback<ChannelProvider>() {
            @Override
            public void onSuccess(ChannelProvider channelProvider) {
                TestOpenFinApp.this.channelProvider = channelProvider;
                log.printf("Successfully created %s", CHANNEL_NAME);
                launchApp();
            }
        });
    }

    private void launchApp() {
        log.println("launchApp");
        Application demoApp = Application.wrap(APP_UUID, desktopConnection);
        demoApp.isRunning(running -> {
            if (!running) {
                try {
                    Application.createFromManifest(APP_CONFIG_URL, app -> {
                        try {
                            app.run();
                        } catch (DesktopException e) {
                            log.printf("Failed to run the app, error=%s", e);
                        }
                    }, null, desktopConnection);
                } catch (DesktopException e) {
                    log.printf("Failed to create the app from manifestUrl, error=%s", e);
                }

            } else {
                log.println("The app is already running");
            }
        }, null);
    }

}
