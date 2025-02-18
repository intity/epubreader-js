import { UIDiv, UILabel, UIInput } from "./ui.js";

export class Status {
    constructor(reader) {
        const strings = reader.strings;
        const settings = reader.settings;

        const container = new UIDiv().setId("status-bar");
        const keys = [
            "status/fullscreen",
            "status/apprec",
        ];

        /* ---------------------------- Status Bar ----------------------------- */
        const leftText = new UIDiv().setClass("status-title");
        const rightAction = new UIDiv().setClass("status-action");

        let text = new UILabel().setClass("status-text").setTextContent("Trang cuối của chương");
        leftText.add(text);


        // Button apps rectangle
        let appRecBtn;
        const appRecBox = new UIDiv().setId("btn-ar").setClass("box");
        appRecBtn = new UIInput("button");
        appRecBtn.setTitle(strings.get(keys[1]));
        appRecBtn.dom.onclick = (e) => {
            e.preventDefault();
        };

        appRecBox.add(appRecBtn);
        rightAction.add(appRecBox);


        // Button Full Screen
        let fullscreenBtn;
        if (settings.fullscreen) {

            const fullscreenBox = new UIDiv().setId("btn-f").setClass("box");
            fullscreenBtn = new UIInput("button");
            fullscreenBtn.setTitle(strings.get(keys[0]));
            fullscreenBtn.dom.onclick = (e) => {

                this.toggleFullScreen();
                e.preventDefault();
            };

            document.onkeydown = (e) => {

                if (e.key === "F11") {
                    e.preventDefault();
                    this.toggleFullScreen();
                }
            };

            document.onfullscreenchange = (e) => {

                // const w = window.screen.width === e.target.clientWidth;
                // const h = window.screen.height === e.target.clientHeight;

                if (document.fullscreenElement) {
                    fullscreenBox.addClass("resize-small");
                } else {
                    fullscreenBox.removeClass("resize-small");
                }
            };


            fullscreenBox.add(fullscreenBtn);
            rightAction.add(fullscreenBox);
        }

        reader.on("languagechanged", (value) => {
            if (settings.fullscreen) {
                fullscreenBtn.setTitle(strings.get(keys[0]));
            }
        });


        container.add([leftText, rightAction]);
        document.body.appendChild(container.dom);
    }

    toggleFullScreen() {

        document.activeElement.blur();

        if (document.fullscreenElement === null) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
