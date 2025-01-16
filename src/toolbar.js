import { UIDiv, UIInput, UILabel } from "./ui.js";

export class Toolbar {

	constructor(reader) {

		const strings = reader.strings;
		const settings = reader.settings;

		const container = new UIDiv().setId("toolbar");
		const keys = [
			"toolbar/sidebar",
			"toolbar/prev",
			"toolbar/next",
			"toolbar/openbook",
			"toolbar/openbook/error",
			"toolbar/bookmark",
			"toolbar/fullscreen",
			"toolbar/background",
		];

		/*------------------------ Toolbar Menu 1 --------------------------*/
		const menu1 = new UIDiv().setClass("menu-1");
		const openerBox = new UIDiv().setId("btn-m").setClass("box");
		const openerBtn = new UIInput("button");
		openerBtn.dom.title = strings.get(keys[0]);
		openerBtn.dom.onclick = (e) => {

			reader.emit("sidebaropener", true);
			openerBtn.dom.blur();
			e.preventDefault();
		};
		openerBox.add(openerBtn);
		menu1.add(openerBox);

		// Button "-", "+" and input for font-size
		let fontLabel = new UILabel().setClass("font-size-px").setTextContent("Fontsize (px):")
		let fontSizeBox = new UIDiv().setId("btn-fontsize").setClass("box");
		let decreaseFontBtn = new UIInput("button").setClass("btn-font-decrease");
		let increaseFontBtn = new UIInput("button").setClass("btn-font-increase");
		let fontSizeInput = new UIInput("text").setClass("input-font-size");

		let fontSize = settings.fontSize || 16;
		fontSizeInput.dom.value = fontSize;

		decreaseFontBtn.dom.textContent = "-";
		decreaseFontBtn.dom.onclick = () => {
			fontSize = Math.max(8, fontSize - 1);
			fontSizeInput.dom.value = fontSize;

			reader.emit("styleschanged", { fontSize: fontSize });
		};

		increaseFontBtn.dom.textContent = "+";
		increaseFontBtn.dom.onclick = () => {
			fontSize = Math.min(72, fontSize + 1);
			fontSizeInput.dom.value = fontSize;

			reader.emit("styleschanged", { fontSize: fontSize });
		};

		fontSizeInput.dom.onchange = () => {
			let newSize = parseInt(fontSizeInput.dom.value, 10);
			if (!isNaN(newSize) && newSize >= 8 && newSize <= 72) {
				fontSize = newSize;

				reader.emit("styleschanged", { fontSize: fontSize });
			} else {
				fontSizeInput.dom.value = fontSize;
			}
		};

		fontSizeBox.add(fontLabel);
		fontSizeBox.add(decreaseFontBtn);
		fontSizeBox.add(fontSizeInput);
		fontSizeBox.add(increaseFontBtn);
		menu1.add(fontSizeBox);


		let prevBox, prevBtn;
		let nextBox, nextBtn;
		if (settings.arrows === "toolbar") {
			prevBox = new UIDiv().setId("btn-p").setClass("box");
			prevBtn = new UIInput("button");
			prevBtn.setTitle(strings.get(keys[1]));
			prevBtn.dom.onclick = (e) => {

				reader.emit("prev");
				e.preventDefault();
				prevBtn.dom.blur();
			};
			prevBox.add(prevBtn);
			menu1.add(prevBox);

			nextBox = new UIDiv().setId("btn-n").setClass("box");
			nextBtn = new UIInput("button");
			nextBtn.dom.title = strings.get(keys[2]);
			nextBtn.dom.onclick = (e) => {

				reader.emit("next");
				e.preventDefault();
				nextBtn.dom.blur();
			};
			nextBox.add(nextBtn);
			menu1.add(nextBox);
		}

		/*------------------------ Toolbar Menu 2 --------------------------*/
		const menu2 = new UIDiv().setClass("menu-2");
		// Button change background
		let backgroundBox, colorPicker;
		if (settings.background) {
			// Init elements: background box div, input color picker
			backgroundBox = new UIDiv().setId("btn-bg").setClass("box");
			colorPicker = new UIInput("color").setClass("color-picker");
			colorPicker.dom.title = strings.get(keys[7]);

			// Handle event get color from color table of input color
			colorPicker.dom.oninput = (e) => {
				const selectedColor = e.target.value;

				// Emit 'colorchanged' event with selected color
				reader.emit("colorchanged", selectedColor);
			}

			backgroundBox.add(colorPicker);
			menu2.add(backgroundBox);
		}

		// Button open file
		let openbookBtn;
		if (settings.openbook) {
			const onload = (e) => {

				reader.storage.clear();
				reader.storage.set(e.target.result, () => {
					reader.unload();
					reader.init(e.target.result);
					const url = new URL(window.location.origin);
					window.history.pushState({}, "", url);
				});
			};
			const onerror = (e) => {
				console.error(e);
			};
			const openbookBox = new UIDiv().setId("btn-o").setClass("box");
			openbookBtn = new UIInput("file");
			openbookBtn.dom.title = strings.get(keys[3]);
			openbookBtn.dom.accept = "application/epub+zip";
			openbookBtn.dom.onchange = (e) => {

				if (e.target.files.length === 0)
					return;

				if (window.FileReader) {

					const fr = new FileReader();
					fr.onload = onload;
					fr.readAsArrayBuffer(e.target.files[0]);
					fr.onerror = onerror;
				} else {
					alert(strings.get(keys[4]));
				}

			};
			openbookBtn.dom.onclick = (e) => {

				openbookBtn.dom.blur();
			};
			openbookBox.add(openbookBtn);
			menu2.add(openbookBox);
		}

		// Button Bookmark
		let bookmarkBox, bookmarkBtn;
		if (settings.bookmarks) {
			bookmarkBox = new UIDiv().setId("btn-b").setClass("box");
			bookmarkBtn = new UIInput("button");
			bookmarkBtn.setTitle(strings.get(keys[5]));
			bookmarkBtn.dom.onclick = (e) => {

				const cfi = this.locationCfi;
				const val = reader.isBookmarked(cfi) === -1;
				reader.emit("bookmarked", val);
				e.preventDefault();
				bookmarkBtn.dom.blur();
			};
			bookmarkBox.add(bookmarkBtn);
			menu2.add(bookmarkBox);
		}

		// Button Full Screen
		let fullscreenBtn;
		if (settings.fullscreen) {

			const fullscreenBox = new UIDiv().setId("btn-f").setClass("box");
			fullscreenBtn = new UIInput("button");
			fullscreenBtn.setTitle(strings.get(keys[6]));
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

				const w = window.screen.width === e.target.clientWidth;
				const h = window.screen.height === e.target.clientHeight;

				if (w && h) {
					fullscreenBox.addClass("resize-small");
				} else {
					fullscreenBox.removeClass("resize-small");
				}
			};
			fullscreenBox.add(fullscreenBtn);
			menu2.add(fullscreenBox);
		}

