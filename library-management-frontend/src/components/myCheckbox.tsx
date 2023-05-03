import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { TypeMyCheckbox } from "../types/types";
import * as React from "react";
import { qs } from "../utils/myUtils";

export default function MyCheckbox({
    listData,
    id,
    classCss,
    fieldLabel,
}: TypeMyCheckbox) {
    const isObject = (data: any) => {
        return typeof data === "object" && data !== null;
    };

    return (
        <div id={id} className={classCss}>
            {listData.map((checkField, index) => {
                return (
                    <div key={index} className="form-check mb-2">
                        <input
                            data-id={checkField.id ?? ""}
                            data-index={index}
                            style={{ width: "1.25em", height: "1.25em" }}
                            className="form-check-input me-2"
                            type="checkbox"
                            id="flexCheckDefault"
                        />
                        <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                        >
                            {fieldLabel &&
                            isObject(checkField) &&
                            fieldLabel in checkField
                                ? checkField[fieldLabel]
                                : fieldLabel}
                        </label>
                    </div>
                );
            })}
        </div>
    );
}
