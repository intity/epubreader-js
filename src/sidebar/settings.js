import { UIPanel, UIRow, UISelect, UIInput, UILabel, UINumber, UIText, UIBox, UIDiv } from "../ui.js";

export class SettingsPanel extends UIPanel {

	constructor(reader) {

		super();
		super.setId("settings");

		const strings = reader.strings;
		const keys = [
			"sidebar/settings",
			"sidebar/settings/language",
			"sidebar/settings/fontsize",
			"sidebar/settings/flow",
			"sidebar/settings/spread",
			"sidebar/settings/spread/minwidth"
		];
		const headerLabel = new UIText(strings.get(keys[0])).setClass("label");
		this.add(new UIBox(headerLabel).addClass("header"));

		const languageLabel = new UILabel(strings.get(keys[1]), "language-ui");
		const languageRow = new UIRow();
		const language = new UISelect().setOptions({
			en: "English",
			fr: "French",
			ja: "Japanese",
			ru: "Russian",
			zh: "Chinese"
		});
		language.dom.onchange = (e) => {

			reader.emit("languagechanged", e.target.value);
		};
		language.setId("language-ui");
		languageRow.add(languageLabel);
		languageRow.add(language);

		const fontSizeLabel = new UILabel(strings.get(keys[2]), "fontsize");
		const fontSizeRow = new UIRow();
		const fontSize = new UINumber(100, 1);
		fontSize.dom.onchange = (e) => {

			reader.emit("styleschanged", {
				fontSize: parseInt(e.target.value)
			});
		};
		fontSize.setId("fontsize")
		fontSizeRow.add(fontSizeLabel);
		fontSizeRow.add(fontSize);

		//-- flow configure --//

		const flowLabel = new UILabel(strings.get(keys[3]), "flow");
		const flowRow = new UIRow();
		const flow = new UISelect().setOptions({
			paginated: "Paginated",
			scrolled: "Scrolled"
		});
		flow.dom.onchange = (e) => {

			reader.emit("flowchanged", e.target.value);

			if (e.target.value === "scrolled") {
				reader.emit("spreadchanged", {
					mod: "none",
					min: undefined
				});
			} else {
				reader.emit("spreadchanged", {
					mod: undefined,
					min: undefined
				});
			}
		};
		flow.setId("flow");
		flowRow.add(flowLabel);
		flowRow.add(flow);

		//-- spdead configure --//

		const minSpreadWidth = new UINumber(800, 1);
		const spreadLabel = new UILabel(strings.get(keys[4]), "spread");
		const spreadRow = new UIRow();
		const spread = new UISelect().setOptions({
			none: "None",
			auto: "Auto"
		});
		spread.dom.onchange = (e) => {

			reader.emit("spreadchanged", {
				mod: e.target.value,
				min: undefined
			});
			minSpreadWidth.dom.disabled = e.target.value === "none";
		};
		spread.setId("spread");

		spreadRow.add(spreadLabel);
		spreadRow.add(spread);

		const minSpreadWidthLabel = new UILabel(strings.get(keys[5]), "min-spread-width");
		const minSpreadWidthRow = new UIRow();
		minSpreadWidth.dom.onchange = (e) => {

			reader.emit("spreadchanged", {
				mod: undefined,
				min: parseInt(e.target.value)
			});
		};
		minSpreadWidth.setId("min-spread-width");
		minSpreadWidthRow.add(minSpreadWidthLabel);
		minSpreadWidthRow.add(minSpreadWidth);

		//-- pagination --//

		const paginationStr = strings.get("sidebar/settings/pagination");
		const paginationRow = new UIRow();
		const pagination = new UIInput("checkbox", false, paginationStr[1]);
		pagination.setId("pagination");
		pagination.dom.onclick = (e) => {

			// not implemented
		};

		paginationRow.add(new UILabel(paginationStr[0], "pagination"));
		paginationRow.add(pagination);

		this.add(new UIBox([
			languageRow,
			fontSizeRow,
			flowRow,
			spreadRow,
			minSpreadWidthRow,
			//paginationRow
		]));

		//-- events --//

		reader.on("bookready", (cfg) => {

			language.setValue(cfg.language);
			fontSize.setValue(cfg.styles.fontSize);
			flow.setValue(cfg.flow);
			spread.setValue(cfg.spread.mod);
			minSpreadWidth.setValue(cfg.spread.min);
			minSpreadWidth.dom.disabled = cfg.spread.mod === "none";
		});

		reader.on("layout", (props) => {

			if (props.flow === "scrolled") {
				spread.setValue("none");
				spread.dom.disabled = true;
				minSpreadWidth.dom.disabled = true;
			} else {
				spread.dom.disabled = false;
			}
		});

		reader.on("languagechanged", (value) => {

			headerLabel.setTextContent(strings.get(keys[0]));
			languageLabel.setTextContent(strings.get(keys[1]));
			fontSizeLabel.setTextContent(strings.get(keys[2]));
			flowLabel.setTextContent(strings.get(keys[3]));
			spreadLabel.setTextContent(strings.get(keys[4]));
			minSpreadWidthLabel.setTextContent(strings.get(keys[5]));
		});
	}
}