		container.add([menu1, menu2]);
		document.body.appendChild(container.dom);

		//-- events --//

		reader.on("relocated", (location) => {

			if (settings.bookmarks) {
				const cfi = location.start.cfi;
				const val = reader.isBookmarked(cfi) === -1;
				if (val) {
					bookmarkBox.removeClass("bookmarked");
				} else {
					bookmarkBox.addClass("bookmarked");
				}
				this.locationCfi = cfi; // save location cfi
			}
			if (settings.arrows === "toolbar") {
				prevBox.dom.style.display = location.atStart ? "none" : "block";
				nextBox.dom.style.display = location.atEnd ? "none" : "block";
			}
		});

		reader.on("bookmarked", (boolean) => {

			if (boolean) {
				bookmarkBox.addClass("bookmarked");
			} else {
				bookmarkBox.removeClass("bookmarked");
			}
		});

		reader.on("languagechanged", (value) => {

			openerBtn.setTitle(strings.get(keys[0]));

			if (settings.arrows === "toolbar") {
				prevBtn.setTitle(strings.get(keys[1]));
				nextBtn.setTitle(strings.get(keys[2]));
			}
			if (settings.openbook) {
				openbookBtn.setTitle(strings.get(keys[3]));
			}
			if (settings.bookmarks) {
				bookmarkBtn.setTitle(strings.get(keys[5]));
			}
			if (settings.fullscreen) {
				fullscreenBtn.setTitle(strings.get(keys[6]));
			}
			if (settings.background) {
				backgroundBtn.setTitle(strings.get(keys[7]));
			}
			
		});
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