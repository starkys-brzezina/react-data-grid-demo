import { Column, RowData, AddFilterEvent, DEFINE_SORT, RowSelectionParams } from "react-data-grid";
import NumberFilterRenderer from "./components/NumberFilterRenderer";
import { TextFilterRenderer } from "./components/TextFilterRenderer";
import { observable, runInAction } from 'mobx';

class AppStore {
    constructor() {
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.onHeaderDrop = this.onHeaderDrop.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.onGridSort = this.onGridSort.bind(this);
        this.compareRows = this.compareRows.bind(this);
        this.onRowsSelected = this.onRowsSelected.bind(this);
        this.onRowsDeselected = this.onRowsDeselected.bind(this);
    }

    @observable
    public columns: Column[] = [
        {
            key: "id",
            name: "ID",
            width: 50,
            draggable: true,
            resizable: true,
            filterable: true,
            sortable: true,
            filterRenderer: NumberFilterRenderer
        },
        {
            key: "title",
            name: "Title",
            draggable: true,
            resizable: true,
            filterable: true,
            sortable: true,
            filterRenderer: TextFilterRenderer
        },
        {
            key: "count",
            name: "Count",
            draggable: true,
            resizable: true,
            filterable: true,
            sortable: true,
            filterRenderer: NumberFilterRenderer
        }
    ];

    @observable
    public visibleRows: RowData[] = this.createRows();
    @observable
    private rows: RowData[] = this.createRows();
    @observable
    private filters: { [key: string]: AddFilterEvent } = {};
    @observable
    private sort: { sortColumn: string, sortDirection: string } = { sortColumn: "", sortDirection: "NONE" };
    @observable public selectedIndexes: number[] = [];


    private createRows() {
        let rows = [];
        for (let i = 1; i < 1000; i++) {
            rows.push({
                id: i,
                title: "Title " + i,
                count: i * 1000
            });
        }

        return rows;
    };

    public clearFilters() {
        this.visibleRows = this.rows;
    }

    public get filterActive() {
        return !!Object.keys(this.filters).length
    }

    public handleFilterChange(filter: AddFilterEvent) {
        const filters = { ...this.filters };
        if (filter.rawValue === "") {
            delete filters[filter.column.key];
        }
        else {
            filters[filter.column.key] = filter;
        }
        const visibleRows = this.rows.filter((row) => {
            return filter.filterValues(row, filter, filter.column.key)
        })
        this.filters = filters;
        this.visibleRows = visibleRows;
    };

    public onHeaderDrop(source: any, target: any) {
        const columns = this.columns;

        const columnSourceIndex = this.columns.findIndex(
            i => i.key === source
        );
        const columnTargetIndex = this.columns.findIndex(
            i => i.key === target
        );

        columns.splice(
            columnTargetIndex,
            0,
            columns.splice(columnSourceIndex, 1)[0]
        );
        this.columns = columns;
    };

    private compareRows(a: RowData, b: RowData) {
        const A = a[this.sort.sortColumn] as any;
        const B = b[this.sort.sortColumn] as any;

        if (this.sort.sortDirection === "ASC") {
            return A > B ? 1 : A < B ? -1 : 0;
        } else if (this.sort.sortDirection === "DESC") {
            return A < B ? 1 : A > B ? -1 : 0;
        }
        else return 0
    }

    public get sortedFilteredRows() {
        return this.sort.sortDirection === "NONE" ? this.visibleRows : [...this.visibleRows].sort(this.compareRows);
    }

    public onGridSort(sortColumn: string, sortDirection: DEFINE_SORT) {
        this.sort = { sortColumn, sortDirection };
    }

    public onRowsSelected(rows: RowSelectionParams[]) {
        this.selectedIndexes = [...this.selectedIndexes, ...rows.map(r => r.rowIdx)];
    }

    public onRowsDeselected(rows: RowSelectionParams[]) {
        rows.forEach((row) => {
            runInAction(() => {
                this.selectedIndexes.splice(this.selectedIndexes.indexOf(row.rowIdx, 1));
            })
        })
    }
}
export default new AppStore();
