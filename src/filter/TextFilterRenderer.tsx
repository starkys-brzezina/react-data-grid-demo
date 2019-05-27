import * as React from 'react';
import { RowData, AddFilterEvent, FilterTerm } from 'react-data-grid';
import { CustomFilterRenderer } from './CustomFilterRenderer';

enum RuleType {
    FullText,
    EndsWith,
    StartWith,
    DoesNotMatch,
    ExactMatch
};

export class TextFilterRenderer extends CustomFilterRenderer {
    getRules(value: string): FilterTerm[] {
        let result: FilterTerm[] = [];

        if (value === '') {
            return result;
        }

        let split = [value];
        if (value.indexOf('"') === -1) {
            // if there are double quotes, skip checking string on ","
            // otherwise results will be wrong
            split = value.split(',');
        }

        split.forEach((t) => {
            const text = t.trim();

            if (text === '') {
                return result;
            }

            if (text.indexOf('*') === 0) {
                // ends with given value and starts with any value (*)
                result.push({
                    type: RuleType.StartWith,
                    value: text.split('*')[1]
                });
            } else if (text.indexOf('*') === text.length - 1) {
                // Starts with given value and ends with any value (*)
                result.push({
                    type: RuleType.EndsWith,
                    value: text.split('*')[0]
                });
            } else if (text.indexOf('-') === 0) {
                // remove given word from search
                result.push({
                    type: RuleType.DoesNotMatch,
                    value: text.split('-')[1]
                });
            } else if (text.indexOf('*') === 0 && text.length === 1) {
                // only * in input => display everything
                result.push({
                    type: RuleType.FullText,
                    value: ''
                });
            } else if ((text.indexOf('"') === 0) && (text.lastIndexOf('"') === text.length - 1)) {
                result.push({
                    type: RuleType.ExactMatch,
                    value: text.split('"')[1]
                });
            } else {
                // everything else
                result.push({
                    type: RuleType.FullText,
                    value: text
                });
            }
        });

        return result;
    }

    filterValues(row: RowData, columnFilter: AddFilterEvent, columnKey: string): boolean {
        if (!columnFilter.filterTerm.length) {
            return true;
        }

        return columnFilter.filterTerm.every((rule) => {
            if (rule.value === null || '') return true;

            const value = row[columnKey] as string;
            const ruleValue = rule.value as string;

            switch (rule.type) {
                case RuleType.FullText:
                    const regex = new RegExp(ruleValue, 'gi');
                    return !!value.toString().match(regex);
                case RuleType.EndsWith:
                    // if columnKey exist, check if filter column value ends with filter value
                    return value.toLowerCase().endsWith(ruleValue.toLowerCase())
                case RuleType.StartWith:
                    // if columnKey exist, check if filter column value starts with any filter value
                    return value.toLowerCase().startsWith(ruleValue.toLowerCase())
                case RuleType.DoesNotMatch:
                    // if column value is not equal searched value, remove it from search
                    return value.toLowerCase() !== ruleValue.toLowerCase()
                case RuleType.ExactMatch:
                    return value.toLowerCase() === ruleValue.toLowerCase()
                default:
                    return false;
            }
        })
    }

    handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) { }

    render() {
        const inputKey = `header-filter-${this.props.column.key}`;
        const tooltipText = 'Input Methods: Range (x-y), Greater Then (>x), Less Then (<y)';

        return (
            <div>
                <div>
                    <input key={inputKey} type="text" placeholder="Fulltextové vyhledávání" className="form-control input-sm" onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
                </div>
                <div className="input-sm">
                    <span className="badge" title={tooltipText}>?</span>
                </div>
            </div >
        );
    }
}
