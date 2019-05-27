import * as React from 'react';
import { ToolbarProps } from 'react-data-grid';
import { observer } from 'mobx-react';
import AppStore from '../GridStore';

interface CustomToolbarProps {
    children?: JSX.Element;
}

@observer
export default class Toolbar extends React.Component<CustomToolbarProps> {
    store = AppStore;

    get injectedProps(): ToolbarProps {
        return this.props as ToolbarProps;
    }

    componentDidMount() {
        this.injectedProps.onToggleFilter();
    }

    render() {
        return (
            <div>
                {this.store.filterActive && <button onClick={this.store.clearFilters}>Clear filters</button>}
                {this.props.children}
            </div>
        );
    }
}
