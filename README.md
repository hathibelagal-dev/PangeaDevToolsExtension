# PangeaDevToolsExtension
Extends Chrome's DevTools by adding Pangea's security-related services to it. Currently it works with both the URL Intel and Domain Intel services.

# Setup

First, you clone this repository:

```
git clone https://github.com/hathibelagal-dev/PangeaDevToolsExtension.git
```

And then you open up Google Chrome and visit this URL: `chrome://extensions/``

There, you just switch the **Developer Mode** option on.

<img src="https://raw.githubusercontent.com/hathibelagal-dev/PangeaDevToolsExtension/main/Screenshot%202024-04-26%20at%2019.53.11.png" width="640"/>

You can now press the **Load Unpacked** button and select the folder of the cloned repo.

<img src="https://raw.githubusercontent.com/hathibelagal-dev/PangeaDevToolsExtension/main/Screenshot%202024-04-26%20at%2019.57.51.png" width="640"/>

At this point the extension should be installed. You can now open any website and open **Developer Tools**. If you scroll horizontally through the list of tabs, you should find **Pangea Cloud**.

<img src="https://raw.githubusercontent.com/hathibelagal-dev/PangeaDevToolsExtension/main/Screenshot%202024-04-26%20at%2020.01.29.png" width="640"/>

As you can see in the screenshot above, you need to enter you Pangea token and domain, and hit the **Update** to start the calls to the APIs. This is a one time activity. You can close the **Developer Tools** and visit any other website. Now if you open the **Pangea Cloud** window, the scan show start automatically.
