import * as React from "react";
import {
    DataGrid,
    GridColDef,
    GridPaginationModel,
    GridValueGetterParams,
} from "@mui/x-data-grid";

import { convertObjectToColumnsDataGrid } from "../utils/myUtils";
import { DataList, ObjGridColDef } from "../types/types";

export default function ListItem({
    dataList,
    header,
    customColumns = [],
    style,
}: DataList) {
    const columns = React.useMemo(
        () => [
            ...convertObjectToColumnsDataGrid(dataList[0]),
            ...customColumns,
        ],
        [dataList],
    ) as GridColDef[];

    const rows = React.useMemo(() => dataList, [dataList]);

    function handleChangePage(model: GridPaginationModel) {
        // console.log("here", model);
    }

    return (
        <div style={style}>
            <h3 className="text-center mb-3">{header ?? "List Item"}</h3>
            <DataGrid
                rows={rows}
                columns={columns}
                autoPageSize
                // pageSize={true}
                // rowsPerPageOptions={[5]}
                // hideFooterPagination={true}
                hideFooter={true}
                onPaginationModelChange={handleChangePage}
                // checkboxSelection
            />
        </div>
    );
}
