import * as React from 'react';
import { FilterRendererProps, RowData, AddFilterEvent, FilterTerm } from 'react-data-grid';

export abstract class CustomFilterRenderer extends React.Component<FilterRendererProps> {
    constructor(props: FilterRendererProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.getRules = this.getRules.bind(this);
    }

    /** Handle change */
    protected handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let filter = this.getRules(e.target.value);
        if (this.props.onChange) {
            this.props.onChange({ filterTerm: filter, column: this.props.column, filterValues: this.filterValues, rawValue: e.target.value });
        }
    }

    /** Get applied filter rule */
    abstract getRules(value: string): FilterTerm[];

    /** Check if columns value of current row is allowed by filter */
    abstract filterValues(row: RowData, columnFilter: AddFilterEvent, columnKey: string): boolean;

    /** Validate the input */
    abstract handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void;

    /** Render filter */
    abstract render(): React.ReactNode;
}
