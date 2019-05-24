import * as React from 'react';
import { CustomFilterRenderer } from './CustomFilterRenderer';
import { RowData, AddFilterEvent, FilterTerm } from 'react-data-grid';


enum RuleType {
    ExactNumber,
    Range,
    GreaterThen,
    LessThen
};

export default class NumberFilterRenderer extends CustomFilterRenderer {
    getRules(value: string): FilterTerm[] {
        const rules: FilterTerm[] = [];
        if (value === '') {
            return rules;
        }
        // check comma
        const list = value.split(',');
        if (list.length > 0) {
            // handle each value with comma
            for (const key in list) {
                if (!list.hasOwnProperty(key)) {
                    continue;
                }

                const obj = list[key];
                if (obj.indexOf('-') > 0) { // handle dash
                    const begin = parseInt(obj.split('-')[0], 10);
                    const end = parseInt(obj.split('-')[1], 10);
                    rules.push({ type: RuleType.Range, begin, end } as any);
                } else if (obj.indexOf('>') > -1) { // handle greater then
                    const begin = parseInt(obj.split('>')[1], 10);
                    rules.push({ type: RuleType.GreaterThen, value: begin });
                } else if (obj.indexOf('<') > -1) { // handle less then
                    const end = parseInt(obj.split('<')[1], 10);
                    rules.push({ type: RuleType.LessThen, value: end });
                } else { // handle normal values
                    const numericValue = parseInt(obj, 10);
                    rules.push({ type: RuleType.ExactNumber, value: numericValue });
                }
            }
        }
        return rules;
    }

    filterValues(row: RowData, columnFilter: AddFilterEvent, columnKey: string): boolean {
        if (!columnFilter.filterTerm.length) {
            return true;
        }

        return columnFilter.filterTerm.every((rule) => {
            if (rule.value === null) return true;

            const value = row[columnKey] as number;
            const ruleValue = rule.value as number;

            switch (rule.type) {
                case RuleType.ExactNumber:
                    return ruleValue === value
                case RuleType.GreaterThen:
                    return rule && ruleValue <= value
                case RuleType.LessThen:
                    return rule && ruleValue >= value
                case RuleType.Range:
                    return (rule as any).begin <= value && (rule as any).end >= value
                default:
                    return false;
            }
        })
    }

    handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        const regex = '>|<|-|,|([0-9])';
        const result = RegExp(regex).test(e.key);
        if (result === false) {
            e.preventDefault();
        }
    }

    render() {
        const inputKey = `header-filter-${this.props.column.key}`;
        const tooltipText = 'Input Methods: Range (x-y), Greater Then (>x), Less Then (<y)';

        return (
            <div>
                <div>
                    <input key={inputKey} type="text" placeholder="e.g. 3,10-15,>20" className="form-control input-sm" onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
                </div>
                <div className="input-sm">
                    <span className="badge" title={tooltipText}>?</span>
                </div>
            </div>
        );
    }
}
