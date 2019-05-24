import { Column, RowData, AddFilterEvent } from "react-data-grid";
import NumberFilterRenderer from "./components/NumberFilterRenderer";
import { TextFilterRenderer } from "./components/TextFilterRenderer";
import { observable } from 'mobx';

class AppStore {
    constructor() {
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.onHeaderDrop = this.onHeaderDrop.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
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
            filterRenderer: NumberFilterRenderer
        },
        {
            key: "title",
            name: "Title",
            draggable: true,
            resizable: true,
            filterable: true,
            filterRenderer: TextFilterRenderer
        },
        {
            key: "count",
            name: "Count",
            draggable: true,
            resizable: true,
            filterable: true,
            filterRenderer: NumberFilterRenderer
        }
    ];

    @observable
    public visibleRows: RowData[] = this.createRows();
    @observable
    private rows: RowData[] = this.createRows();
    @observable
    private filters: { [key: string]: AddFilterEvent } = {};


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
}
export default new AppStore();
