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
            toggleBookList();
        };

        appRecBox.add(appRecBtn);
        rightAction.add(appRecBox);

        function toggleBookList() {
            const bookList = [
                { title: "Determined", author: "Robert M. Sapolsky", page: 1 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 2 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 3 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 4 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 5 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 6 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 7 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 8 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 9 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 10 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 11 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 12 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 13 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 14 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 15 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 16 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 17 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 18 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 19 },
                { title: "Determined", author: "Robert M. Sapolsky", page: 20 },
            ];

            let existingModal = document.getElementById('book-list-modal');
            if (!existingModal) {
                let modal = document.createElement('div');
                modal.setAttribute('id', 'book-list-modal');
                modal.setAttribute('class', 'book-modal');

                let modalContent = document.createElement('div');
                modalContent.setAttribute('class', 'book-modal-content');

                let bookGrid = document.createElement('div');
                bookGrid.setAttribute('class', 'book-grid');
                bookList.forEach((book) => {
                    let bookItem = document.createElement('div');
                    bookItem.setAttribute('class', 'book-item');
                    bookItem.innerHTML = `
                        <div class="book-info">
                            <p class="book-title">${book.title}</p>
                            <p class="book-author">${book.author}</p>
                        </div>
                        <div class="book-cover">${book.page}</div>
                    `;
                    bookGrid.appendChild(bookItem);
                });

                modalContent.appendChild(bookGrid);
                modal.appendChild(modalContent);

                container.dom.appendChild(modal);
            }

            let modal = document.getElementById('book-list-modal');
            modal.classList.toggle("active");
        }


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
