import * as React from 'react';
import { DraggableHeader } from 'react-data-grid-addons';
import ReactDataGrid from 'react-data-grid';
import 'react-data-grid/dist/react-data-grid.css';
import Toolbar from './components/Toolbar';
import AppStore from './GridStore';
import { observer } from 'mobx-react';

@observer
class App extends React.Component<any, any> {
  store = AppStore;

  render() {
    return (
      <>
        <DraggableHeader.DraggableContainer onHeaderDrop={this.store.onHeaderDrop}>
          <ReactDataGrid
            columns={this.store.columns}
            rowGetter={i => this.store.visibleRows[i]}
            rowsCount={this.store.visibleRows.length}
            minHeight={500}
            toolbar={<Toolbar />}
            getValidFilterValues={() => []}
            onAddFilter={this.store.handleFilterChange}
          />
        </DraggableHeader.DraggableContainer>
      </>
    );
  }

}

export default App;
