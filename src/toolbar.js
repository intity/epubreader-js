import { UIButton, UIDiv, UIInput, UILabel, UILink, UISpan, UIText } from "./ui.js";
import { SearchPanel } from "./sidebar/search.js";

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
			"toolbar/search",
			"toolbar/close",
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

		/* ------------------------ Button Logo ------------------------- */
		const logoBox = new UIDiv().setId("btn-logo").setClass("logo");
		const logoLink = new UILink().setId("logo-link").setHref("#").setTextContent("LOGO");

		logoBox.add(logoLink);
		menu1.add(logoBox);

		/* ------------------------ Button Index List (muc luc) -------------------------- */
		let tocBox, tocBtn;
		tocBox = new UIDiv().setId("btn-t").setClass("box");
		tocBtn = new UIInput("button");

		// load toc content title for toc list
		tocBtn.dom.onclick = (e) => {
			e.stopPropagation();
			reader.book.loaded.navigation.then((toc) => {
				showToc(toc);
			})
		}

		tocBox.add(tocBtn);
		menu1.add(tocBox);

		// Function to show the toc list
		function showToc(toc) {
			let existingToc = document.getElementById("toolbar-toc-list");

			if (existingToc) {
				existingToc.remove();
			} else {
				let tocList = document.createElement("ul");
				tocList.setAttribute("id", "toolbar-toc-list");

				let tocTitle = document.createElement("h3");
				tocTitle.textContent = "Mục lục";

				tocList.appendChild(tocTitle);

				toc.forEach((chapter) => {
					let tocItem = document.createElement("li");
					let tocLink = document.createElement("a");

					tocLink.href = "#";
					tocLink.textContent = chapter.label;

					tocLink.onclick = (e) => {
						e.preventDefault();

						document.querySelectorAll("#toolbar-toc-list li a").forEach((link) => {
							link.classList.remove("active");
						})

						tocLink.classList.add("active");

						// show the chapter with the title chosed in toc list
						reader.rendition.display(chapter.href);
					};

					tocItem.appendChild(tocLink);
					tocList.appendChild(tocItem);
				});

				tocBox.dom.appendChild(tocList);
			}

			let tocList = document.getElementById("toolbar-toc-list");
			tocList.classList.toggle("active");
		}



		/* ------------------------ Button My Bookmark (bookmark cua toi) --------------------------*/
		let bookmarksBox, bookmarksBtn;
		bookmarksBox = new UIDiv().setId("btn-d").setClass("box");
		bookmarksBtn = new UIInput("button");

		bookmarksBtn.dom.onclick = (e) => {
			e.stopPropagation();
			showBookmarks();
		}

		bookmarksBox.add(bookmarksBtn);
		menu1.add(bookmarksBox);

		function showBookmarks() {
			let bookmarksList = document.getElementById("toolbar-bookmarks-list");

			if (!bookmarksList) {
				bookmarksList = document.createElement("ul");
				bookmarksList.setAttribute("id", "toolbar-bookmarks-list");
				bookmarkBox.dom.appendChild(bookmarksList);
			}

			updateBookmarksList();
			bookmarksList.classList.toggle("active");
		}

		reader.on("bookmarked", (boolean, cfi) => {
			updateBookmarksList();
		})

		function updateBookmarksList() {
			let bookmarksList = document.getElementById("toolbar-bookmarks-list");

			if (!bookmarksList) return;

			bookmarksList.innerHTML = "";

			let title = document.createElement("h3");
			title.textContent = "Bookmarks của tui";
			bookmarksList.appendChild(title);

			reader.settings.bookmarks.forEach((cfi, index) => {
				let bookmarkItem = document.createElement("li");
				let bookmarkLink = document.createElement("a");
				let deleteBtn = document.createElement("span");

				bookmarkLink.href = "#";
				bookmarkLink.textContent = `Bookmark ${index + 1}`;

				bookmarkLink.onclick = (e) => {
					e.preventDefault();

					document.querySelectorAll("#toolbar-bookmarks-list li a").forEach((link) => {
						link.classList.remove("active");
					});

					bookmarkLink.classList.add("active");

					reader.rendition.display(cfi);
				};

				deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';
				deleteBtn.onclick = (e) => {
					e.stopPropagation();
					reader.removeBookmarkFromToolbar(cfi);
				};

				bookmarkItem.appendChild(bookmarkLink);
				bookmarkItem.appendChild(deleteBtn);
				bookmarksList.appendChild(bookmarkItem);
			})
		}

		// Hàm xóa bookmark từ toolbar
		reader.removeBookmarkFromToolbar = function (cfi) {

			let bookmarksList = document.getElementById("toolbar-bookmarks-list");
			if (!bookmarksList) return;

			let bookmarkItems = bookmarksList.querySelectorAll("li");
			let targetItem = Array.from(bookmarkItems).find(item => {
				return item.querySelector("a").textContent.includes(cfi);
			});

			if (targetItem) {
				targetItem.remove();
			}

			const index = reader.settings.bookmarks.indexOf(cfi);
			if (index !== -1) {
				reader.settings.bookmarks.splice(index, 1);
			}

			reader.emit("bookmarked", false, cfi);
			reader.bookmarksPanel.removeBookmark(cfi);
		};



		/* ------------------------ Button Highlight And Note ---------------------------- */
		let annotationsBox, annotationsBtn;
		annotationsBox = new UIDiv().setId("btn-a").setClass("box");
		annotationsBtn = new UIInput("button");

		// show annotations list when click icon on toolbar
		annotationsBtn.dom.onclick = (e) => {
			e.stopPropagation();
			showAnnotations();
		}

		annotationsBox.add(annotationsBtn);
		menu1.add(annotationsBox);

		// Function to show the annotations list
		function showAnnotations() {
			let existingList = document.getElementById("toolbar-annotations-list");

			if (!existingList) {
				let annotationsList = document.createElement("ul");
				annotationsList.setAttribute("id", "toolbar-annotations-list");

				let title = document.createElement("h3");
				title.textContent = "Highlights & Ghi chú";

				annotationsList.appendChild(title);

				reader.settings.annotations.forEach((note) => {
					let noteItem = document.createElement("li");
					let noteLink = document.createElement("a");
					let deleteBtn = document.createElement("span");

					noteLink.href = "#";
					noteLink.textContent = note.text;

					noteLink.onclick = (e) => {
						e.preventDefault();

						document.querySelectorAll("#toolbar-annotations-list li a").forEach((link) => {
							link.classList.remove("active");
						})

						noteLink.classList.add("active");

						reader.rendition.display(note.cfi);
					}

					deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';
					// emit event to delete annotation items
					deleteBtn.onclick = (e) => {
						e.stopPropagation();
						reader.removeNoteFromToolbar(note);
					}

					noteItem.appendChild(noteLink);
					noteItem.appendChild(deleteBtn);
					annotationsList.appendChild(noteItem);
				})

				annotationsBox.dom.appendChild(annotationsList);
			}

			let annotationsList = document.getElementById("toolbar-annotations-list");
			annotationsList.classList.toggle("active");
		}

		reader.removeNoteFromToolbar = function (note) {
			let annotationsList = document.getElementById("toolbar-annotations-list");
			if (!annotationsList) return;

			let noteItems = annotationsList.querySelectorAll("li");
			let targetItem = Array.from(noteItems).find(item => {
				item.querySelector('a').textContent === note.text;
			})

			if (targetItem) {
				targetItem.remove();
			}

			const annotationsPanel = reader.annotationsPanel;
			if (annotationsPanel) {
				annotationsPanel.removeNote(note);
				annotationsPanel.update();
			}

			const index = reader.settings.annotations.findIndex((n) => n.cfi === note.cfi);
			if (index !== -1) {
				reader.settings.annotations.splice(index, 1);
			}

			reader.rendition.annotations.remove(note.cfi, "highlight");
		}




		/* ----------------------------- Current Page -------------------------------- */
		const centerPageCount = new UIDiv().setClass("menu-center");

		const centerLabel = new UILabel().setClass("toolbar-center-label");
		centerLabel.setTextContent("Determined");

		const curOfTotal = new UIDiv().setClass("page-map");
		const curPageIndex = new UISpan().setClass("current-page-index").setTextContent("1");
		const separator = new UIText().setTextContent(" của ");
		const totalPage = new UISpan().setClass("total-pages").setTextContent("200");

		curOfTotal.add(curPageIndex);
		curOfTotal.add(separator);
		curOfTotal.add(totalPage);

		centerPageCount.add(centerLabel);
		centerPageCount.add(curOfTotal);



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


		// Button "A-", "A+" and input (hidden) for font-size
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
		menu2.add(fontSizeBox);


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


		// Button search 
		let searchBox, searchBtn;
		let searchInput, searchResults;
		searchBox = new UIDiv().setId("btn-s").setClass("box");
		searchBtn = new UIInput("button");
		searchBtn.setTitle(strings.get(keys[8]));

		searchBtn.dom.onclick = (e) => {
			e.stopPropagation();
			showSearchPopup();
		}

		searchBox.add(searchBtn);
		menu2.add(searchBox);

		function showSearchPopup() {
			let existingPopup = document.getElementById("toolbar-search-list");
			if (!existingPopup) {
				let searchPopup = document.createElement("div");
				searchPopup.setAttribute("id", "toolbar-search-list");
				searchPopup.classList.add("search-popup");

				let searchContainer = document.createElement("div");
				searchContainer.classList.add("search-container");

				let searchIcon = document.createElement("span");
				searchIcon.classList.add("search-icon");
				searchIcon.innerHTML = '<i class="bi bi-search"></i>';

				let searchInput = document.createElement("input");
				searchInput.setAttribute("type", "search");
				searchInput.setAttribute("placeholder", "Search");
				searchInput.setAttribute("id", "nav-q");
				searchInput.setAttribute("class", "toolbar-search-input");

				searchContainer.appendChild(searchIcon);
				searchContainer.appendChild(searchInput);

				let resultContainer = document.createElement("ul");
				resultContainer.setAttribute('id', 'toolbar-search-results');

				let searchPanel = new SearchPanel(reader);
				searchInput.oninput = async () => {
					let query = searchInput.value.trim();
					if (query.length > 0) {
						let results = await searchPanel.doSearch(query);
						resultContainer.innerHTML = "";

						if (results.length === 0) {
							let noResultItem = document.createElement("li");
							noResultItem.innerText = "Không tìm thấy kết quả trùng khớp";
							noResultItem.style.color = "gray";
							noResultItem.style.padding = "8px";
							resultContainer.appendChild(noResultItem);
						}

						results.forEach((data) => {
							let item = document.createElement("li");
							let link = document.createElement("a");
							link.href = "#" + data.cfi;
							link.textContent = data.excerpt;
							link.onclick = (e) => {
								e.preventDefault();
								searchPanel.reader.rendition.display(data.cfi);
							}
							item.appendChild(link);
							resultContainer.appendChild(item);
						})
					} else {
						resultContainer.innerHTML = "";
					}
				}

				searchPopup.appendChild(searchContainer);
				searchPopup.appendChild(resultContainer);
				searchBox.dom.appendChild(searchPopup);
			}

			let searchPopup = document.getElementById("toolbar-search-list");
			searchPopup.classList.toggle("active");
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

		container.add([menu1, centerPageCount, menu2]);
		document.body.appendChild(container.dom);

		// Button Close
		let closeBox, closeBtn;
		closeBox = new UIDiv().setId("btn-close").setClass("box");
		closeBtn = new UIInput("button").setClass("active");
		closeBtn.setTitle(strings.get(keys[9]));



		closeBox.add(closeBtn);
		menu2.add(closeBox);


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