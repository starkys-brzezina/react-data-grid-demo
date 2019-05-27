import * as React from 'react';
import { DraggableHeader } from 'react-data-grid-addons';
import ReactDataGrid from 'react-data-grid';
import 'react-data-grid/dist/react-data-grid.css';
import Toolbar from './Toolbar';
import AppStore from './GridStore';
import { observer } from 'mobx-react';
import { Grid } from 'pd-components';

@observer
class App extends React.Component<any, any> {
  store = AppStore;

  render() {
    console.info(Grid);
    return (
      <>
        <DraggableHeader.DraggableContainer onHeaderDrop={this.store.onHeaderDrop}>
          <ReactDataGrid
            columns={this.store.columns}
            rowGetter={i => this.store.sortedFilteredRows[i]}
            rowsCount={this.store.sortedFilteredRows.length}
            minHeight={500}
            toolbar={<Toolbar />}
            getValidFilterValues={() => []}
            onAddFilter={this.store.handleFilterChange}
            onGridSort={this.store.onGridSort}
            rowSelection={{
              showCheckbox: true,
              onRowsSelected: this.store.onRowsSelected,
              onRowsDeselected: this.store.onRowsDeselected,
              selectBy: {
                indexes: this.store.selectedIndexes
              }
            }}
          />
        </DraggableHeader.DraggableContainer>
      </>
    );
  }

}

export default App;
